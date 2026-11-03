import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  action,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-4 pb-8 border-b border-[#1E2433] mb-8",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-3 max-w-3xl mx-auto">
        {badge && (
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              {badge}
            </span>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
      {children}
    </div>
  );
}
