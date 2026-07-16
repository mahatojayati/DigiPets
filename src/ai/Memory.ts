import { PetMemory } from "../types/ai";
import { PetMemoryEvent, MemoryType } from "../types/petAI";

export class Memory {
  private memoryData: PetMemory;
  private events: PetMemoryEvent[] = [];
  private storageKey = "digital_pets_memory_data";
  private eventsStorageKey = "digital_pets_memory_events";

  constructor() {
    this.memoryData = this.loadMemory();
    this.events = this.loadEvents();
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

  private loadEvents(): PetMemoryEvent[] {
    try {
      const saved = localStorage.getItem(this.eventsStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  public save(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.memoryData));
    } catch (e) {
      console.error("Failed to save memory data:", e);
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem(this.eventsStorageKey, JSON.stringify(this.events));
    } catch (e) {
      console.error("Failed to save memory events:", e);
    }
  }

  public getMemory(): PetMemory {
    return { ...this.memoryData };
  }

  public getEvents(): PetMemoryEvent[] {
    return [...this.events];
  }

  public addEvent(type: MemoryType, message?: string, duration?: number, data?: any): void {
    const newEvent: PetMemoryEvent = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      time: new Date().toISOString(),
      message,
      duration,
      data
    };
    this.events.unshift(newEvent);
    if (this.events.length > 25) {
      this.events.pop(); // Keep rolling last 25 interactions
    }
    this.saveEvents();
  }

  public recordFeeding(): void {
    this.memoryData.lastFed = new Date().toISOString();
    this.addEvent("feed", "User fed me some tasty snacks!");
    this.save();
  }

  public recordPlay(): void {
    this.memoryData.lastPlayed = new Date().toISOString();
    this.addEvent("play", "User played with me! Super fun!");
    this.save();
  }

  public recordSleep(): void {
    this.memoryData.lastSleep = new Date().toISOString();
    this.addEvent("ignored", "Taking a deep slumber...", undefined, { action: "sleep" });
    this.save();
  }

  public recordConversation(msg?: string): void {
    this.memoryData.lastConversation = new Date().toISOString();
    this.addEvent("chat", msg || "We talked about life!");
    this.save();
  }

  public setFavoriteToy(toy: string): void {
    this.memoryData.favoriteToy = toy;
    this.save();
  }

  public incrementDragged(): void {
    this.memoryData.timesDragged += 1;
    this.addEvent("browser_event", "User dragged me around the screen!", undefined, { event: "drag" });
    this.save();
  }

  public incrementClicked(): void {
    this.memoryData.timesClicked += 1;
    this.addEvent("browser_event", "User clicked on me!", undefined, { event: "click" });
    this.save();
  }
}
export default Memory;
