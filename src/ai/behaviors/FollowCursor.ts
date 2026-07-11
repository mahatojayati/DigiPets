import { BehaviorNode, BehaviorStatus } from "../../types/ai";
import { ActionNode } from "../BehaviorTree";

export const FollowCursorBehavior: BehaviorNode = new ActionNode((brain, context) => {
  // Only follow if mouse is active and on-screen
  if (!context.browserFocus || !context.isMouseNearby) {
    return "failure";
  }

  // To prevent the companion from covering the user's cursor directly (which blocks work),
  // offset the destination slightly downwards and to the side.
  const targetX = context.mousePosition.x - 30;
  const targetY = context.mousePosition.y + 40;

  brain.walkTo(targetX, targetY);

  if (Math.random() * 100 < 10) {
    const followQuotes = [
      "Whatcha doing? Let me see! 🧐",
      "I'm following you! 🐾",
      "On my way! 🏃‍♂️",
      "Keeping close! ❤️",
      "Let's write some lines together!"
    ];
    brain.say(followQuotes[Math.floor(Math.random() * followQuotes.length)]);
  }

  return "success";
});
export default FollowCursorBehavior;
