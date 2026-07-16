import { Personality, EmotionState, PetMemoryEvent } from "../types/petAI";

export interface ChatRequest {
  message: string;
  petName: string;
  personality?: Personality;
  emotions?: EmotionState;
  recentMemories?: PetMemoryEvent[];
  relationshipLevel?: string;
}

export async function chatWithAI(request: ChatRequest): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || `*looks at you happily*`;
  } catch (error) {
    console.error("AI chat failed, falling back to local action:", error);
    return `*happily boops you*`;
  }
}
