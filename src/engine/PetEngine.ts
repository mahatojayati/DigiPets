import { PhysicsEngine } from "./PhysicsEngine";
import { AnimationController } from "./AnimationController";
import { PhysicsState, Vector2D } from "../types/physics";
import { PetState } from "../types/animation";
import { usePetStore } from "../store/petStore";
import { PET_SIZE } from "../constants/physics";

export class PetEngine {
  private physicsEngine: PhysicsEngine;
  private animationController: AnimationController;

  // Internal states
  private state: PhysicsState;
  private isVisible: boolean = true;
  private followCursorMode: boolean = false;
  private walkToTarget: Vector2D | null = null;
  private lastTime: number = 0;
  private cursorPosition: Vector2D = { x: 400, y: 400 };

  // Listeners
  private boundOnMouseMove: (e: MouseEvent) => void;

  constructor(
    initialX: number = 200,
    initialY: number = 400,
    physicsEngine: PhysicsEngine = new PhysicsEngine(),
    animationController: AnimationController = new AnimationController("idle")
  ) {
    this.physicsEngine = physicsEngine;
    this.animationController = animationController;

    this.state = {
      x: initialX,
      y: initialY,
      velocityX: 0,
      velocityY: 0,
      direction: "right",
      isDragging: false,
    };

    // Track cursor for followCursorMode
    this.boundOnMouseMove = (e: MouseEvent) => {
      this.cursorPosition = { x: e.clientX, y: e.clientY };
    };
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", this.boundOnMouseMove);
    }
  }

  destroy(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", this.boundOnMouseMove);
    }
  }

  // --- GETTERS ---
  getState(): PhysicsState {
    return this.state;
  }

  getAnimState(): PetState {
    return this.animationController.getCurrentState();
  }

  getIsVisible(): boolean {
    return this.isVisible;
  }

  getFollowCursorMode(): boolean {
    return this.followCursorMode;
  }

  getWalkToTarget(): Vector2D | null {
    return this.walkToTarget;
  }

  // --- SETTERS / OVERRIDES ---
  setPosition(x: number, y: number): void {
    this.state.x = x;
    this.state.y = y;
  }

  setDragging(isDragging: boolean): void {
    this.state.isDragging = isDragging;
    if (isDragging) {
      this.state.velocityX = 0;
      this.state.velocityY = 0;
      this.followCursorMode = false;
      this.walkToTarget = null;
      this.animationController.transitionTo("drag", true);
    } else {
      this.animationController.transitionTo("idle", true);
    }
  }

  // --- CORE CYCLE TICK ---
  tick(
    timestamp: number,
    viewportWidth: number,
    viewportHeight: number
  ): { state: PhysicsState; animState: PetState; isVisible: boolean } {
    if (!this.lastTime) this.lastTime = timestamp;
    const delta = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.animationController.update(delta);

    // Skip all motion if invisible
    if (!this.isVisible) {
      return { state: this.state, animState: this.getAnimState(), isVisible: this.isVisible };
    }

    // Skip physical motion calculations if being dragged (drag positioning handled by hook)
    if (this.state.isDragging) {
      return { state: this.state, animState: this.getAnimState(), isVisible: this.isVisible };
    }

    // AI/Auto-navigation behavior overrides
    if (this.followCursorMode) {
      // Offset target so pet centers beneath or next to cursor
      const targetX = this.cursorPosition.x - PET_SIZE.width / 2;
      const targetY = this.cursorPosition.y - PET_SIZE.height;

      const dx = targetX - this.state.x;
      const dy = targetY - this.state.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 20) {
        // Walk smoothly towards cursor
        this.state.velocityX = dx * 0.08;
        this.state.velocityY = dy * 0.08;
        this.animationController.transitionTo("walk");
      } else {
        // Close enough
        this.state.velocityX *= 0.5;
        this.state.velocityY *= 0.5;
        this.animationController.transitionTo("idle");
      }
    } else if (this.walkToTarget) {
      const dx = this.walkToTarget.x - this.state.x;
      const dy = this.walkToTarget.y - this.state.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) {
        // Move towards target
        this.state.velocityX = dx * 0.06;
        // Float or walk
        if (Math.abs(dy) > 10) {
          this.state.velocityY = dy * 0.06;
        }
        this.animationController.transitionTo("walk");
      } else {
        // Arrived!
        this.state.velocityX = 0;
        this.state.velocityY = 0;
        this.walkToTarget = null;
        this.animationController.transitionTo("idle");
      }
    }

    // Run physics updates
    this.state = this.physicsEngine.update(
      this.state,
      PET_SIZE.width,
      PET_SIZE.height,
      viewportWidth,
      viewportHeight
    );

    // If falling rapidly, transition to jump
    if (Math.abs(this.state.velocityY) > 2 && !this.followCursorMode && !this.walkToTarget) {
      this.animationController.transitionTo("jump");
    } else if (
      this.animationController.getCurrentState() === "jump" &&
      Math.abs(this.state.velocityY) < 0.1 &&
      Math.abs(this.state.velocityX) < 0.1
    ) {
      // Landed
      this.animationController.transitionTo("idle");
    }

    return {
      state: this.state,
      animState: this.getAnimState(),
      isVisible: this.isVisible,
    };
  }

  // --- PUBLIC API FOR AI & ACTIONS ---
  walkTo(x: number, y: number): void {
    this.followCursorMode = false;
    // Align destination to fit in pet container center
    this.walkToTarget = { x: x - PET_SIZE.width / 2, y: y - PET_SIZE.height / 2 };
    this.animationController.transitionTo("walk", true);
  }

  jump(): void {
    // Jump with upward force
    this.state.velocityY = -12;
    this.animationController.transitionTo("jump", true);
  }

  sleep(): void {
    this.followCursorMode = false;
    this.walkToTarget = null;
    this.state.velocityX = 0;
    this.animationController.transitionTo("sleep", true);
  }

  wake(): void {
    if (this.getAnimState() === "sleep") {
      this.animationController.transitionTo("idle", true);
    }
  }

  speak(text: string): void {
    usePetStore.getState().speak(text, 5000);
  }

  followCursor(): void {
    this.walkToTarget = null;
    this.followCursorMode = true;
    this.animationController.transitionTo("walk", true);
  }

  stop(): void {
    this.followCursorMode = false;
    this.walkToTarget = null;
    this.state.velocityX = 0;
    this.state.velocityY = 0;
    this.animationController.transitionTo("idle", true);
  }

  hide(): void {
    this.isVisible = false;
  }

  show(): void {
    this.isVisible = true;
  }

  play(state: PetState): void {
    this.followCursorMode = false;
    this.walkToTarget = null;
    this.animationController.transitionTo(state, true);
  }
}
