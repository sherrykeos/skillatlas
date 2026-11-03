import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SkillMarkdownViewProps {
  content: string;
}

export function SkillMarkdownView({ content }: SkillMarkdownViewProps) {
  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#0F1219] prose-pre:border prose-pre:border-[#1E2433] prose-headings:text-[#F8FAFC] prose-a:text-emerald-400 prose-strong:text-[#F8FAFC] prose-code:text-emerald-300 prose-code:bg-[#161B26] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none leading-relaxed text-sm text-[#94A3B8]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] border-b border-[#1E2433] pb-2 mt-6 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[#F8FAFC] border-b border-[#1E2433] pb-1.5 mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-[#F8FAFC] mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="my-3 text-sm text-[#94A3B8] leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="my-3 pl-5 list-disc space-y-1 text-sm text-[#94A3B8]">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 pl-5 list-decimal space-y-1 text-sm text-[#94A3B8]">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-emerald-500 bg-[#161B26]/40 pl-4 py-1 my-3 text-sm italic text-[#94A3B8]">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-[#1E2433] rounded-[6px]">
              <table className="w-full text-left text-xs border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#161B26] border-b border-[#1E2433] text-[#F8FAFC]">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-[#1E2433]">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-[#161B26]/40 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="p-3 font-semibold">{children}</th>,
          td: ({ children }) => <td className="p-3 text-[#94A3B8]">{children}</td>,
          pre: ({ children }) => (
            <pre className="p-4 rounded-[8px] bg-[#090A0F] border border-[#1E2433] font-mono text-xs overflow-x-auto my-4 text-[#F8FAFC]">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
