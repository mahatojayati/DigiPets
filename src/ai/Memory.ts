import { PetMemory } from "../types/ai";

export class Memory {
  private memoryData: PetMemory;
  private storageKey = "digital_pets_memory_data";

  constructor() {
    this.memoryData = this.loadMemory();
  }

  private loadMemory(): PetMemory {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load memory data:", e);
    }

    return {
      lastFed: new Date().toISOString(),
      lastPlayed: new Date().toISOString(),
      lastSleep: new Date().toISOString(),
      lastConversation: new Date().toISOString(),
      favoriteToy: "Squeaky Toy",
      timesDragged: 0,
      timesClicked: 0,
    };
  }

  public save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memoryData));
    } catch (e) {
      console.error("Failed to save memory data:", e);
    }
  }

  public getMemory(): PetMemory {
    return { ...this.memoryData };
  }

  public recordFeeding(): void {
    this.memoryData.lastFed = new Date().toISOString();
    this.save();
  }

  public recordPlay(): void {
    this.memoryData.lastPlayed = new Date().toISOString();
    this.save();
  }

  public recordSleep(): void {
    this.memoryData.lastSleep = new Date().toISOString();
    this.save();
  }

  public recordConversation(): void {
    this.memoryData.lastConversation = new Date().toISOString();
    this.save();
  }

  public setFavoriteToy(toy: string): void {
    this.memoryData.favoriteToy = toy;
    this.save();
  }

  public incrementDragged(): void {
    this.memoryData.timesDragged += 1;
    this.save();
  }

  public incrementClicked(): void {
    this.memoryData.timesClicked += 1;
    this.save();
  }
}
export default Memory;
