import { EventBus } from "../ai/EventBus";

export class BrowserEventsService {
  private static instance: BrowserEventsService | null = null;
  private mouseIdleTimeout: ReturnType<typeof setTimeout> | null = null;
  private isListening = false;

  private constructor() {}

  public static getInstance(): BrowserEventsService {
    if (!BrowserEventsService.instance) {
      BrowserEventsService.instance = new BrowserEventsService();
    }
    return BrowserEventsService.instance;
  }

  public start() {
    if (this.isListening || typeof window === "undefined") return;
    this.isListening = true;

    // 1. Mouse movement and mouse idle tracking
    window.addEventListener("mousemove", this.handleMouseMove);
    this.resetMouseIdleTimer();

    // 2. Window/Tab Visibility
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // 3. Scroll tracking
    window.addEventListener("scroll", this.handleScroll, { passive: true });

    // 4. Typing tracking
    window.addEventListener("keydown", this.handleKeyDown);

    // 5. Window Focus (New tab / Tab switch back)
    window.addEventListener("focus", this.handleFocus);

    // 6. Dark Mode detection
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.addEventListener("change", this.handleDarkModeChange);
    
    // Dispatch initial state
    if (darkModeQuery.matches) {
      EventBus.dispatch("BROWSER_DARK_MODE", true);
    }
  }

  public stop() {
    if (!this.isListening || typeof window === "undefined") return;
    this.isListening = false;

    window.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("focus", this.handleFocus);

    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeQuery.removeEventListener("change", this.handleDarkModeChange);

    if (this.mouseIdleTimeout) {
      clearTimeout(this.mouseIdleTimeout);
      this.mouseIdleTimeout = null;
    }
  }

  private handleMouseMove = () => {
    EventBus.dispatch("BROWSER_MOUSE_MOVE");
    this.resetMouseIdleTimer();
  };

  private resetMouseIdleTimer() {
    if (this.mouseIdleTimeout) {
      clearTimeout(this.mouseIdleTimeout);
    }
    this.mouseIdleTimeout = setTimeout(() => {
      EventBus.dispatch("BROWSER_MOUSE_IDLE");
    }, 15000); // 15 seconds idle
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      EventBus.dispatch("BROWSER_HIDDEN");
    } else {
      EventBus.dispatch("BROWSER_VISIBLE");
    }
  };

  private handleScroll = () => {
    EventBus.dispatch("BROWSER_SCROLL", window.scrollY);
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    EventBus.dispatch("BROWSER_TYPING", e.key);
  };

  private handleFocus = () => {
    EventBus.dispatch("BROWSER_FOCUS");
  };

  private handleDarkModeChange = (e: MediaQueryListEvent) => {
    EventBus.dispatch("BROWSER_DARK_MODE", e.matches);
  };
}
export default BrowserEventsService;
