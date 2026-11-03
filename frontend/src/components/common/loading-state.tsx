import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "min-h-[250px]",
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Loader2 className="h-7 w-7 text-emerald-400 animate-spin mb-3" />
      <p className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">{message}</p>
    </div>
  );
}
