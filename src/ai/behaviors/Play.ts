import { BehaviorNode, BehaviorStatus } from "../../types/ai";
import { ActionNode } from "../BehaviorTree";

export const PlayBehavior: BehaviorNode = new ActionNode((brain, context) => {
  // Let the pet do an excited dance or celebrate
  const playAnims = ["dance", "celebrate", "jump"];
  const anim = playAnims[Math.floor(Math.random() * playAnims.length)];
  
  brain.playAnimation(anim);
  
  const playQuotes = [
    "Woohoo! Let's party! 🎉",
    "Check out my awesome moves! 💃",
    "Wheee! Jumping with joy! 🚀",
    "Who needs toys when you've got rhythm? 🎵",
    "This is so much fun!"
  ];
  
  brain.say(playQuotes[Math.floor(Math.random() * playQuotes.length)]);
  brain.updateNeed("boredom", -25);
  brain.updateNeed("happiness", 15);
  
  return "success";
});
export default PlayBehavior;
