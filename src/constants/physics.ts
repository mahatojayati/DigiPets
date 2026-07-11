import { PhysicsConfig } from "../types/physics";

export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: 0.5,           // Acceleration downwards
  friction: 0.98,         // Horizontal drag on the ground
  bounce: -0.3,          // Bounce velocity absorption (-0.25 to -0.35 is perfect)
  terminalVelocity: 15,   // Maximum fall speed
  airResistance: 0.99,    // Drag while airborne
};

export const PET_SIZE = {
  width: 120,
  height: 120,
};
