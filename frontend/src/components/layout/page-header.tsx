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
        "flex flex-col items-center justify-center text-center gap-4 pb-8 border-b border-[#252D28] mb-8",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-3 max-w-3xl mx-auto">
        <div>
          {badge && (
            <span className="px-2 py-0.4 rounded-full text-xs font-mono border border-[#CCD7C5]/30 bg-[#CCD7C5]/10 text-[#CCD7C5]">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-[#d8eacc]">
            {title}
          </h1>


        </div>
        {description && (
          <p className="text-base sm:text-sm text-[#A9B1AA] max-w-2xl mx-auto">
            {description}
          </p>
        )}

      </div>


      {action && <div className="flex items-center justify-center gap-3 shrink-0">{action}</div>}
      {children}
    </div>
  );
}
