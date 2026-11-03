"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("SkillAtlas Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090A0F] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md border border-rose-500/30 rounded-[12px] bg-[#0F1219] p-8 space-y-6 shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-[#F8FAFC]">Application Error</h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            An unexpected error occurred in the client application.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-[8px] bg-[#090A0F] border border-[#1E2433] text-xs font-mono text-rose-300 text-left overflow-x-auto">
            {error.message}
          </div>
        )}

        <Button onClick={() => reset()} variant="primary" size="sm" className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>Reload Interface</span>
        </Button>
      </div>
    </div>
  );
}
