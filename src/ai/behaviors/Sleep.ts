import { BehaviorNode, BehaviorStatus } from "../../types/ai";
import { ActionNode } from "../BehaviorTree";

export const SleepBehavior: BehaviorNode = new ActionNode((brain, context) => {
  if (brain.currentAction !== "sleeping") {
    brain.sleep();
    
    const sleepQuotes = [
      "Zzz... so cozy... 🛌",
      "Power-nap mode activated! 🔋",
      "Dreaming of clean code... 💤",
      "Going offline for a bit... yawn...",
      "Time to rest my digital paws."
    ];
    brain.say(sleepQuotes[Math.floor(Math.random() * sleepQuotes.length)]);
  }
  return "success";
});
export default SleepBehavior;
