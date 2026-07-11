import { Boundary } from "../types/physics";

export class BoundarySystem {
  static getViewportBoundary(
    petWidth: number,
    petHeight: number,
    viewportWidth: number,
    viewportHeight: number
  ): Boundary {
    return {
      left: 0,
      right: Math.max(0, viewportWidth - petWidth),
      top: 0,
      bottom: Math.max(0, viewportHeight - petHeight),
    };
  }

  static clamp(
    x: number,
    y: number,
    bounds: Boundary
  ): { x: number; y: number; hitLeft: boolean; hitRight: boolean; hitTop: boolean; hitBottom: boolean } {
    let hitLeft = false;
    let hitRight = false;
    let hitTop = false;
    let hitBottom = false;

    let clampedX = x;
    let clampedY = y;

    if (x <= bounds.left) {
      clampedX = bounds.left;
      hitLeft = true;
    } else if (x >= bounds.right) {
      clampedX = bounds.right;
      hitRight = true;
    }

    if (y <= bounds.top) {
      clampedY = bounds.top;
      hitTop = true;
    } else if (y >= bounds.bottom) {
      clampedY = bounds.bottom;
      hitBottom = true;
    }

    return {
      x: clampedX,
      y: clampedY,
      hitLeft,
      hitRight,
      hitTop,
      hitBottom,
    };
  }
}
