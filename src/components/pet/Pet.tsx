import React, { useRef } from "react";
import { PetEngine } from "../../engine/PetEngine";
import { PetState } from "../../types/animation";
import { useDrag } from "../../hooks/useDrag";
import { usePetStore } from "../../store/petStore";
import { PetSprite } from "./PetSprite";
import { PetShadow } from "./PetShadow";
import { SpeechBubble } from "./SpeechBubble";

interface PetProps {
  petEngine: PetEngine | null;
  animState: PetState;
  direction: "left" | "right";
  imageUrl: string;
}

export const Pet: React.FC<PetProps> = React.memo(
  ({ petEngine, animState, direction, imageUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isDragging, handleMouseDown } = useDrag(petEngine);
    const { equippedAccessories, speechText, playWithPet } = usePetStore();

    // Trigger an excited jump and give experience on double click
    const handleDoubleClick = () => {
      if (!petEngine) return;
      petEngine.jump();
      playWithPet(10, 15, 5); // Consumes 10 energy, awards 15 exp, earns 5 coins
    };

    return (
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        className={`relative w-[120px] h-[120px] flex flex-col items-center justify-center select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        id="interactive-pet-container"
      >
        {/* Floating Speech Bubble */}
        <SpeechBubble text={speechText} />

        {/* Pet Animated Sprite */}
        <PetSprite
          imageUrl={imageUrl}
          animation={animState}
          direction={direction}
          equippedAccessories={equippedAccessories}
        />

        {/* Ground Projection Shadow */}
        <PetShadow animState={animState} />
      </div>
    );
  }
);

Pet.displayName = "Pet";
