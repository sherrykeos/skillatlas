"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PublishConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillName: string;
  versionNumber: string;
  onConfirm: () => Promise<void>;
}

export function PublishConfirmDialog({
  open,
  onOpenChange,
  skillName,
  versionNumber,
  onConfirm,
}: PublishConfirmDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setError(null);
    setIsPublishing(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to publish skill.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0F1219] border-[#1E2433]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <CheckCircle2 className="h-5 w-5" />
            <DialogTitle className="text-base font-bold text-[#F8FAFC]">
              Publish Skill &amp; Version v{versionNumber}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#94A3B8]">
            Publishing makes <strong className="text-[#F8FAFC]">{skillName}</strong> publicly discoverable on the marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-[#94A3B8]">
          <div className="p-3 rounded-[8px] bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <span className="font-semibold block text-amber-200">Immutable Release Guarantee</span>
              <p className="text-[11px] leading-relaxed text-amber-300/90">
                Once published, this version’s prompt specification and execution scripts cannot be modified or overwritten. Any future modifications must be tagged as a new semantic release.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-[8px] bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="sm"
            className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            variant="primary"
            size="sm"
            className="text-xs gap-1.5 font-semibold shadow-md shadow-emerald-500/15"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isPublishing ? "Publishing..." : "Confirm & Publish"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
