import multer from "multer";
import { Request } from "express";

// Set up memory storage so we don't pollute the container filesystem and can compute metadata easily
const storage = multer.memoryStorage();

// Maximum 10 MB in bytes
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Reject files that are not PNG
  if (file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only transparent PNG files are supported!") as any, false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});
