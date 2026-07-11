import React from "react";
import { PetState } from "../../types/animation";

interface PetShadowProps {
  animState: PetState;
}

export const PetShadow: React.FC<PetShadowProps> = React.memo(({ animState }) => {
  // Determine shadow scale and opacity based on pet state (jump/drag raises the pet)
  let scaleX = "scale-x-100";
  let opacity = "opacity-40";
  let blur = "blur-[4px]";

  switch (animState) {
    case "drag":
      scaleX = "scale-x-40";
      opacity = "opacity-15";
      blur = "blur-[6px]";
      break;
    case "jump":
      scaleX = "scale-x-60";
      opacity = "opacity-25";
      blur = "blur-[5px]";
      break;
    case "sleep":
      scaleX = "scale-x-110";
      opacity = "opacity-50";
      blur = "blur-[3px]";
      break;
    case "happy":
    case "walk":
      scaleX = "scale-x-95";
      opacity = "opacity-45";
      break;
    default:
      scaleX = "scale-x-100";
      opacity = "opacity-40";
      break;
  }

  return (
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[70px] h-[8px] flex items-center justify-center pointer-events-none z-0">
      <div
        className={`w-full h-full bg-black/80 rounded-full transition-all duration-300 ease-out origin-center ${scaleX} ${opacity} ${blur}`}
      />
    </div>
  );
});

PetShadow.displayName = "PetShadow";
