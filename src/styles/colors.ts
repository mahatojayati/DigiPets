/**
 * Design system colors blending Notion/Linear modern slate tones
 * with cute pastel Nintendo-inspired accents.
 */
export const colors = {
  // Base backgrounds
  bg: {
    primary: '#F9F9FB',      // Very light modern off-white (Notion-like)
    secondary: '#FFFFFF',    // Pure white for cards/surfaces
    tertiary: '#F0F1F5',     // Soft grey-blue for headers/inputs
    dark: '#121214',         // Deep slate dark mode background
    darkCard: '#1E1E22',     // Dark mode card base
  },
  
  // Borders
  border: {
    light: '#E2E4E9',        // Soft border (Notion/Linear style)
    medium: '#D1D5DB',       // Slightly stronger border for interactive components
    dark: '#2A2A30',         // Dark mode border
  },

  // Interactive Accents (Nintendo Aesthetics)
  accent: {
    pink: {
      light: '#FFF0F5',
      main: '#FF7EA5',       // Peach/Coral pink
      hover: '#FF6492',
    },
    yellow: {
      light: '#FFFDF0',
      main: '#FFD166',       // Warm yellow (gold star)
      hover: '#FFC53D',
    },
    blue: {
      light: '#F0F8FF',
      main: '#4EA8DE',       // Soft sky blue (cloud/water)
      hover: '#3A97D0',
    },
    green: {
      light: '#F0FFF4',
      main: '#06D6A0',       // Mint leaf green
      hover: '#05C090',
    },
    purple: {
      light: '#F5F3FF',
      main: '#8338EC',       // Magic wand/purple accent
      hover: '#7226DB',
    }
  },

  // Text
  text: {
    primary: '#1A1A1E',      // Dark slate primary text
    secondary: '#5C5F6A',    // Medium muted grey
    muted: '#9E9EAF',        // Lighter gray for helpers/sub-info
    onAccent: '#FFFFFF',     // Text on colored buttons
  }
};
