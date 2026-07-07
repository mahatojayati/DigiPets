import { Request, Response, NextFunction } from "express";
import { saveStoredPet } from "../store";

/**
 * Parses raw PNG buffers to extract metadata.
 */
export function parsePngMetadata(buffer: Buffer) {
  if (buffer.length < 29) {
    throw new Error("Corrupted or invalid PNG file: Too small.");
  }

  // Verify PNG signature (89 50 4E 47 0D 0A 1A 0A)
  const signature = buffer.subarray(0, 8);
  const expectedSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!signature.equals(expectedSig)) {
    throw new Error("Invalid file signature. Only standard PNG files are supported.");
  }

  // Parse IHDR chunk
  const chunkType = buffer.toString("ascii", 12, 16);
  if (chunkType !== "IHDR") {
    throw new Error("Corrupted PNG structure: Missing IHDR header.");
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const colorType = buffer.readUInt8(25);

  // Color types with alpha channels: 4 (Grayscale + alpha), 6 (RGBA)
  let transparent = colorType === 4 || colorType === 6;

  // Scan other chunks for transparency (tRNS chunk) if colorType doesn't inherently include alpha
  if (!transparent) {
    let offset = 33; // End of IHDR chunk (IHDR length=13 + 4 length + 4 type + 4 CRC)
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
        offset += 12 + length; // 4 length + 4 type + length + 4 CRC
      } catch {
        break;
      }
    }
  }

  return {
    width,
    height,
    transparent,
    size: buffer.length,
  };
}

export const uploadPetImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PNG file uploaded." });
    }

    const file = req.file;
    let metadata;
    try {
      metadata = parsePngMetadata(file.buffer);
    } catch (e: any) {
      return res.status(422).json({ error: e.message || "Could not parse or validate PNG image." });
    }

    const id = `upload-${Date.now()}`;
    const url = `/uploads/${id}.png`;

    // Save in our active session store
    saveStoredPet(id, {
      id,
      name: file.originalname.replace(/\.[^/.]+$/, ""), // Strip extension
      buffer: file.buffer,
      mimeType: "image/png",
      width: metadata.width,
      height: metadata.height,
      transparent: metadata.transparent,
      size: metadata.size,
    });

    return res.status(201).json({
      success: true,
      id,
      url,
    });
  } catch (error) {
    next(error);
  }
};
