import { Goal } from "./Goal";
import { BehaviorNode, PetNeeds, BrowserContext } from "../../types/ai";
import { SleepBehavior } from "../behaviors/Sleep";

export class EnergyGoal implements Goal {
  public name = "Conserve Energy";

  public getPriority(needs: PetNeeds, context: BrowserContext): number {
    // If browser tab is hidden, companion should go to sleep immediately (max priority)
    if (context.tabVisibility === "hidden") {
      return 100;
    }

    // needs.energy goes from 0 (exhausted) to 100 (fully charged)
    const basePriority = 100 - needs.energy;

    // Critical boost if exhausted
    if (needs.energy < 30) {
      return basePriority * 1.5;
    }
    return basePriority;
  }

  public getBehavior(): BehaviorNode {
    return SleepBehavior;
  }
}
export default EnergyGoal;
