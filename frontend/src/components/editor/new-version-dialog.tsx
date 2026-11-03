"use client";

import React, { useState } from "react";
import { GitBranch, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NewVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latestVersion?: string;
  onConfirm: (version: string, changelog: string) => Promise<void>;
}

export function NewVersionDialog({
  open,
  onOpenChange,
  latestVersion = "1.0.0",
  onConfirm,
}: NewVersionDialogProps) {
  // Suggest next minor semver (e.g. 1.0.0 -> 1.1.0)
  const parts = latestVersion.split(".").map(Number);
  const suggestedVersion = `${parts[0] || 1}.${(parts[1] || 0) + 1}.0`;

  const [version, setVersion] = useState(suggestedVersion);
  const [changelog, setChangelog] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(version.trim())) {
      setError("Version must follow semantic versioning (e.g., 1.1.0 or 2.0.0).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(version.trim(), changelog.trim());
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to create new version.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#0F1219] border-[#1E2433]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <GitBranch className="h-5 w-5" />
            <DialogTitle className="text-base font-bold text-[#F8FAFC]">
              Create New Version Release
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#94A3B8]">
            Create a new semantic release draft copying all files from the current version.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="p-2.5 rounded-[8px] bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">Semantic Version</label>
            <Input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.1.0"
              required
              className="text-xs font-mono"
            />
            <p className="text-[10px] text-[#64748B]">Current active version: v{latestVersion}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">Release Changelog</label>
            <Textarea
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              placeholder="Document improvements, prompt changes, or bug fixes..."
              className="min-h-[90px] text-xs font-mono"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              size="sm"
              className="font-semibold shadow-md shadow-emerald-500/15"
            >
              {isSubmitting ? "Creating..." : "Create Release Draft"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
