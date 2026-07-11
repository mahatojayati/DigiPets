import React, { useEffect, useRef, useState } from "react";
import { PetEngine } from "../engine/PetEngine";
import { PetState } from "../types/animation";
import { usePetStore } from "../store/petStore";
import { Brain } from "../ai/Brain";

export function usePetEngine(containerRef: React.RefObject<HTMLDivElement | null>) {
  const petEngineRef = useRef<PetEngine | null>(null);
  const [animState, setAnimState] = useState<PetState>("idle");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isVisible, setIsVisible] = useState(true);

  // Lazy-instantiate PetEngine on the client
  if (!petEngineRef.current && typeof window !== "undefined") {
    const initX = Math.max(50, window.innerWidth - 200);
    const initY = Math.max(50, window.innerHeight - 200);
    petEngineRef.current = new PetEngine(initX, initY);
  }

  const petEngine = petEngineRef.current;

  // Register the active PetEngine instance with the AI Brain
  useEffect(() => {
    if (!petEngine) return;
    const brain = Brain.getInstance();
    brain.registerPetEngine(petEngine);
    return () => {
      brain.unregisterPetEngine();
    };
  }, [petEngine]);

  useEffect(() => {
    if (!petEngine) return;

    let animationFrameId: number;

    const loop = (timestamp: number) => {
      // 1. Tick the engine (Drag -> Physics -> Collision -> Animation)
      const { state, animState: currentAnim, isVisible: visible } = petEngine.tick(
        timestamp,
        window.innerWidth,
        window.innerHeight
      );

      // 2. High-performance GPU-accelerated rendering directly to CSS styles (bypassing React re-renders)
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
        containerRef.current.style.display = visible ? "block" : "none";
      }

      // 3. Selectively update React state for UI triggers (like speech bubble or sprite assets)
      setAnimState(currentAnim);
      setDirection(state.direction);
      setIsVisible(visible);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [petEngine, containerRef]);

  // Handle periodic stats tick decay
  useEffect(() => {
    const tickInterval = setInterval(() => {
      usePetStore.getState().tickStats();
    }, 12000); // Tick and decay every 12 seconds

    return () => {
      clearInterval(tickInterval);
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (petEngineRef.current) {
        petEngineRef.current.destroy();
      }
    };
  }, []);

  return {
    petEngine,
    animState,
    direction,
    isVisible,
  };
}
