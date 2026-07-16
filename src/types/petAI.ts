import { EmotionType } from "./ai";

export interface Personality {
  curiosity: number;   // 0 to 100
  energy: number;      // 0 to 100
  kindness: number;    // 0 to 100
  laziness: number;    // 0 to 100
  playfulness: number; // 0 to 100
  confidence: number;  // 0 to 100
}

export type MemoryType = "feed" | "play" | "chat" | "ignored" | "browser_event" | "scroll" | "tab_hide" | "typing";

export interface PetMemoryEvent {
  id: string;
  type: MemoryType;
  time: string; // ISO string
  duration?: number; // in seconds
  message?: string;
  data?: any;
}

export interface EmotionState {
  happiness: number;  // 0 to 100
  excited: number;    // 0 to 100
  hungry: number;     // 0 to 100 (where 0 is full and 100 is starving)
  sleepy: number;     // 0 to 100
  lonely: number;     // 0 to 100
  currentMood: EmotionType;
}

export type RelationshipLevel = "Stranger" | "Friend" | "Best Friend" | "Soul Companion";

export interface RelationshipState {
  level: RelationshipLevel;
  xp: number; // Friendship XP
  nextLevelXp: number;
  totalInteractions: number;
  unlockedAccessories: string[];
  unlockedExpressions: string[];
}

export interface PetAIState {
  personality: Personality;
  emotions: EmotionState;
  memories: PetMemoryEvent[];
  relationship: RelationshipState;
  lastActiveTime: string;
  currentAction: string;
}
