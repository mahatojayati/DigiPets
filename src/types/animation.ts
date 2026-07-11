export type PetState =
  | "idle"
  | "walk"
  | "jump"
  | "drag"
  | "sleep"
  | "happy"
  | "think"
  | "talk";

export type PetMood = "happy" | "calm" | "sleepy" | "excited" | "thoughtful";

export interface AnimationState {
  current: PetState;
  previous: PetState;
  elapsedTime: number;
}
