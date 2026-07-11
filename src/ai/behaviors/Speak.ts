import { BehaviorNode, BehaviorStatus } from "../../types/ai";
import { ActionNode } from "../BehaviorTree";

export const SpeakBehavior: BehaviorNode = new ActionNode((brain, context) => {
  const genericGreetings = [
    "You're doing an amazing job! 🌟",
    "Remember to stay hydrated! 💧",
    "Coding is like a superpower. Let's build! 🚀",
    "Need a quick micro-break? Stretch up! 🧘",
    "Did you commit your changes yet? 😉",
    "Let's make some pixel magic happen!",
    "I'm so glad to hang out with you."
  ];

  const speech = genericGreetings[Math.floor(Math.random() * genericGreetings.length)];
  brain.say(speech);
  
  return "success";
});
export default SpeakBehavior;
