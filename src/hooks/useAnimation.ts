import { useState, useEffect } from "react";
import { PetEngine } from "../engine/PetEngine";
import { PetState } from "../types/animation";

export function useAnimation(petEngine: PetEngine | null) {
  const [animState, setAnimState] = useState<PetState>("idle");
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    if (!petEngine) return;

    // We can poll or query the current animation state from the loop.
    // To make it reactive, we can run a sync check in a small interval or coordinate with the main engine tick.
    const interval = setInterval(() => {
      const current = petEngine.getAnimState();
      const dir = petEngine.getState().direction;
      setAnimState(current);
      setDirection(dir);
    }, 100);

    return () => clearInterval(interval);
  }, [petEngine]);

  return { animState, direction };
}
