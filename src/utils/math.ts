export const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};

export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomIntInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const mapRange = (
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
): number => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};
