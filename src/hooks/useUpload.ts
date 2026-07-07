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
    // Basic Client-side Validation
    if (file.type !== "image/png") {
      setError("Please select a standard PNG image. Other formats are not supported.");
      return;
    }

    // Max size 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("The file size exceeds the 10 MB limit. Please choose a smaller PNG.");
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
