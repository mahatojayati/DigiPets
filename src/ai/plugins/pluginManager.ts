import { EventBus } from "../EventBus";

export interface PetPlugin {
  id: string;
  name: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  onTrigger: (brain: any, data?: any) => void;
}

export class PluginManager {
  private static instance: PluginManager | null = null;
  private plugins: PetPlugin[] = [];

  private constructor() {
    this.registerDefaultPlugins();
    this.loadState();
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  private registerDefaultPlugins() {
    this.plugins = [
      {
        id: "weather",
        name: "Weather Radar",
        description: "Pet comments on external weather and seeks shade or sun",
        icon: "☀️",
        isEnabled: false,
        onTrigger: (brain, data) => {
          const conditions = ["sunny", "rainy", "snowy", "stormy"];
          const weather = data?.weather || conditions[Math.floor(Math.random() * conditions.length)];
          brain.updateNeed("curiosity", 5);
          
          if (weather === "sunny") {
            brain.say("What a gorgeous sunny day! Perfect for walks! ☀️🐶");
            brain.playAnimation("happy");
          } else if (weather === "rainy") {
            brain.say("Pitter-patter... I love hearing the cozy rain. 🌧️🐱");
            brain.playAnimation("think");
          } else if (weather === "snowy") {
            brain.say("Brrr! It's freezing outside! Let's stay warm. ❄️⛄");
            brain.playAnimation("sleep");
          } else {
            brain.say("Boom! Did you hear that thunder? *scared squeaks* ⛈️");
            brain.playAnimation("think");
          }
          
          brain.getMemory().addEvent("browser_event", `Weather Plugin: Triggered ${weather} conditions.`);
        }
      },
      {
        id: "spotify",
        name: "Spotify Sync",
        description: "Companion senses music playback and starts dancing",
        icon: "🎵",
        isEnabled: false,
        onTrigger: (brain, data) => {
          const track = data?.track || "their favorite lofi beat";
          brain.updateNeed("happiness", 15);
          brain.say(`Ooh, I love this track: "${track}"! Let's dance! 🎵🕺`);
          brain.dance();
          brain.getMemory().addEvent("play", `Listening to music on Spotify.`);
        }
      },
      {
        id: "github",
        name: "GitHub Tracker",
        description: "Senses commits or resolved issues and throws a party",
        icon: "💻",
        isEnabled: false,
        onTrigger: (brain, data) => {
          const type = data?.type || "commit";
          brain.updateNeed("affection", 10);
          brain.updateNeed("energy", 5);
          brain.say("Wow, another green square on GitHub! Brilliant job, human! 💻💚🎉");
          brain.playAnimation("happy");
          brain.getMemory().addEvent("play", `Celebrated successful ${type} contribution on GitHub.`);
        }
      }
    ];
  }

  public getPlugins(): PetPlugin[] {
    return this.plugins;
  }

  public togglePlugin(id: string): boolean {
    const plugin = this.plugins.find((p) => p.id === id);
    if (plugin) {
      plugin.isEnabled = !plugin.isEnabled;
      this.saveState();
      
      // Dispatch event
      EventBus.dispatch("PLUGIN_TOGGLED", { id, isEnabled: plugin.isEnabled });
      return plugin.isEnabled;
    }
    return false;
  }

  public triggerPlugin(id: string, brain: any, data?: any) {
    const plugin = this.plugins.find((p) => p.id === id);
    if (plugin && plugin.isEnabled) {
      plugin.onTrigger(brain, data);
    }
  }

  private saveState() {
    const enabledIds = this.plugins.filter((p) => p.isEnabled).map((p) => p.id);
    localStorage.setItem("digital_pets_enabled_plugins", JSON.stringify(enabledIds));
  }

  private loadState() {
    try {
      const saved = localStorage.getItem("digital_pets_enabled_plugins");
      if (saved) {
        const enabledIds: string[] = JSON.parse(saved);
        this.plugins.forEach((p) => {
          p.isEnabled = enabledIds.includes(p.id);
        });
      }
    } catch (e) {
      console.error("Failed to load plugin state:", e);
    }
  }
}
export default PluginManager;
