import { BehaviorNode, BehaviorStatus, BrowserContext } from "../../types/ai";
import { ActionNode } from "../BehaviorTree";

const IDLE_ANIMATIONS = ["idle", "sit", "stretch", "blink", "think", "wave", "yawn"];

export const IdleBehavior: BehaviorNode = new ActionNode((brain, context) => {
  if (brain.currentAction !== "idle") {
    // Select an idle animation randomly
    const index = Math.floor(Math.random() * IDLE_ANIMATIONS.length);
    const anim = IDLE_ANIMATIONS[index];
    
    brain.playAnimation(anim);
    
    // Low chance to say something while idle
    if (Math.random() < brain.personality.speechFrequency) {
      const messages = [
        "Just hanging out here! ✨",
        "Doing some deep thinking...",
        "Hope your code is compiling! 💻",
        "A quick stretch is always good!",
        "La-di-da-di-da... 🎵",
        "Watching the pixels drift by.",
        "You're doing great!"
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      brain.say(msg);
    }
  }
  
  return "success";
});
export default IdleBehavior;
