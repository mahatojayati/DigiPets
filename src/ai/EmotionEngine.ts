import { EmotionType, PetNeeds } from "../types/ai";
import { BrowserContext } from "../types/ai";

export class EmotionEngine {
  private currentEmotion: EmotionType = "happy";

  public evaluate(
    needs: PetNeeds,
    lastInteractTime: number,
    context: BrowserContext,
    isDragging: boolean
  ): EmotionType {
    const now = Date.now();
    const secSinceInteract = (now - lastInteractTime) / 1000;

    // 1. Extreme State: Dragging
    if (isDragging) {
      return "confused";
    }

    // 2. Extreme State: High Startle (rapid cursor nearby)
    if (context.isMouseNearby && context.isMouseMovingRapidly) {
      return "angry";
    }

    // 3. Needs: Low Energy
    if (needs.energy < 20) {
      return "sleepy";
    }

    // 4. Needs: Starving / High Hunger
    if (needs.hunger < 25) {
      return "angry";
    }

    // 5. Loneliness: idle for a long time without interaction (e.g. > 45 seconds)
    if (secSinceInteract > 45) {
      return "lonely";
    }

    // 6. Curious: Mouse is close and moving around
    if (context.isMouseNearby) {
      return "curious";
    }

    // 7. Boredom: Needs Fun / Play
    if (needs.boredom > 75) {
      return "sad";
    }

    // 8. Positive states
    if (needs.happiness > 75) {
      return "excited";
    }

    return "happy";
  }

  public getEmotion(): EmotionType {
    return this.currentEmotion;
  }
}
export default EmotionEngine;
