import React from "react";
import { FolderSearch, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#1E2433] rounded-[10px] bg-[#0F1219]/60 my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#161B26] border border-[#1E2433] text-emerald-400 mb-4 shadow-sm shadow-emerald-500/10">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">{title}</h3>
      <p className="text-sm text-[#94A3B8] max-w-sm mb-6">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Button asChild variant="primary" size="sm">
            <a href={actionHref}>{actionLabel}</a>
          </Button>
        ) : (
          <Button onClick={onAction} variant="primary" size="sm">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
