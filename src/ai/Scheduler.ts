export class Scheduler {
  private needsIntervalId: any = null;
  private emotionIntervalId: any = null;
  private decisionIntervalId: any = null;

  public start(
    onTickNeeds: () => void,
    onTickEmotion: () => void,
    onTickDecision: () => void
  ): void {
    this.stop();

    // Needs decay every 10 seconds
    this.needsIntervalId = setInterval(() => {
      onTickNeeds();
    }, 10000);

    // Emotion evaluation every 3 seconds
    this.emotionIntervalId = setInterval(() => {
      onTickEmotion();
    }, 3000);

    // Decision/Brain tick every 2 seconds
    this.decisionIntervalId = setInterval(() => {
      onTickDecision();
    }, 2000);
  }

  public stop(): void {
    if (this.needsIntervalId) {
      clearInterval(this.needsIntervalId);
      this.needsIntervalId = null;
    }
    if (this.emotionIntervalId) {
      clearInterval(this.emotionIntervalId);
      this.emotionIntervalId = null;
    }
    if (this.decisionIntervalId) {
      clearInterval(this.decisionIntervalId);
      this.decisionIntervalId = null;
    }
  }
}
export default Scheduler;
