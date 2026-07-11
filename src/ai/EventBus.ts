type EventCallback = (data?: any) => void;

export class EventBus {
  private static listeners: Record<string, EventCallback[]> = {};

  public static subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    };
  }

  public static dispatch(event: string, data?: any): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => {
      try {
        callback(data);
      } catch (e) {
        console.error(`Error in EventBus subscriber for event ${event}:`, e);
      }
    });
  }
}
export default EventBus;
