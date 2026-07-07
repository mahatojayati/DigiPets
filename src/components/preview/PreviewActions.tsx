import React from "react";
import { Check, ArrowLeft } from "lucide-react";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface PreviewActionsProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
}

export const PreviewActions: React.FC<PreviewActionsProps> = ({
  onConfirm,
  onCancel,
  confirmDisabled = false,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 mt-6 select-none">
      <SecondaryButton
        onClick={onCancel}
        className="flex-1 justify-center py-3 gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel & Back
      </SecondaryButton>

      <PrimaryButton
        onClick={onConfirm}
        disabled={confirmDisabled}
        colorTheme="pink"
        className="flex-1 justify-center py-3 gap-1.5 shadow-md"
      >
        <Check className="w-4.5 h-4.5" />
        Use This Pet
      </PrimaryButton>
    </div>
  );
};
