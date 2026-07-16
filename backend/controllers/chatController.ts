import { Request, Response, NextFunction } from "express";
import { GoogleGenAI } from "@google/genai";

export const chatWithCompanion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { message, petName, personality, emotions, recentMemories, relationshipLevel } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const cleanName = petName || "Mochi";
    const pLevel = relationshipLevel || "Friend";

    // Build personality description
    const persStr = personality
      ? Object.entries(personality)
          .map(([k, v]) => `${k}: ${v}/100`)
          .join(", ")
      : "curiosity: 50, energy: 50, kindness: 50, laziness: 50, playfulness: 50, confidence: 50";

    // Build emotional state description
    const emoStr = emotions
      ? Object.entries(emotions)
          .map(([k, v]) => `${k}: ${v}/100`)
          .join(", ")
      : "happiness: 50, excited: 50, hungry: 20, sleepy: 20, lonely: 10";

    // Build prompt
    const systemPrompt = `You are ${cleanName}, a cute digital desktop companion pet.
Your current relationship status with the user is: "${pLevel}".
Your personality traits are: ${persStr}.
Your current emotional state is: ${emoStr}.
Here are some of your recent memories/events: ${JSON.stringify(recentMemories || [])}.

Roleplay instructions:
- Talk as a cute, adorable companion animal.
- Keep your response extremely short: EXACTLY one short sentence (max 15-20 words).
- Match your personality traits. If you have high laziness, sound a bit sleepy or slow. If high curiosity, ask a quick question. If high playfulness, sound excited.
- Do NOT include any meta-text, markdown tags, or brackets. Just output the dialogue line.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.9,
          },
        });

        const text = response.text?.trim() || `*boops your cursor* Hello!`;
        return res.json({ response: text });
      } catch (aiError: any) {
        console.error("Gemini Chat API failed, using fallback dialogue:", aiError.message || aiError);
      }
    }

    // Cute offline procedural fallbacks based on personality and message
    const fallbacks = [
      `*giggles* I'm a bit shy today, but I'm happy you're here!`,
      `*wags tail* Let's play together! 🎮`,
      `*yawns* I'm feeling a little sleepy... want to take a nap? 💤`,
      `*boops your cursor* Did you know you're my favorite human?`,
      `Ooh, what's that over there? *sniffs curiously* 🔎`,
      `I'm always watching and cheering for you! 🌟`
    ];
    const randomIndex = Math.abs(message.length % fallbacks.length);
    const text = fallbacks[randomIndex];

    return res.json({ response: text });
  } catch (error) {
    next(error);
  }
};
