"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface QuickInstallSnippetProps {
  slug: string;
}

export function QuickInstallSnippet({ slug }: QuickInstallSnippetProps) {
  const [copied, setCopied] = useState(false);
  const command = `npx skillatlas add ${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    toast.success("CLI command copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-[#1E2433] rounded-[10px] bg-[#0F1219] p-4 space-y-2 shadow-sm">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span>Quick Install</span>
        </div>
        <span className="text-emerald-400">CLI</span>
      </div>

      <div className="flex items-center justify-between bg-[#090A0F] border border-[#1E2433] rounded-[6px] px-3 py-2 text-xs font-mono text-[#F8FAFC]">
        <span className="truncate selection:bg-emerald-500 selection:text-[#090A0F]">
          {command}
        </span>
        <button
          onClick={handleCopy}
          className="ml-2 p-1 rounded hover:bg-[#161B26] text-[#64748B] hover:text-emerald-400 transition-colors shrink-0"
          title="Copy command"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
