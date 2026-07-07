import { usePetContext } from '../context/PetContext';

/**
 * Custom hook to consume the Digital Pets state context.
 * Exposes all pet-related state, actions, uploads, and generators.
 */
export const usePet = () => {
  return usePetContext();
};
