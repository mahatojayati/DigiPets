import { useState } from "react";
import { generateService } from "../services/generateService";

interface UseGeneratePetProps {
  onSuccess: (id: string, url: string) => void;
}

export const useGeneratePet = ({ onSuccess }: UseGeneratePetProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string, name?: string) => {
    if (!prompt || prompt.trim() === "") {
      setError("Please provide a prompt description to summon your companion.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateService.generatePet(prompt.trim(), name);
      if (response && response.id) {
        onSuccess(response.id, response.url);
      } else {
        throw new Error("Unable to create pet metadata");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong during generation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearError = () => setError(null);

  return {
    handleGenerate,
    isGenerating,
    error,
    clearError,
  };
};
