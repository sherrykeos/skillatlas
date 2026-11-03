import React from "react";
import { SkillMarkdownView } from "@/components/skill/skill-markdown-view";

interface MarkdownLivePreviewProps {
  content: string;
}

export function MarkdownLivePreview({ content }: MarkdownLivePreviewProps) {
  return (
    <div className="h-full overflow-y-auto p-5 bg-[#0F1219] border-l border-[#1E2433]">
      <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] border-b border-[#1E2433] pb-2 mb-4 flex items-center justify-between">
        <span>Live Markdown Preview</span>
        <span className="text-emerald-400">Renderer v1.2</span>
      </div>
      <SkillMarkdownView content={content || "*No content written yet.*"} />
    </div>
  );
}
