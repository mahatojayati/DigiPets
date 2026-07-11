import { PetState, PetMood } from "./animation";
import { Vector2D } from "./physics";

export interface PetNeeds {
  hunger: number;      // 0 to 100 (100 = starving, 0 = full, or vice versa; we will use 0 = starving, 100 = full)
  energy: number;      // 0 to 100
  happiness: number;   // 0 to 100
  curiosity: number;   // 0 to 100
  boredom: number;     // 0 to 100
  affection: number;   // 0 to 100
}

export type EmotionType =
  | "happy"
  | "sad"
  | "excited"
  | "curious"
  | "sleepy"
  | "angry"
  | "lonely"
  | "confused";

export interface PetMemory {
  lastFed: string;
  lastPlayed: string;
  lastSleep: string;
  lastConversation: string;
  favoriteToy: string;
  timesDragged: number;
  timesClicked: number;
}

export interface Personality {
  name: string;
  movementSpeedMultiplier: number;
  speechFrequency: number;       // 0 to 1 (probability of speaking during idle check)
  idleChance: number;            // 0 to 1
  moodChangeRate: number;        // Multiplier for need decay/growth
  curiosity: number;             // 0 to 1
  baseMood: EmotionType;
}

export interface BrowserContext {
  currentTime: string;
  browserFocus: boolean;
  tabVisibility: "visible" | "hidden";
  mousePosition: Vector2D;
  isMouseNearby: boolean;
  isMouseMovingRapidly: boolean;
  scrollPosition: number;
  windowSize: { width: number; height: number };
}

export type BehaviorStatus = "success" | "failure" | "running";

export interface BehaviorNode {
  tick(brain: any, context: BrowserContext): BehaviorStatus;
}
