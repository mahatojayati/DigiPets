import { Vector2D } from "../types/physics";

export const addVectors = (v1: Vector2D, v2: Vector2D): Vector2D => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

export const subtractVectors = (v1: Vector2D, v2: Vector2D): Vector2D => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});

export const scaleVector = (v: Vector2D, scalar: number): Vector2D => ({
  x: v.x * scalar,
  y: v.y * scalar,
});

export const getMagnitude = (v: Vector2D): number =>
  Math.sqrt(v.x * v.x + v.y * v.y);

export const normalizeVector = (v: Vector2D): Vector2D => {
  const mag = getMagnitude(v);
  return mag === 0 ? { x: 0, y: 0 } : { x: v.x / mag, y: v.y / mag };
};

export const getDistance = (v1: Vector2D, v2: Vector2D): number =>
  getMagnitude(subtractVectors(v1, v2));
