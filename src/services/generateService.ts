/**
 * Service to handle generating AI pets.
 */
export const generateService = {
  generatePet: async (
    prompt: string,
    name?: string
  ): Promise<{ id: string; url: string; success: boolean; method: string }> => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, name }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate companion");
      } catch {
        throw new Error(`Generation failed with status ${response.status}`);
      }
    }

    return response.json();
  },
};
