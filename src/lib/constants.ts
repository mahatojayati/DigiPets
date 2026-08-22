/**
 * Global constants for the Digital Pets application.
 */

export const APP_NAME = "Digital Pets";
export const APP_TAGLINE = "Tiny companions that float around your screen and keep you company.";

export const MAX_FILE_SIZE_MB = 15;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/webp',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml',
  'image/gif'
];

export const PRESET_AI_PROMPTS = [
  "Cute chubby orange corgi wearing tiny round specs",
  "Fluffy white calico kitten with a pink ribbon around its neck",
  "Kawaii green baby dragon with large sparkly yellow eyes",
  "Tiny sleeping fox curled up inside a teal wizard hat",
  "Plump penguin wearing a little red knitted winter beanie",
  "Adorable baby frog sitting on a glossy emerald water lily"
];

export const PET_PRESETS = [
  {
    id: 'preset-cat',
    name: 'Milo',
    imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=milo',
    method: 'generate' as const,
    description: 'A mischievous kitten who loves chasing cursors.'
  },
  {
    id: 'preset-dog',
    name: 'Buster',
    imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=buster',
    method: 'generate' as const,
    description: 'A friendly corgi with a heart of pure gold.'
  },
  {
    id: 'preset-dragon',
    name: 'Ignis',
    imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ignis',
    method: 'generate' as const,
    description: 'A small pocket dragon who spits tiny harmless sparkles.'
  }
];
