import { BrowserContext } from "../types/ai";
import { Vector2D } from "../types/physics";

export class ContextManager {
  private static instance: ContextManager;
  private mousePos: Vector2D = { x: 0, y: 0 };
  private prevMousePos: Vector2D = { x: 0, y: 0 };
  private mouseSpeed: number = 0;
  private isFocus: boolean = true;
  private visibility: "visible" | "hidden" = "visible";
  private scrollY: number = 0;
  private wWidth: number = window.innerWidth;
  private wHeight: number = window.innerHeight;
  private networkOnline: boolean = navigator.onLine;

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }

  private setupListeners() {
    if (typeof window === "undefined") return;

    window.addEventListener("mousemove", (e) => {
      this.prevMousePos = { ...this.mousePos };
      this.mousePos = { x: e.clientX, y: e.clientY };
      const dx = this.mousePos.x - this.prevMousePos.x;
      const dy = this.mousePos.y - this.prevMousePos.y;
      this.mouseSpeed = Math.sqrt(dx * dx + dy * dy);
    });

    window.addEventListener("focus", () => {
      this.isFocus = true;
    });

    window.addEventListener("blur", () => {
      this.isFocus = false;
    });

    document.addEventListener("visibilitychange", () => {
      this.visibility = document.visibilityState as "visible" | "hidden";
    });

    window.addEventListener("scroll", () => {
      this.scrollY = window.scrollY;
    });

    window.addEventListener("resize", () => {
      this.wWidth = window.innerWidth;
      this.wHeight = window.innerHeight;
    });

    window.addEventListener("online", () => {
      this.networkOnline = true;
    });

    window.addEventListener("offline", () => {
      this.networkOnline = false;
    });
  }

  public getContext(petPosition: Vector2D): BrowserContext {
    const dx = this.mousePos.x - petPosition.x;
    const dy = this.mousePos.y - petPosition.y;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
    
    // Consider mouse nearby if it's within 180 pixels of the pet's center
    const isMouseNearby = distanceToMouse < 180;
    
    // Consider mouse moving rapidly if instant speed is high
    const isMouseMovingRapidly = this.mouseSpeed > 45;

    // Decelerate speed decay slightly
    this.mouseSpeed *= 0.85;

    return {
      currentTime: new Date().toLocaleTimeString(),
      browserFocus: this.isFocus,
      tabVisibility: this.visibility,
      mousePosition: { ...this.mousePos },
      isMouseNearby,
      isMouseMovingRapidly,
      scrollPosition: this.scrollY,
      windowSize: { width: this.wWidth, height: this.wHeight },
    };
  }

  public isOnline(): boolean {
    return this.networkOnline;
  }
}
export default ContextManager;
