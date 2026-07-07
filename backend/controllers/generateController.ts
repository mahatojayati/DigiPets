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
        const ai = new GoogleGenAI({ apiKey });

        // Call the Imagen model
        const response = await ai.models.generateImages({
          model: "imagen-3.0-generate-002",
          prompt: `${prompt}, cute, simple vector art, transparent background, solid colors, soft pastel palette, nintendo style, centered companion character, high resolution`,
          config: {
            numberOfImages: 1,
            outputMimeType: "image/png",
            aspectRatio: "1:1",
          },
        });

        const imageBufferBase64 = response.generatedImages?.[0]?.image?.imageBytes;
        if (imageBufferBase64) {
          const buffer = Buffer.from(imageBufferBase64, "base64");
          
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
      method: "procedural-svg",
    });
  } catch (error) {
    next(error);
  }
};
