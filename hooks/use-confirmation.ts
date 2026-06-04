// hooks/use-confirmation.ts
import { createElement, useState } from "react";
import ActionConfirmation from "@/components/ui/action-confirmation";

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
}

export function useConfirmation() {
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = (opts: ConfirmationOptions) => {
    setOptions(opts);
  };

  const handleConfirm = async () => {
    if (!options) return;
    setIsLoading(true);
    try {
      await options.onConfirm();
    } finally {
      setIsLoading(false);
      setOptions(null);
    }
  };

  const handleCancel = () => {
    setOptions(null);
  };

  const ConfirmationDialog = () => {
    if (!options) return null;

    return createElement(ActionConfirmation, {
      open: true,
      onOpenChange: (open: boolean) => !open && handleCancel(),
      title: options.title,
      description: options.description,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      variant: options.variant,
      onConfirm: handleConfirm,
    });
  };

  return { confirm, ConfirmationDialog };
}
