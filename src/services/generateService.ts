import { generatePetSvg } from "../lib/svgTemplates";

/**
 * Service to handle generating AI pets with seamless client-side procedural fallback.
 */
export const generateService = {
  generatePet: async (
    prompt: string,
    name?: string
  ): Promise<{ id: string; url: string; success: boolean; method: string }> => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, name }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch {
      // Ignore network errors and use procedural client generator
    }

    // Client-side instant procedural fallback
    const id = `gen-${Date.now()}`;
    const cleanName = name || prompt.split(" ").slice(0, 2).join(" ") || "Pixel Companion";
    const { dataUrl } = generatePetSvg(prompt);

    return {
      id,
      url: dataUrl,
      success: true,
      method: "client-procedural-svg",
    };
  },
};
