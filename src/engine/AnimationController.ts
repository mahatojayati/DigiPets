import { PetState } from "../types/animation";
import { ANIMATION_TRANSITIONS } from "../constants/animation";

export class AnimationController {
  private currentState: PetState = "idle";
  private previousState: PetState = "idle";
  private timeInState: number = 0;

  constructor(initialState: PetState = "idle") {
    this.currentState = initialState;
    this.previousState = initialState;
  }

  getCurrentState(): PetState {
    return this.currentState;
  }

  getPreviousState(): PetState {
    return this.previousState;
  }

  getTimeInState(): number {
    return this.timeInState;
  }

  update(deltaTime: number): void {
    this.timeInState += deltaTime;
  }

  transitionTo(newState: PetState, force: boolean = false): boolean {
    if (this.currentState === newState) {
      return true;
    }

    // Dragging is an immediate high-priority override, always allowed
    if (newState === "drag" || force) {
      this.previousState = this.currentState;
      this.currentState = newState;
      this.timeInState = 0;
      return true;
    }

    // Check if the transition is valid according to our schema
    const allowedTransitions = ANIMATION_TRANSITIONS[this.currentState] || [];
    if (allowedTransitions.includes(newState)) {
      this.previousState = this.currentState;
      this.currentState = newState;
      this.timeInState = 0;
      return true;
    }

    // Return false if transition was rejected
    return false;
  }
}
