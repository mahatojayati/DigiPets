/**
 * Procedural SVG Pet Generator
 * Generates beautiful, responsive, transparent vector pets based on prompts/seeds.
 * Extremely cute, Nintendo-inspired pastel design with dynamic themes.
 */

// Simple string hashing function
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const PASTEL_COLORS = [
  "#FFB7B2", // Soft Coral
  "#FFDAC1", // Peach
  "#E2F0CB", // Mint
  "#B5EAD7", // Pastel Teal
  "#C7CEEA", // Periwinkle
  "#FFC6FF", // Lavender Candy
  "#BDB2FF", // Soft Purple
  "#9BF6FF", // Sky Blue
  "#FDFFB6", // Soft Yellow
];

const EYE_TYPES = [
  "sparkle", // Big anime eyes with sparkles
  "happy",   // Curved happy eyes (^^)
  "wink",    // One sparkle, one curved
  "cool",    // Sunglasses / half-closed cool eyes
];

const EAR_TYPES = [
  "cat",     // Pointy triangular ears
  "bear",    // Round semi-circular ears
  "bunny",   // Tall floppy ears
  "fox",     // Double-layered pointy ears
];

export function generatePetSvg(prompt: string): { svg: string; width: number; height: number } {
  const seed = getHash(prompt || "Pixel Mochi");
  const baseColor = PASTEL_COLORS[seed % PASTEL_COLORS.length];
  const earColor = PASTEL_COLORS[(seed + 2) % PASTEL_COLORS.length];
  const cheekColor = "#FF8B94";
  
  const eyeType = EYE_TYPES[seed % EYE_TYPES.length];
  const earType = EAR_TYPES[(seed + 1) % EAR_TYPES.length];
  
  // Theme accessories based on keywords in prompt
  const lowercasePrompt = prompt.toLowerCase();
  let accessory = "";
  
  if (lowercasePrompt.includes("wizard") || lowercasePrompt.includes("mage") || lowercasePrompt.includes("magic")) {
    // Wizard Hat
    accessory = `
      <g id="wizard-hat">
        <path d="M 120,80 L 190,0 L 210,50 Z" fill="#6C5CE7" stroke="#2D3436" stroke-width="6" stroke-linejoin="round" />
        <ellipse cx="165" cy="70" rx="60" ry="15" fill="#5F27CD" stroke="#2D3436" stroke-width="6" />
        <path d="M 140,68 C 150,65, 175,65, 185,68" stroke="#F1C40F" stroke-width="8" fill="none" />
        <polygon points="165,60 170,68 178,68 172,73 174,80 165,75 156,80 158,73 152,68 160,68" fill="#F1C40F" />
      </g>
    `;
  } else if (lowercasePrompt.includes("cyber") || lowercasePrompt.includes("robot") || lowercasePrompt.includes("tech") || lowercasePrompt.includes("cool")) {
    // Cyber Visor / Cool Glasses
    accessory = `
      <g id="cyber-glasses">
        <rect x="80" y="130" width="160" height="35" rx="8" fill="#00CEC9" stroke="#2D3436" stroke-width="6" opacity="0.9" />
        <line x1="90" y1="147" x2="230" y2="147" stroke="#FFF" stroke-width="4" stroke-linecap="round" />
        <rect x="70" y="142" width="15" height="10" rx="3" fill="#2D3436" />
        <rect x="235" y="142" width="15" height="10" rx="3" fill="#2D3436" />
      </g>
    `;
  } else if (lowercasePrompt.includes("crown") || lowercasePrompt.includes("king") || lowercasePrompt.includes("queen") || lowercasePrompt.includes("royal") || lowercasePrompt.includes("princess")) {
    // Royal Crown
    accessory = `
      <g id="royal-crown">
        <path d="M 100,80 L 90,45 L 125,60 L 160,35 L 195,60 L 230,45 L 220,80 Z" fill="#F1C40F" stroke="#2D3436" stroke-width="6" stroke-linejoin="round" />
        <circle cx="90" cy="45" r="5" fill="#E74C3C" />
        <circle cx="160" cy="35" r="5" fill="#9B59B6" />
        <circle cx="230" cy="45" r="5" fill="#3498DB" />
        <rect x="115" y="70" width="90" height="8" fill="#D35400" />
      </g>
    `;
  } else if (lowercasePrompt.includes("angel") || lowercasePrompt.includes("fairy") || lowercasePrompt.includes("wing") || lowercasePrompt.includes("ghost")) {
    // Cute Halo
    accessory = `
      <g id="halo">
        <ellipse cx="160" cy="40" rx="55" ry="14" fill="none" stroke="#F1C40F" stroke-width="8" opacity="0.9" />
        <ellipse cx="160" cy="40" rx="55" ry="14" fill="none" stroke="#FFF" stroke-width="3" opacity="0.9" />
      </g>
    `;
  } else if (lowercasePrompt.includes("chef") || lowercasePrompt.includes("cook") || lowercasePrompt.includes("boba") || lowercasePrompt.includes("pancake") || lowercasePrompt.includes("sweet")) {
    // Chef Hat
    accessory = `
      <g id="chef-hat">
        <path d="M 110,85 C 100,50, 130,30, 145,45 C 150,25, 180,25, 185,45 C 200,30, 230,50, 220,85 Z" fill="#FFFFFF" stroke="#2D3436" stroke-width="6" stroke-linejoin="round" />
        <rect x="120" y="75" width="88" height="15" rx="4" fill="#FFFFFF" stroke="#2D3436" stroke-width="6" />
      </g>
    `;
  } else if (lowercasePrompt.includes("flower") || lowercasePrompt.includes("sakura") || lowercasePrompt.includes("garden") || lowercasePrompt.includes("nature")) {
    // Flower Pin
    accessory = `
      <g id="flower-pin" transform="translate(210, 95)">
        <circle cx="-10" cy="-10" r="12" fill="#FF7675" stroke="#2D3436" stroke-width="4" />
        <circle cx="10" cy="-10" r="12" fill="#FF7675" stroke="#2D3436" stroke-width="4" />
        <circle cx="10" cy="10" r="12" fill="#FF7675" stroke="#2D3436" stroke-width="4" />
        <circle cx="-10" cy="10" r="12" fill="#FF7675" stroke="#2D3436" stroke-width="4" />
        <circle cx="0" cy="0" r="12" fill="#FFEAA7" stroke="#2D3436" stroke-width="4" />
      </g>
    `;
  }

  // Draw Ears
  let earsSvg = "";
  if (earType === "cat") {
    earsSvg = `
      <!-- Left Ear -->
      <path d="M 70,120 L 50,50 L 110,95 Z" fill="${earColor}" stroke="#2D3436" stroke-width="6" stroke-linejoin="round" />
      <path d="M 75,110 L 63,68 L 100,95 Z" fill="#FF8B94" opacity="0.6" />
      <!-- Right Ear -->
      <path d="M 250,120 L 270,50 L 210,95 Z" fill="${earColor}" stroke="#2D3436" stroke-width="6" stroke-linejoin="round" />
      <path d="M 245,110 L 257,68 L 220,95 Z" fill="#FF8B94" opacity="0.6" />
    `;
  } else if (earType === "bear") {
    earsSvg = `
      <!-- Left Ear -->
      <circle cx="75" cy="95" r="30" fill="${earColor}" stroke="#2D3436" stroke-width="6" />
      <circle cx="75" cy="95" r="18" fill="#FF8B94" opacity="0.6" />
      <!-- Right Ear -->
      <circle cx="245" cy="95" r="30" fill="${earColor}" stroke="#2D3436" stroke-width="6" />
      <circle cx="245" cy="95" r="18" fill="#FF8B94" opacity="0.6" />
    `;
  } else if (earType === "bunny") {
    earsSvg = `
      <!-- Left Bunny Ear -->
      <rect x="75" y="10" width="35" height="100" rx="17" fill="${earColor}" stroke="#2D3436" stroke-width="6" transform="rotate(-15, 92, 60)" />
      <rect x="83" y="20" width="19" height="75" rx="9" fill="#FF8B94" opacity="0.6" transform="rotate(-15, 92, 60)" />
      <!-- Right Bunny Ear -->
      <rect x="210" y="10" width="35" height="100" rx="17" fill="${earColor}" stroke="#2D3436" stroke-width="6" transform="rotate(15, 227, 60)" />
      <rect x="218" y="20" width="19" height="75" rx="9" fill="#FF8B94" opacity="0.6" transform="rotate(15, 227, 60)" />
    `;
  } else {
    // Fox Ears (Double triangular layered)
    earsSvg = `
      <!-- Left Fox Ear -->
      <path d="M 65,115 L 35,40 L 115,85 Z" fill="${earColor}" stroke="#2D3436" stroke-width="6" stroke-linejoin="round" />
      <path d="M 75,105 L 53,60 L 105,85 Z" fill="#FF7675" opacity="0.8" />
      <!-- Right Fox Ear -->
      <path d="M 255,115 L 285,40 L 205,85 Z" fill="${earColor}" stroke="#2D3436" stroke-width="6" stroke-linejoin="round" />
      <path d="M 245,105 L 267,60 L 215,85 Z" fill="#FF7675" opacity="0.8" />
    `;
  }

  // Draw Eyes
  let eyesSvg = "";
  if (eyeType === "happy") {
    eyesSvg = `
      <!-- Happy Eyes -->
      <path d="M 95,145 Q 110,130 125,145" fill="none" stroke="#2D3436" stroke-width="7" stroke-linecap="round" />
      <path d="M 195,145 Q 210,130 225,145" fill="none" stroke="#2D3436" stroke-width="7" stroke-linecap="round" />
    `;
  } else if (eyeType === "wink") {
    eyesSvg = `
      <!-- Left Eye Sparkle -->
      <circle cx="110" cy="142" r="14" fill="#2D3436" />
      <circle cx="106" cy="137" r="5" fill="#FFFFFF" />
      <circle cx="114" cy="145" r="2.5" fill="#FFFFFF" />
      <!-- Right Eye Happy Wink -->
      <path d="M 195,145 Q 210,130 225,145" fill="none" stroke="#2D3436" stroke-width="7" stroke-linecap="round" />
    `;
  } else if (eyeType === "cool" && !accessory.includes("cyber-glasses")) {
    eyesSvg = `
      <!-- Cool Sunglasses -->
      <polygon points="80,130 140,130 130,155 90,155" fill="#2D3436" stroke="#2D3436" stroke-width="4" stroke-linejoin="round" />
      <polygon points="180,130 240,130 230,155 190,155" fill="#2D3436" stroke="#2D3436" stroke-width="4" stroke-linejoin="round" />
      <line x1="140" y1="135" x2="180" y2="135" stroke="#2D3436" stroke-width="6" />
      <line x1="92" y1="137" x2="120" y2="137" stroke="#FFF" stroke-width="3" opacity="0.6" />
      <line x1="192" y1="137" x2="220" y2="137" stroke="#FFF" stroke-width="3" opacity="0.6" />
    `;
  } else {
    // Default: Sparkle Anime Eyes
    eyesSvg = `
      <!-- Sparkle Eyes -->
      <circle cx="110" cy="142" r="14" fill="#2D3436" />
      <circle cx="106" cy="136" r="5" fill="#FFFFFF" />
      <circle cx="114" cy="145" r="2.5" fill="#FFFFFF" />
      
      <circle cx="210" cy="142" r="14" fill="#2D3436" />
      <circle cx="206" cy="136" r="5" fill="#FFFFFF" />
      <circle cx="214" cy="145" r="2.5" fill="#FFFFFF" />
    `;
  }

  // Combine entire SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="100%" height="100%">
      <defs>
        <!-- Custom Shadow Filter -->
        <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#2D3436" flood-opacity="0.15" />
        </filter>
        <!-- Radial Gradients for Pastel Bodies -->
        <radialGradient id="body-grad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
          <stop offset="100%" stop-color="${baseColor}" stop-opacity="0" />
        </radialGradient>
      </defs>

      <g filter="url(#soft-shadow)">
        ${earsSvg}

        <!-- Main Body (Slightly squished round dumpling shape) -->
        <path d="M 60,180 C 60,110, 260,110, 260,180 C 260,250, 240,265, 160,265 C 80,265, 60,250, 60,180 Z" 
              fill="${baseColor}" stroke="#2D3436" stroke-width="8" stroke-linejoin="round" />
        
        <!-- Shading Overlay -->
        <path d="M 60,180 C 60,110, 260,110, 260,180 C 260,250, 240,265, 160,265 C 80,265, 60,250, 60,180 Z" 
              fill="url(#body-grad)" style="mix-blend-mode: overlay;" />

        <!-- Rosy Cheeks -->
        <ellipse cx="85" cy="162" rx="11" ry="7" fill="${cheekColor}" opacity="0.6" />
        <ellipse cx="235" cy="162" rx="11" ry="7" fill="${cheekColor}" opacity="0.6" />

        <!-- Render Eyes -->
        ${eyesSvg}

        <!-- Mouth (W-mouth or happy cute curve) -->
        <path d="M 152,158 Q 160,165 168,158 Q 176,165 184,158" fill="none" stroke="#2D3436" stroke-width="5" stroke-linecap="round" />

        <!-- Body Details (Tiny belly patch) -->
        <ellipse cx="160" cy="225" rx="45" ry="25" fill="#FFFFFF" opacity="0.5" />

        <!-- Cute Tiny Little Feet -->
        <ellipse cx="100" cy="263" rx="18" ry="10" fill="${baseColor}" stroke="#2D3436" stroke-width="6" />
        <ellipse cx="220" cy="263" rx="18" ry="10" fill="${baseColor}" stroke="#2D3436" stroke-width="6" />

        <!-- Dynamic Accessory -->
        ${accessory}
      </g>
    </svg>
  `.trim();

  return { svg, width: 320, height: 320 };
}
