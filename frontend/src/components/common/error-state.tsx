import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An unexpected error occurred while communicating with the server.",
  onRetry,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  const handleAction = onAction || onRetry;
  const label = actionLabel || "Try Again";

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-rose-500/20 bg-rose-500/5 rounded-[10px] my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-4 shadow-sm shadow-rose-500/10">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">{title}</h3>
      <p className="text-sm text-[#94A3B8] max-w-sm mb-6">{message}</p>
      {handleAction && (
        <Button onClick={handleAction} variant="secondary" size="sm" className="gap-2">
          {!actionLabel && <RotateCcw className="h-4 w-4" />}
          {label}
        </Button>
      )}
    </div>
  );
}
