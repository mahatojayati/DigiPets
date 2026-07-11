import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Modal } from "../ui/Modal";
import { useGeneratePet } from "../../hooks/useGeneratePet";
import { PromptInput } from "./PromptInput";
import { PromptSuggestions } from "./PromptSuggestions";
import { GenerateLoader } from "./GenerateLoader";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string, url: string, prompt: string) => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [prompt, setPrompt] = useState("");

  const { handleGenerate, isGenerating, error, clearError } = useGeneratePet({
    onSuccess: (id, url) => {
      onSuccess(id, url, prompt);
      setPrompt(""); // reset prompt
    },
  });

  const handleSubmit = () => {
    if (prompt.trim() === "") return;
    handleGenerate(prompt);
  };

  const handleSelectSuggestion = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const handleCancel = () => {
    if (isGenerating) return;
    clearError();
    onClose();
  };

  const modalFooter = !isGenerating ? (
    <>
      <SecondaryButton onClick={handleCancel}>
        Cancel
      </SecondaryButton>
      <PrimaryButton
        onClick={handleSubmit}
        disabled={prompt.trim() === ""}
        color="pink"
        className="gap-2"
      >
        <Sparkles className="w-4 h-4 fill-white/20 animate-pulse" />
        Summon Pet
      </PrimaryButton>
    </>
  ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Summon AI Pet Companion"
      footer={modalFooter}
    >
      {isGenerating ? (
        <GenerateLoader />
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500 leading-relaxed">
            Our magic designer will craft a custom transparent virtual companion. Just type what you want to see!
          </p>

          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
          />

          <PromptSuggestions onSelect={handleSelectSuggestion} />

          {error && (
            <div className="text-xs font-semibold text-[#FF6492] bg-[#FFF0F5] border-2 border-[#FF6492]/20 p-3 rounded-xl mt-2 animate-shake">
              ⚠️ {error}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
