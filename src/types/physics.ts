export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsConfig {
  gravity: number;
  friction: number;
  bounce: number;
  terminalVelocity: number;
  airResistance: number;
}

export interface Boundary {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface PhysicsState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  direction: "left" | "right";
  isDragging: boolean;
}
