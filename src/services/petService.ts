/**
 * Service to handle retrieving pet metadata.
 */
export const petService = {
  getPetMetadata: async (
    id: string
  ): Promise<{ name: string; width: number; height: number; transparent: boolean; size: number; mimeType?: string }> => {
    const response = await fetch(`/api/pet/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch pet metadata with status ${response.status}`);
    }

    return response.json();
  },
};
