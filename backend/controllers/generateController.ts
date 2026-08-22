import { Request, Response, NextFunction } from "express";
import { GoogleGenAI } from "@google/genai";
import { generatePetSvg } from "../svgTemplates";
import { saveStoredPet } from "../store";

export const generatePet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { prompt, name } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "A prompt is required to generate a companion." });
    }

    const id = `gen-${Date.now()}`;
    const cleanName = name || prompt.split(" ").slice(0, 2).join(" ") || "Pixel Companion";

    // Check if we have a GEMINI_API_KEY to attempt real Imagen generation
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        console.log(`Attempting AI Image Generation via GoogleGenAI for prompt: "${prompt}"`);
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        // Call the modern Imagen model via generateContent
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: `${prompt}, cute, simple vector art, transparent background, solid colors, soft pastel palette, nintendo style, centered companion character, high resolution`,
          config: {
            imageConfig: {
              aspectRatio: "1:1",
            },
          },
        });

        let imageBufferBase64: string | undefined;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              imageBufferBase64 = part.inlineData.data;
              break;
            }
          }
        }

        if (imageBufferBase64) {
          const buffer = Buffer.from(imageBufferBase64, "base64");
          const dataUrl = `data:image/png;base64,${imageBufferBase64}`;
          
          saveStoredPet(id, {
            id,
            name: cleanName,
            buffer,
            mimeType: "image/png",
            width: 512,
            height: 512,
            transparent: true,
            size: buffer.length,
          });

          return res.status(201).json({
            success: true,
            id,
            url: `/uploads/${id}.png`,
            dataUrl,
            method: "gemini-api",
          });
        }
      } catch (aiError: any) {
        console.error("Gemini Image API failed, falling back to procedural generation:", aiError.message || aiError);
        // Fall through to procedural generation
      }
    }

    // Procedural Vector Generation (Local Fallback & Default Mode)
    console.log(`Generating high-quality procedural companion for prompt: "${prompt}"`);
    const { svg, width, height } = generatePetSvg(prompt);
    const buffer = Buffer.from(svg);
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    saveStoredPet(id, {
      id,
      name: cleanName,
      buffer,
      mimeType: "image/svg+xml",
      width,
      height,
      transparent: true,
      size: buffer.length,
    });

    return res.status(201).json({
      success: true,
      id,
      url: `/uploads/${id}.svg`,
      dataUrl,
      method: "procedural-svg",
    });
  } catch (error) {
    next(error);
  }
};
