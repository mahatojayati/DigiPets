import { BehaviorNode, BehaviorStatus, BrowserContext } from "../../types/ai";
import { ActionNode } from "../BehaviorTree";

export const WanderBehavior: BehaviorNode = new ActionNode((brain, context) => {
  // If we are already walking, let the walking action proceed
  if (brain.currentAction === "walking") {
    return "running";
  }

  // Pick a random target coordinate safely within the current viewport bounds
  const padding = 100;
  const maxWidth = Math.max(300, context.windowSize.width - padding);
  const maxHeight = Math.max(300, context.windowSize.height - padding);

  const targetX = padding + Math.random() * (maxWidth - padding);
  const targetY = padding + Math.random() * (maxHeight - padding);

  // Instruct PetEngine to travel to this location
  brain.walkTo(targetX, targetY);

  if (Math.random() < 0.25) {
    const wanderQuotes = [
      "Let's explore over here! 🗺️",
      "Going on an adventure...",
      "Walking keeps my digital gears oiled!",
      "I wonder what's on this side of the screen? 🔍",
      "Cruising around! 🚀"
    ];
    brain.say(wanderQuotes[Math.floor(Math.random() * wanderQuotes.length)]);
  }

  return "success";
});
export default WanderBehavior;
