import React from "react";
import { PetState } from "../../types/animation";

interface PetSpriteProps {
  imageUrl: string;
  animation: PetState;
  direction: "left" | "right";
  equippedAccessories?: string[];
}

export const PetSprite: React.FC<PetSpriteProps> = React.memo(
  ({ imageUrl, animation, direction, equippedAccessories = [] }) => {
    // Basic scale/direction flip
    const flipClass = direction === "left" ? "scale-x-[-1]" : "scale-x-100";

    // Select styling and animation keyframes based on state
    let animClass = "";
    let rotationClass = "";

    switch (animation) {
      case "walk":
        // Sideways bobbing / waddle waddle
        animClass = "animate-pulse origin-bottom";
        rotationClass = "hover:rotate-6 transition-transform duration-300";
        break;
      case "jump":
        // Squeeze stretch vertical bounce
        animClass = "animate-bounce origin-bottom";
        break;
      case "drag":
        // dangling hover rotation
        animClass = "animate-bounce duration-500 origin-center";
        rotationClass = "rotate-12";
        break;
      case "sleep":
        // Sleepy slow horizontal breath and rotation
        animClass = "animate-pulse duration-1000 origin-bottom";
        rotationClass = "rotate-12 translate-y-3 opacity-80";
        break;
      case "happy":
        // Fast excited bounce
        animClass = "animate-bounce duration-300";
        rotationClass = "rotate-6";
        break;
      case "think":
        // Slightly tilted static thinking look
        animClass = "animate-pulse duration-700";
        rotationClass = "-rotate-12";
        break;
      case "talk":
        // Tiny talking chatter wiggle
        animClass = "animate-pulse duration-150 origin-bottom";
        rotationClass = "rotate-3";
        break;
      case "idle":
      default:
        // Slow idle breath
        animClass = "animate-pulse duration-1000";
        rotationClass = "rotate-0";
        break;
    }

    // Inline custom keyframe styles if we want extra buttery waddles
    const waddleStyle: React.CSSProperties = {};
    if (animation === "walk") {
      waddleStyle.animation = "waddle 0.6s infinite alternate ease-in-out";
    } else if (animation === "sleep") {
      waddleStyle.animation = "sleepBreathing 2.5s infinite ease-in-out";
    } else if (animation === "idle") {
      waddleStyle.animation = "idleBreath 3s infinite ease-in-out";
    } else if (animation === "drag") {
      waddleStyle.animation = "dangle 0.5s infinite alternate ease-in-out";
    }

    return (
      <div
        className={`relative w-24 h-24 select-none flex items-center justify-center transition-all duration-300 ${flipClass}`}
        style={waddleStyle}
      >
        {/* Style tag containing custom keyframes so they always work without modifying tailwind.config */}
        <style>{`
          @keyframes waddle {
            0% { transform: rotate(-5deg) translateY(0px); }
            100% { transform: rotate(5deg) translateY(-4px); }
          }
          @keyframes sleepBreathing {
            0% { transform: scale(0.95, 0.95) rotate(12deg) translateY(12px); opacity: 0.75; }
            50% { transform: scale(1.02, 0.9) rotate(10deg) translateY(12px); opacity: 0.9; }
            100% { transform: scale(0.95, 0.95) rotate(12deg) translateY(12px); opacity: 0.75; }
          }
          @keyframes idleBreath {
            0% { transform: scale(1, 1) translateY(0px); }
            50% { transform: scale(1.03, 0.97) translateY(-2px); }
            100% { transform: scale(1, 1) translateY(0px); }
          }
          @keyframes dangle {
            0% { transform: rotate(-8deg) scale(0.95, 1.05); }
            100% { transform: rotate(8deg) scale(1.05, 0.95); }
          }
        `}</style>

        {/* Zzz particle overlays for sleep state */}
        {animation === "sleep" && (
          <div className="absolute -top-4 -right-1 flex flex-col items-center pointer-events-none select-none text-[#8338EC] font-bold text-xs animate-pulse">
            <span className="animate-bounce delay-100">z</span>
            <span className="animate-bounce delay-300 text-sm">Z</span>
            <span className="animate-bounce delay-500 text-lg">Z</span>
          </div>
        )}

        {/* The Actual Pet Image */}
        <img
          src={imageUrl}
          alt="Virtual Pet Sprite"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-contain pointer-events-none ${animClass} ${rotationClass}`}
        />

        {/* Accessory Overlays */}
        {equippedAccessories.map((accId) => {
          if (accId === "sunglasses") {
            return (
              <div
                key={accId}
                className="absolute top-[28%] left-[20%] w-[60%] h-[15%] pointer-events-none z-10 animate-pulse duration-1000"
              >
                {/* Pixel Shades SVG */}
                <svg viewBox="0 0 100 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M5 5h15v5H5V5zm15 5h10v5H20v-5zm10-5h10v5H30V5zm10 5h10v5h-10v-5zm10-5h10v5H50V5zm10 5h10v5H60v-5zm10-5h15v5H70V5z" fill="#000" />
                  <path d="M10 10h10v5H10v-5zm50 0h10v5H60v-5z" fill="#fff" opacity="0.6" />
                </svg>
              </div>
            );
          }
          if (accId === "crown") {
            return (
              <div
                key={accId}
                className="absolute -top-[15%] left-[25%] w-[50%] h-[30%] pointer-events-none z-10 origin-bottom animate-bounce"
                style={{ animationDuration: "1.5s" }}
              >
                {/* Golden Crown SVG */}
                <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                  <path d="M5 35 L5 15 L15 25 L30 10 L45 25 L55 15 L55 35 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
                  <circle cx="5" cy="13" r="3" fill="#FF4500" />
                  <circle cx="30" cy="8" r="4" fill="#1E90FF" />
                  <circle cx="55" cy="13" r="3" fill="#FF4500" />
                  <rect x="15" y="30" width="30" height="5" fill="#FF4500" rx="1" />
                </svg>
              </div>
            );
          }
          if (accId === "party-hat") {
            return (
              <div
                key={accId}
                className="absolute -top-[25%] left-[30%] w-[40%] h-[40%] pointer-events-none z-10 origin-bottom"
              >
                {/* Party Hat SVG */}
                <svg viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M20 5 L5 45 L35 45 Z" fill="#FF007F" />
                  <path d="M10 45 L20 5 L25 45 Z" fill="#8338EC" opacity="0.7" />
                  {/* Pom pom */}
                  <circle cx="20" cy="5" r="4" fill="#FFD700" className="animate-pulse" />
                  {/* Base stripe */}
                  <path d="M5 45 Q20 42 35 45" stroke="#FFD700" strokeWidth="3" />
                </svg>
              </div>
            );
          }
          if (accId === "bow-tie") {
            return (
              <div
                key={accId}
                className="absolute bottom-[10%] left-[35%] w-[30%] h-[15%] pointer-events-none z-10"
              >
                {/* Red Bow Tie SVG */}
                <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
                  <path d="M2 2 L16 10 L2 18 Z" fill="#FF4F4F" stroke="#990000" strokeWidth="1" />
                  <path d="M38 2 L24 10 L38 18 Z" fill="#FF4F4F" stroke="#990000" strokeWidth="1" />
                  <circle cx="20" cy="10" r="4" fill="#990000" />
                </svg>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }
);

PetSprite.displayName = "PetSprite";
