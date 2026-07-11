import { BehaviorNode, PetNeeds, BrowserContext } from "../../types/ai";

export interface Goal {
  name: string;
  getPriority(needs: PetNeeds, context: BrowserContext): number;
  getBehavior(): BehaviorNode;
}
export default Goal;
