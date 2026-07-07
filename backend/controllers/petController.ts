import { Request, Response, NextFunction } from "express";
import { getStoredPet } from "../store";

export const getPetMetadata = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const pet = getStoredPet(id);

    if (!pet) {
      return res.status(404).json({ error: "Pet companion not found." });
    }

    return res.status(200).json({
      id: pet.id,
      name: pet.name,
      width: pet.width,
      height: pet.height,
      transparent: pet.transparent,
      size: pet.size,
      mimeType: pet.mimeType,
    });
  } catch (error) {
    next(error);
  }
};

export const servePetImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    // Strip file extension to get the store ID
    const id = filename.replace(/\.[^/.]+$/, "");
    const pet = getStoredPet(id);

    if (!pet) {
      return res.status(404).send("Image not found");
    }

    res.setHeader("Content-Type", pet.mimeType);
    res.setHeader("Content-Length", pet.buffer.length);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache nicely
    return res.send(pet.buffer);
  } catch (error) {
    next(error);
  }
};
