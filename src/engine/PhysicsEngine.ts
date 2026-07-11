import { PhysicsConfig, PhysicsState, Vector2D } from "../types/physics";
import { DEFAULT_PHYSICS_CONFIG } from "../constants/physics";
import { BoundarySystem } from "./BoundarySystem";
import { CollisionEngine } from "./CollisionEngine";
import { clamp } from "../utils/math";

export class PhysicsEngine {
  private config: PhysicsConfig;

  constructor(config: PhysicsConfig = DEFAULT_PHYSICS_CONFIG) {
    this.config = config;
  }

  update(
    state: PhysicsState,
    petWidth: number,
    petHeight: number,
    viewportWidth: number,
    viewportHeight: number
  ): PhysicsState {
    if (state.isDragging) {
      return state;
    }

    let { x, y, velocityX, velocityY, direction } = state;

    // 1. Apply gravity to vertical velocity
    velocityY += this.config.gravity;

    // 2. Clamp velocities to terminal velocity to prevent wild acceleration
    velocityY = clamp(velocityY, -this.config.terminalVelocity, this.config.terminalVelocity);
    velocityX = clamp(velocityX, -this.config.terminalVelocity, this.config.terminalVelocity);

    // 3. Update positions
    x += velocityX;
    y += velocityY;

    // 4. Boundary System clamping
    const bounds = BoundarySystem.getViewportBoundary(petWidth, petHeight, viewportWidth, viewportHeight);
    const collisionReport = BoundarySystem.clamp(x, y, bounds);

    x = collisionReport.x;
    y = collisionReport.y;

    // 5. Apply ground friction vs air resistance
    const isOnGround = collisionReport.hitBottom;
    if (isOnGround) {
      velocityX *= this.config.friction;
      // If horizontal movement is tiny, stop it completely
      if (Math.abs(velocityX) < 0.05) velocityX = 0;
    } else {
      velocityX *= this.config.airResistance;
    }

    // 6. Resolve boundary bounce collisions
    const bounceVelocities = CollisionEngine.resolveBoundaryCollision(
      { x: velocityX, y: velocityY },
      collisionReport,
      this.config
    );

    velocityX = bounceVelocities.x;
    velocityY = bounceVelocities.y;

    // 7. Update orientation direction based on speed
    if (Math.abs(velocityX) > 0.1) {
      direction = velocityX > 0 ? "right" : "left";
    }

    return {
      x,
      y,
      velocityX,
      velocityY,
      direction,
      isDragging: false,
    };
  }
}
