/**
 * Service to handle retrieving pet metadata with robust client-side fallback.
 */
export const petService = {
  getPetMetadata: async (
    id: string
  ): Promise<{ name: string; width: number; height: number; transparent: boolean; size: number; mimeType?: string }> => {
    try {
      const response = await fetch(`/api/pet/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Ignore network errors and return resilient client defaults
    }

    // Default safe fallback
    return {
      name: "Pixel Companion",
      width: 512,
      height: 512,
      transparent: true,
      size: 50000,
      mimeType: "image/png",
    };
  },
};
