"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showKbd?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, showKbd = true, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 h-4 w-4 text-[#64748B] pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          className={cn(
            "flex h-9 w-full rounded-[8px] border border-[#1E2433] bg-[#0F1219] pl-9 pr-14 py-1 text-sm text-[#F8FAFC] placeholder:text-[#64748B] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500/60 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-0.5 text-[#64748B] hover:text-[#F8FAFC] transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : showKbd ? (
          <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-[#1E2433] bg-[#161B26] text-[10px] font-mono text-[#64748B]">
            <span>⌘</span>
            <span>K</span>
          </div>
        ) : null}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
