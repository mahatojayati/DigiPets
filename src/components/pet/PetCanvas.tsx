import React, { useRef } from "react";
import { usePetStore } from "../../store/petStore";
import { usePetEngine } from "../../hooks/usePetEngine";
import { Pet } from "./Pet";

export const PetCanvas: React.FC = () => {
  const activePet = usePetStore((state) => state.activePet);
  const containerRef = useRef<HTMLDivElement>(null);

  // Run physics and animation loops on the floating container ref
  const { petEngine, animState, direction, isVisible } = usePetEngine(containerRef);

  // If there's no active summoned pet, don't overlay anything
  if (!activePet) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99999] select-none overflow-hidden"
      id="floating-companion-canvas"
    >
      {/* High-performance floating pet container */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 pointer-events-auto select-none"
        style={{
          width: "120px",
          height: "120px",
          willChange: "transform",
        }}
      >
        <Pet
          petEngine={petEngine}
          animState={animState}
          direction={direction}
          imageUrl={activePet.imageUrl}
        />
      </div>
    </div>
  );
};
