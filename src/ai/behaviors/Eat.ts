import { BehaviorNode, BehaviorStatus } from "../../types/ai";
import { ActionNode } from "../BehaviorTree";

export const EatBehavior: BehaviorNode = new ActionNode((brain, context) => {
  brain.playAnimation("eat");
  
  const eatQuotes = [
    "Omnomnom... yummy snack! 🍪",
    "Gotta refuel! Delicious! 🍖",
    "Munch munch munch... 🧁",
    "This digital food is 10/10!",
    "Ah, a delicious treat! 🍩"
  ];
  
  brain.say(eatQuotes[Math.floor(Math.random() * eatQuotes.length)]);
  
  // Directly restore some hunger
  brain.updateNeed("hunger", 25);
  
  return "success";
});
export default EatBehavior;
