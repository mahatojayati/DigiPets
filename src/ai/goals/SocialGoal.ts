import { Goal } from "./Goal";
import { BehaviorNode, PetNeeds, BrowserContext } from "../../types/ai";
import { Selector } from "../BehaviorTree";
import { FollowCursorBehavior } from "../behaviors/FollowCursor";
import { PlayBehavior } from "../behaviors/Play";
import { SpeakBehavior } from "../behaviors/Speak";

export class SocialGoal implements Goal {
  public name = "Socialize and Play";

  public getPriority(needs: PetNeeds, context: BrowserContext): number {
    // boredom goes from 0 (entertained) to 100 (extremely bored)
    const basePriority = needs.boredom;

    // Boost priority if user has mouse nearby (opportunity to play!)
    if (context.isMouseNearby) {
      return Math.min(100, basePriority + 30);
    }

    return basePriority;
  }

  public getBehavior(): BehaviorNode {
    // A Selector: try to follow the cursor first, if that fails (e.g. mouse not nearby),
    // try to play a self-contained game, otherwise speak to the user.
    return new Selector([
      FollowCursorBehavior,
      PlayBehavior,
      SpeakBehavior
    ]);
  }
}
export default SocialGoal;
