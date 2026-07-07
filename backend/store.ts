import { Pet } from "../src/types/pet";

/**
 * High-quality procedural, fallback or generated pets mock database.
 */
interface StoredPet {
  id: string;
  name: string;
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  transparent: boolean;
  size: number;
}

// In-memory store for files uploaded or generated during this session
const petStore = new Map<string, StoredPet>();

export const getStoredPet = (id: string): StoredPet | undefined => {
  return petStore.get(id);
};

export const saveStoredPet = (id: string, pet: StoredPet) => {
  petStore.set(id, pet);
};

export const deleteStoredPet = (id: string) => {
  petStore.delete(id);
};
