import { Vector2D, PhysicsConfig } from "../types/physics";

export class CollisionEngine {
  static resolveBoundaryCollision(
    velocity: Vector2D,
    collisions: { hitLeft: boolean; hitRight: boolean; hitTop: boolean; hitBottom: boolean },
    config: PhysicsConfig
  ): Vector2D {
    let vx = velocity.x;
    let vy = velocity.y;

    // Apply bounce elasticity on collision with wall
    if (collisions.hitLeft || collisions.hitRight) {
      // Invert horizontal velocity and apply elasticity absorption
      vx = vx * config.bounce;
      // Filter out tiny jittery bounces
      if (Math.abs(vx) < 0.1) vx = 0;
    }

    if (collisions.hitTop || collisions.hitBottom) {
      // Invert vertical velocity and apply elasticity absorption
      vy = vy * config.bounce;
      // Filter out tiny jittery bounces
      if (Math.abs(vy) < 0.1) vy = 0;
    }

    return { x: vx, y: vy };
  }
}
