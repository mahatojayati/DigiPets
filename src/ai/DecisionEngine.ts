import { Goal } from "./goals/Goal";
import { HungerGoal } from "./goals/HungerGoal";
import { EnergyGoal } from "./goals/EnergyGoal";
import { SocialGoal } from "./goals/SocialGoal";
import { Selector } from "./BehaviorTree";
import { ObserveBehavior } from "./behaviors/Observe";
import { WanderBehavior } from "./behaviors/Wander";
import { IdleBehavior } from "./behaviors/Idle";
import { BehaviorNode, BehaviorStatus, BrowserContext, PetNeeds } from "../types/ai";

export class DecisionEngine {
  private goals: Goal[] = [];
  private fallbackBehavior: BehaviorNode;

  constructor() {
    // Register active life goals
    this.goals = [
      new HungerGoal(),
      new EnergyGoal(),
      new SocialGoal()
    ];

    // Establish a default baseline priority behavioral sequence
    this.fallbackBehavior = new Selector([
      ObserveBehavior,
      WanderBehavior,
      IdleBehavior
    ]);
  }

  public decide(brain: any, needs: PetNeeds, context: BrowserContext): void {
    // If pet is dragging or sleeping, do not interrupt with decisions
    if (brain.currentAction === "sleeping" && needs.energy < 90) {
      // Keep sleeping to recover energy
      brain.playAnimation("sleep");
      return;
    }

    // Evaluate all goals and sort by priority descendently
    const rankedGoals = this.goals
      .map((g) => ({ goal: g, priority: g.getPriority(needs, context) }))
      .sort((a, b) => b.priority - a.priority);

    // If the top goal has a substantial priority (e.g., > 35), execute it
    if (rankedGoals.length > 0 && rankedGoals[0].priority > 35) {
      const topGoal = rankedGoals[0].goal;
      const status = topGoal.getBehavior().tick(brain, context);
      if (status !== "failure") {
        return;
      }
    }

    // Fallback to default exploration & idle sequence if no major need is demanding attention
    this.fallbackBehavior.tick(brain, context);
  }
}
export default DecisionEngine;
