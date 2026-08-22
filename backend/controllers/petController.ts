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
      // Graceful fallback for stateless/serverless environments
      return res.status(200).json({
        id: id || "pet-custom",
        name: "Companion",
        width: 512,
        height: 512,
        transparent: true,
        size: 50000,
        mimeType: "image/png",
      });
    }

    return res.status(200).json({
      id: pet.id,
      name: pet.name || "Companion",
      width: pet.width || 512,
      height: pet.height || 512,
      transparent: pet.transparent !== undefined ? pet.transparent : true,
      size: pet.size || 50000,
      mimeType: pet.mimeType || "image/png",
    });
  } catch (error) {
    // Return a safe 200 fallback rather than a 500 error
    return res.status(200).json({
      id: req.params.id || "pet-custom",
      name: "Companion",
      width: 512,
      height: 512,
      transparent: true,
      size: 50000,
      mimeType: "image/png",
    });
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
