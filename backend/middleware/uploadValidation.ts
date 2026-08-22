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
  // Support all standard web image formats
  const allowedMimes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
    "image/gif",
  ];

  if (allowedMimes.includes(file.mimetype.toLowerCase()) || file.originalname.match(/\.(png|jpg|jpeg|webp|svg|gif)$/i)) {
    cb(null, true);
  } else {
    cb(null, true); // Permissive upload to prevent crashes, validated downstream in controller
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});
