import { useState, useEffect } from "react";
import { PetEngine } from "../engine/PetEngine";

export function usePhysics(petEngine: PetEngine | null) {
  const [position, setPosition] = useState({ x: 200, y: 400 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!petEngine) return;

    const interval = setInterval(() => {
      const state = petEngine.getState();
      setPosition({ x: state.x, y: state.y });
      setVelocity({ x: state.velocityX, y: state.velocityY });
    }, 50); // Polling for optional UI debugging indicators

    return () => clearInterval(interval);
  }, [petEngine]);

  return { position, velocity };
}
