import { BehaviorNode, BehaviorStatus } from "../../types/ai";
import { ActionNode } from "../BehaviorTree";

export const ObserveBehavior: BehaviorNode = new ActionNode((brain, context) => {
  if (!context.isMouseNearby) {
    return "failure";
  }

  // Turn to face the cursor direction
  brain.lookAt(context.mousePosition);

  // Play a look or curious/blink animation
  if (brain.currentAction !== "observing") {
    brain.playAnimation("blink");
    brain.setAction("observing");
    
    if (Math.random() < 0.2) {
      brain.say("I see you! 👀");
    }
  }

  return "success";
});
export default ObserveBehavior;
