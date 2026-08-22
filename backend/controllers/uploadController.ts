import { Request, Response, NextFunction } from "express";
import { saveStoredPet } from "../store";

/**
 * Parses raw PNG buffers to extract metadata with safe fallbacks.
 */
export function parsePngMetadata(buffer: Buffer) {
  try {
    if (buffer.length < 29) {
      return { width: 512, height: 512, transparent: true, size: buffer.length };
    }

    // Verify PNG signature (89 50 4E 47 0D 0A 1A 0A)
    const signature = buffer.subarray(0, 8);
    const expectedSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (!signature.equals(expectedSig)) {
      return { width: 512, height: 512, transparent: true, size: buffer.length };
    }

    // Parse IHDR chunk
    const chunkType = buffer.toString("ascii", 12, 16);
    if (chunkType !== "IHDR") {
      return { width: 512, height: 512, transparent: true, size: buffer.length };
    }

    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    const colorType = buffer.readUInt8(25);

    // Color types with alpha channels: 4 (Grayscale + alpha), 6 (RGBA)
    let transparent = colorType === 4 || colorType === 6;

    // Scan other chunks for transparency (tRNS chunk) if colorType doesn't inherently include alpha
    if (!transparent) {
      let offset = 33;
      while (offset < buffer.length - 8) {
        try {
          const length = buffer.readUInt32BE(offset);
          const type = buffer.toString("ascii", offset + 4, offset + 8);
          if (type === "tRNS") {
            transparent = true;
            break;
          }
          if (type === "IDAT" || type === "IEND") {
            break;
          }
          offset += 12 + length;
        } catch {
          break;
        }
      }
    }

    return {
      width: width || 512,
      height: height || 512,
      transparent: true,
      size: buffer.length,
    };
  } catch {
    return { width: 512, height: 512, transparent: true, size: buffer.length };
  }
}

export const uploadPetImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const file = req.file;
    const metadata = parsePngMetadata(file.buffer);

    const id = `upload-${Date.now()}`;
    const mimeType = file.mimetype || "image/png";
    const extension = mimeType.includes("svg") ? "svg" : mimeType.includes("webp") ? "webp" : mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : "png";
    const url = `/uploads/${id}.${extension}`;
    const dataUrl = `data:${mimeType};base64,${file.buffer.toString("base64")}`;

    // Save in our active session store
    saveStoredPet(id, {
      id,
      name: file.originalname.replace(/\.[^/.]+$/, ""), // Strip extension
      buffer: file.buffer,
      mimeType,
      width: metadata.width,
      height: metadata.height,
      transparent: metadata.transparent,
      size: metadata.size,
    });

    return res.status(201).json({
      success: true,
      id,
      url,
      dataUrl,
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    next(error);
  }
};
