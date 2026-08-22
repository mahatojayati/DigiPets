import { useState } from "react";
import { uploadService } from "../services/uploadService";

interface UseUploadProps {
  onSuccess: (id: string, url: string) => void;
}

export const useUpload = ({ onSuccess }: UseUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    // Basic Client-side Validation (allow common web image types)
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/gif"];
    const isAllowed = allowedTypes.includes(file.type.toLowerCase()) || file.name.match(/\.(png|jpg|jpeg|webp|svg|gif)$/i);

    if (!isAllowed) {
      setError("Please select an image file (PNG, JPG, WebP, or SVG).");
      return;
    }

    // Max size 15MB
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("The file size exceeds the 15 MB limit. Please choose a smaller image.");
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const response = await uploadService.uploadImage(file, (percent) => {
        setProgress(percent);
      });

      if (response && response.id) {
        onSuccess(response.id, response.url);
      } else {
        throw new Error("Invalid response received from server");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while uploading your companion.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    handleUpload,
    isUploading,
    progress,
    error,
    clearError,
  };
};
