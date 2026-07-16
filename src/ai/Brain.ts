import { PetEngine } from "../engine/PetEngine";
import { usePetStore } from "../store/petStore";
import { PERSONALITIES } from "./personality/personalities";
import { ContextManager } from "./ContextManager";
import { Memory } from "./Memory";
import { EmotionEngine } from "./EmotionEngine";
import { DecisionEngine } from "./DecisionEngine";
import { Scheduler } from "./Scheduler";
import { EventBus } from "./EventBus";
import { PluginManager } from "./plugins/pluginManager";
import {
  PetNeeds,
  Personality,
  BrowserContext,
  EmotionType,
} from "../types/ai";
import { Vector2D } from "../types/physics";
import { PetState } from "../types/animation";

export class Brain {
  private static instance: Brain | null = null;
  private petEngine: PetEngine | null = null;

  // Subsystems
  private contextManager: ContextManager;
  private memory: Memory;
  private emotionEngine: EmotionEngine;
  private decisionEngine: DecisionEngine;
  private scheduler: Scheduler;
  private unsubscribers: (() => void)[] = [];

  // Personality & Mood
  public personality: Personality;
  public currentEmotion: EmotionType = "happy";
  public currentAction: string = "idle";
  private lastInteractTime: number = Date.now();

  // Needs local state (complements store state)
  public needs: PetNeeds = {
    hunger: 80,
    energy: 90,
    happiness: 80,
    curiosity: 50,
    boredom: 10,
    affection: 70,
  };

  private constructor() {
    this.contextManager = ContextManager.getInstance();
    this.memory = new Memory();
    this.emotionEngine = new EmotionEngine();
    this.decisionEngine = new DecisionEngine();
    this.scheduler = new Scheduler();

    // Default to playful, or loaded from config/active companion
    this.personality = PERSONALITIES.playful;

    this.loadNeeds();
    this.setupEventSubscriptions();
    this.startLifecycle();
  }

  private setupEventSubscriptions(): void {
    const unsubFeed = EventBus.subscribe("FEED", (amount) => {
      this.recordFeeding();
      if (typeof amount === "number") {
        this.updateNeed("hunger", amount);
      }
    });

    const unsubPlay = EventBus.subscribe("PLAY", (data) => {
      this.recordPlaying();
      if (data && typeof data.boredom === "number") {
        this.updateNeed("boredom", data.boredom);
      }
    });

    const unsubClick = EventBus.subscribe("CLICK", () => {
      this.recordInteraction();
      this.memory.incrementClicked();
      this.updateNeed("affection", 2);
    });

    const unsubDrag = EventBus.subscribe("DRAG", () => {
      this.recordInteraction();
      this.memory.incrementDragged();
      this.updateNeed("affection", 1);
    });

    // Browser Event Subscriptions for Autonomous Reactivity
    const unsubHidden = EventBus.subscribe("BROWSER_HIDDEN", () => {
      this.sleep();
      this.memory.addEvent("tab_hide", "Went to sleep because the browser window was hidden.");
    });

    const unsubVisible = EventBus.subscribe("BROWSER_VISIBLE", () => {
      this.wake();
      this.playAnimation("happy");
      this.say("Oh, you're back! I was beginning to miss you. ✨");
      this.memory.addEvent("browser_event", "Woke up and greeted the user upon tab switch.");
    });

    const unsubMouseIdle = EventBus.subscribe("BROWSER_MOUSE_IDLE", () => {
      this.updateNeed("boredom", 15);
      this.currentEmotion = "lonely";
      this.playAnimation("think");
      this.say("It's so quiet... are you still there? 🥺");
      this.memory.addEvent("ignored", "Felt lonely because the mouse was idle.", 15);
    });

    const unsubScroll = EventBus.subscribe("BROWSER_SCROLL", () => {
      this.playAnimation("think");
      this.updateNeed("curiosity", 2);
      this.say("Wheee, let's see what's down here! 📜");
      this.memory.addEvent("scroll", "Looked around curiously as the user scrolled.");
    });

    const unsubTyping = EventBus.subscribe("BROWSER_TYPING", (key) => {
      this.updateNeed("curiosity", 4);
      this.playAnimation("think");
      if (Math.random() < 0.2) {
        this.say(`Tap tap tap! What are you typing? 🧐`);
      }
      this.memory.addEvent("typing", `Listened to key tap: "${key}"`);
    });

    const unsubFocus = EventBus.subscribe("BROWSER_FOCUS", () => {
      this.playAnimation("happy");
      this.say("Welcome back! Ready to focus? 🚀");
    });

    const unsubDarkMode = EventBus.subscribe("BROWSER_DARK_MODE", (isDark) => {
      this.playAnimation("sleep");
      this.say("Ah, dark mode! Perfect for a cozy rest... *yawns* 😴");
    });

    const unsubTriggerPlugin = EventBus.subscribe("TRIGGER_PLUGIN", (payload) => {
      if (payload && payload.id) {
        PluginManager.getInstance().triggerPlugin(payload.id, this, payload.data);
      }
    });

    this.unsubscribers.push(
      unsubFeed,
      unsubPlay,
      unsubClick,
      unsubDrag,
      unsubHidden,
      unsubVisible,
      unsubMouseIdle,
      unsubScroll,
      unsubTyping,
      unsubFocus,
      unsubDarkMode,
      unsubTriggerPlugin
    );
  }

  public static getInstance(): Brain {
    if (!Brain.instance) {
      Brain.instance = new Brain();
    }
    return Brain.instance;
  }

  public registerPetEngine(petEngine: PetEngine): void {
    this.petEngine = petEngine;
    
    // Auto-adopt personality if matching name/attributes in the future
    const active = usePetStore.getState().activePet;
    if (active) {
      // Choose personality based on companion name/type hashes
      const index = Math.abs(active.name.length % Object.keys(PERSONALITIES).length);
      const key = Object.keys(PERSONALITIES)[index];
      this.personality = PERSONALITIES[key] || PERSONALITIES.playful;
      console.log(`AI Brain synchronized personality [${this.personality.name}] for companion [${active.name}]`);
    }
  }

  public unregisterPetEngine(): void {
    this.petEngine = null;
  }

  private loadNeeds(): void {
    try {
      // Read current state from usePetStore (source of truth for hunger & energy)
      const store = usePetStore.getState();
      this.needs.hunger = store.hunger;
      this.needs.energy = store.energy;

      // Load additional stats from localStorage
      const saved = localStorage.getItem("digital_pets_brain_needs");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.needs.happiness = parsed.happiness ?? 80;
        this.needs.curiosity = parsed.curiosity ?? 50;
        this.needs.boredom = parsed.boredom ?? 10;
        this.needs.affection = parsed.affection ?? 70;
      }
    } catch (e) {
      console.error("Failed to load needs:", e);
    }
  }

  public saveNeeds(): void {
    try {
      localStorage.setItem("digital_pets_brain_needs", JSON.stringify({
        happiness: this.needs.happiness,
        curiosity: this.needs.curiosity,
        boredom: this.needs.boredom,
        affection: this.needs.affection,
      }));
    } catch (e) {
      console.error("Failed to save needs:", e);
    }
  }

  private startLifecycle(): void {
    // Start the background Scheduler ticking needs (10s), emotion (3s), and decision (2s)
    this.scheduler.start(
      () => this.tickNeeds(),
      () => this.tickEmotion(),
      () => this.tickDecision()
    );
  }

  public stopLifecycle(): void {
    this.scheduler.stop();
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }

  // --- LIFECYCLE TICK CALLBACKS ---

  private tickNeeds(): void {
    // 1. Sync hunger & energy from store (source of truth)
    const store = usePetStore.getState();
    this.needs.hunger = store.hunger;
    this.needs.energy = store.energy;

    // Apply personality modifiers to decay rates
    const rate = this.personality.moodChangeRate;

    // 2. Simulate physiological changes
    if (this.currentAction === "sleeping") {
      this.needs.energy = Math.min(100, this.needs.energy + 8);
      usePetStore.setState({ energy: this.needs.energy });
    } else {
      // Normal decay
      this.needs.energy = Math.max(0, this.needs.energy - 1 * rate);
      this.needs.hunger = Math.max(0, this.needs.hunger - 1.5 * rate);
      this.needs.boredom = Math.min(100, this.needs.boredom + 2 * rate);

      // Sync hunger & energy back to the store
      usePetStore.setState({
        hunger: this.needs.hunger,
        energy: this.needs.energy,
      });
    }

    // 3. Fluctuated needs
    this.needs.curiosity = Math.max(10, Math.min(100, this.needs.curiosity + (Math.random() * 6 - 3)));
    this.needs.happiness = Math.max(0, Math.min(100, (this.needs.hunger + this.needs.energy + (100 - this.needs.boredom)) / 3));

    this.saveNeeds();
  }

  private tickEmotion(): void {
    if (!this.petEngine) return;

    const petPos = { x: this.petEngine.getState().x, y: this.petEngine.getState().y };
    const context = this.contextManager.getContext(petPos);
    const isDragging = this.petEngine.getState().isDragging;

    // Evaluate current emotion state
    const previousEmotion = this.currentEmotion;
    this.currentEmotion = this.emotionEngine.evaluate(
      this.needs,
      this.lastInteractTime,
      context,
      isDragging
    );

    // If emotion changed, play matching animation
    if (this.currentEmotion !== previousEmotion) {
      console.log(`Companion feeling changed: ${previousEmotion} -> ${this.currentEmotion}`);
      
      // Map emotions to animations
      if (this.currentEmotion === "sleepy") {
        this.playAnimation("yawn");
      } else if (this.currentEmotion === "excited") {
        this.playAnimation("dance");
      } else if (this.currentEmotion === "angry" || this.currentEmotion === "confused") {
        this.playAnimation("blink");
      }
    }
  }

  private tickDecision(): void {
    if (!this.petEngine) return;

    const petPos = { x: this.petEngine.getState().x, y: this.petEngine.getState().y };
    const context = this.contextManager.getContext(petPos);

    // Keep memory in sync with drag actions
    if (this.petEngine.getState().isDragging) {
      this.memory.incrementDragged();
      this.recordInteraction();
    }

    // Make utility or behavior-tree decisions
    this.decisionEngine.decide(this, this.needs, context);
  }

  // --- ACTIONS EXPOSED FOR LLM / BT BEHAVIORS ---

  public walkTo(x: number, y: number): void {
    if (!this.petEngine) return;
    this.currentAction = "walking";
    this.petEngine.walkTo(x, y);
  }

  public sleep(): void {
    if (!this.petEngine) return;
    this.currentAction = "sleeping";
    this.petEngine.sleep();
  }

  public wake(): void {
    if (!this.petEngine) return;
    this.currentAction = "idle";
    this.petEngine.wake();
  }

  public say(text: string): void {
    usePetStore.getState().speak(text, 4000);
  }

  public playAnimation(name: string): void {
    if (!this.petEngine) return;
    this.currentAction = name;
    this.petEngine.play(name as PetState);
  }

  public followCursor(): void {
    if (!this.petEngine) return;
    this.currentAction = "following";
    this.petEngine.followCursor();
  }

  public stop(): void {
    if (!this.petEngine) return;
    this.currentAction = "idle";
    this.petEngine.stop();
  }

  public lookAt(cursor: Vector2D): void {
    if (!this.petEngine) return;
    const petState = this.petEngine.getState();
    const direction = cursor.x < petState.x ? "left" : "right";
    petState.direction = direction;
  }

  public dance(): void {
    this.playAnimation("dance");
  }

  public hide(): void {
    if (!this.petEngine) return;
    this.petEngine.hide();
  }

  // --- UTILITY METHODS ---

  public updateNeed(need: keyof PetNeeds, amount: number): void {
    this.needs[need] = Math.max(0, Math.min(100, this.needs[need] + amount));
    if (need === "hunger" || need === "energy") {
      usePetStore.setState({ [need]: this.needs[need] });
    }
    this.saveNeeds();
  }

  public recordInteraction(): void {
    this.lastInteractTime = Date.now();
    this.needs.boredom = Math.max(0, this.needs.boredom - 10);
    this.needs.affection = Math.min(100, this.needs.affection + 2);
    this.saveNeeds();
  }

  public recordFeeding(): void {
    this.recordInteraction();
    this.memory.recordFeeding();
    this.updateNeed("hunger", 20);
  }

  public recordPlaying(): void {
    this.recordInteraction();
    this.memory.recordPlay();
    this.updateNeed("boredom", -30);
  }

  public getMemory(): Memory {
    return this.memory;
  }

  public setAction(action: string): void {
    this.currentAction = action;
  }
}
export default Brain;
