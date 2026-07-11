import { Goal } from "./Goal";
import { BehaviorNode, PetNeeds, BrowserContext } from "../../types/ai";
import { EatBehavior } from "../behaviors/Eat";

export class HungerGoal implements Goal {
  public name = "Satisfy Hunger";

  public getPriority(needs: PetNeeds, context: BrowserContext): number {
    // needs.hunger goes from 0 (starving) to 100 (stuffed)
    const basePriority = 100 - needs.hunger;

    // Critical boost if starving
    if (needs.hunger < 40) {
      return basePriority * 1.5;
    }
    return basePriority;
  }

  public getBehavior(): BehaviorNode {
    return EatBehavior;
  }
}
export default HungerGoal;
