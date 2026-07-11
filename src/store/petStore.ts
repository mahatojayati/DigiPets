import { create } from "zustand";
import { Pet } from "../types/pet";

interface PetStoreState {
  activePet: Pet | null;
  savedPets: Pet[];
  equippedAccessories: string[];
  hunger: number; // 0 to 100, where 100 is fully fed
  energy: number; // 0 to 100, where 100 is fully rested
  coins: number;
  experience: number;
  level: number;
  speechText: string | null;
  
  // Actions
  setActivePet: (pet: Pet | null) => void;
  setSavedPets: (pets: Pet[]) => void;
  feedPet: (amount: number) => void;
  playWithPet: (energyCost: number, experienceGain: number, coinGain: number) => void;
  sleepPet: (amount: number) => void;
  addCoins: (amount: number) => void;
  addExperience: (amount: number) => void;
  equipAccessory: (id: string) => void;
  unequipAccessory: (id: string) => void;
  speak: (text: string | null, durationMs?: number) => void;
  tickStats: () => void; // Called periodically to slowly decay hunger/energy
}

let speechTimeout: ReturnType<typeof setTimeout> | null = null;

export const usePetStore = create<PetStoreState>((set, get) => {
  // Load initial data from localStorage where appropriate
  const initialActive = (() => {
    try {
      const stored = localStorage.getItem("digital_pets_active");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const initialSaved = (() => {
    try {
      const stored = localStorage.getItem("digital_pets_list");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();

  const initialStats = (() => {
    try {
      const stored = localStorage.getItem("digital_pets_stats");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return {
      equippedAccessories: [],
      hunger: 85,
      energy: 90,
      coins: 30,
      experience: 10,
      level: 1,
    };
  })();

  // Helper to save stats
  const saveStats = (state: Partial<PetStoreState>) => {
    const current = {
      equippedAccessories: state.equippedAccessories ?? get().equippedAccessories,
      hunger: state.hunger ?? get().hunger,
      energy: state.energy ?? get().energy,
      coins: state.coins ?? get().coins,
      experience: state.experience ?? get().experience,
      level: state.level ?? get().level,
    };
    localStorage.setItem("digital_pets_stats", JSON.stringify(current));
  };

  return {
    activePet: initialActive,
    savedPets: initialSaved,
    equippedAccessories: initialStats.equippedAccessories,
    hunger: initialStats.hunger,
    energy: initialStats.energy,
    coins: initialStats.coins,
    experience: initialStats.experience,
    level: initialStats.level,
    speechText: null,

    setActivePet: (pet) => {
      set({ activePet: pet });
      if (pet) {
        localStorage.setItem("digital_pets_active", JSON.stringify(pet));
      } else {
        localStorage.removeItem("digital_pets_active");
      }
    },

    setSavedPets: (savedPets) => {
      set({ savedPets });
      localStorage.setItem("digital_pets_list", JSON.stringify(savedPets));
    },

    feedPet: (amount) => {
      set((state) => {
        const newHunger = Math.min(100, state.hunger + amount);
        const experienceGain = 5;
        const totalExp = state.experience + experienceGain;
        const newLevel = Math.floor(Math.sqrt(totalExp / 10)) + 1;
        const newState = {
          hunger: newHunger,
          experience: totalExp,
          level: newLevel > state.level ? newLevel : state.level,
        };
        saveStats(newState);
        return newState;
      });
      get().speak("Yum! That was delicious! 🍖", 3000);
    },

    playWithPet: (energyCost, experienceGain, coinGain) => {
      let playedSucceeded = false;
      set((state) => {
        if (state.energy < energyCost) {
          get().speak("I'm too tired to play right now... 😴", 3000);
          return {};
        }
        playedSucceeded = true;
        const newEnergy = Math.max(0, state.energy - energyCost);
        const totalExp = state.experience + experienceGain;
        const newLevel = Math.floor(Math.sqrt(totalExp / 10)) + 1;
        const newCoins = state.coins + coinGain;
        const newState = {
          energy: newEnergy,
          experience: totalExp,
          level: newLevel > state.level ? newLevel : state.level,
          coins: newCoins,
        };
        saveStats(newState);
        return newState;
      });
      if (playedSucceeded) {
        get().speak("Wheee! Playing is so fun! 🎉", 3000);
      }
    },

    sleepPet: (amount) => {
      set((state) => {
        const newEnergy = Math.min(100, state.energy + amount);
        const newState = { energy: newEnergy };
        saveStats(newState);
        return newState;
      });
      get().speak("Snore... recharging my batteries! 🔋", 4000);
    },

    addCoins: (amount) => {
      set((state) => {
        const newCoins = Math.max(0, state.coins + amount);
        const newState = { coins: newCoins };
        saveStats(newState);
        return newState;
      });
    },

    addExperience: (amount) => {
      set((state) => {
        const totalExp = state.experience + amount;
        const newLevel = Math.floor(Math.sqrt(totalExp / 10)) + 1;
        const newState = {
          experience: totalExp,
          level: newLevel > state.level ? newLevel : state.level,
        };
        saveStats(newState);
        return newState;
      });
    },

    equipAccessory: (id) => {
      set((state) => {
        if (state.equippedAccessories.includes(id)) return {};
        const updated = [...state.equippedAccessories, id];
        const newState = { equippedAccessories: updated };
        saveStats(newState);
        return newState;
      });
    },

    unequipAccessory: (id) => {
      set((state) => {
        const updated = state.equippedAccessories.filter((accId) => accId !== id);
        const newState = { equippedAccessories: updated };
        saveStats(newState);
        return newState;
      });
    },

    speak: (text, durationMs = 4000) => {
      if (speechTimeout) {
        clearTimeout(speechTimeout);
        speechTimeout = null;
      }
      set({ speechText: text });

      if (text && durationMs > 0) {
        speechTimeout = setTimeout(() => {
          set({ speechText: null });
        }, durationMs);
      }
    },

    tickStats: () => {
      set((state) => {
        // Slowly decay hunger and energy over time
        const newHunger = Math.max(0, state.hunger - 0.2);
        const newEnergy = Math.max(0, state.energy - 0.1);
        const newState = { hunger: newHunger, energy: newEnergy };
        saveStats(newState);
        return newState;
      });
    },
  };
});
