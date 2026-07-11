import { PetState } from "../types/animation";

export const ANIMATION_TRANSITIONS: Record<PetState, PetState[]> = {
  idle: ["walk", "sleep", "happy", "think", "talk", "jump"],
  walk: ["idle", "jump", "happy"],
  jump: ["idle", "walk"],
  drag: ["idle"], // Drag can only transition to idle/falling on release
  sleep: ["idle"], // Sleep wakes up to idle
  happy: ["idle", "walk"],
  think: ["idle", "talk"],
  talk: ["idle", "think"],
};

export const CUTE_PHRASES: Record<PetState, string[]> = {
  idle: [
    "Hello there! Let's explore!",
    "Ah, a perfect day inside the browser.",
    "Whatcha workin' on?",
    "Need coffee? I can draft a mock cup!",
  ],
  walk: [
    "Stepping through your viewport!",
    "Left foot, right foot...",
    "Off on an adventure!",
    "Exploring the bounds of this screen!",
  ],
  jump: [
    "Boing!",
    "Up we go!",
    "High in the air!",
    "Look at me fly!",
  ],
  drag: [
    "Wheee! Floating in mid-air!",
    "Hold on tight!",
    "Where are you carrying me?",
    "Put me on a cozy button!",
  ],
  sleep: [
    "Zzz...",
    "Snore...",
    "Dreaming of digital carrots...",
    "Sleeping in the safe bounds...",
  ],
  happy: [
    "Yay! I'm so glad to be here!",
    "You're doing great!",
    "I love floating!",
    "Happy times, happy digital life!",
  ],
  think: [
    "Hmm... thinking about code...",
    "What is the meaning of life? 42?",
    "Pondering the secrets of CSS layout...",
    "Refactoring my inner thoughts...",
  ],
  talk: [
    "Listen to this: I can float!",
    "The weather inside is perfect.",
    "Did you know virtual pets don't need real snacks?",
    "Keep up the awesome work!",
  ],
};
