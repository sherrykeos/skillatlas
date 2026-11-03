"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, BookOpen, Boxes, Tag, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CATEGORIES } from "@/constants/categories";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      onOpenChange(false);
      router.push(`/explore?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  const navigateTo = (href: string) => {
    onOpenChange(false);
    router.push(href);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 border-[#1E2433] bg-[#0F1219] overflow-hidden shadow-2xl">
        <div className="flex items-center border-b border-[#1E2433] px-4 py-3 bg-[#090A0F]/60">
          <Search className="h-4 w-4 text-[#64748B] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search skills, categories, documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-[#1E2433] bg-[#161B26] text-[10px] font-mono text-[#64748B]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[350px] overflow-y-auto p-2 space-y-4">
          {query.trim() ? (
            <div>
              <div className="px-2 py-1 text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                Search Query
              </div>
              <button
                onClick={() => navigateTo(`/explore?search=${encodeURIComponent(query.trim())}`)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-[#161B26] text-left text-sm text-[#F8FAFC] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-emerald-400" />
                  <span>Search marketplace for &quot;<span className="text-emerald-400 font-medium">{query}</span>&quot;</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#64748B] group-hover:text-[#F8FAFC] transition-colors" />
              </button>
            </div>
          ) : (
            <>
              <div>
                <div className="px-2 py-1 text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                  Quick Navigation
                </div>
                <div className="space-y-0.5 mt-1">
                  <button
                    onClick={() => navigateTo("/explore")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#161B26] text-left text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    <Compass className="h-4 w-4 text-emerald-400" />
                    <span>Explore All Skills</span>
                  </button>
                  <button
                    onClick={() => navigateTo("/categories")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#161B26] text-left text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    <Boxes className="h-4 w-4 text-cyan-400" />
                    <span>Browse Categories</span>
                  </button>
                  <button
                    onClick={() => navigateTo("/docs")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#161B26] text-left text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    <BookOpen className="h-4 w-4 text-emerald-300" />
                    <span>Developer Documentation</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="px-2 py-1 text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                  Popular Categories
                </div>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {CATEGORIES.slice(0, 6).map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => navigateTo(`/categories/${cat.slug}`)}
                      className="flex items-center gap-2 px-3 py-2 rounded-[6px] hover:bg-[#161B26] text-left text-xs text-[#94A3B8] hover:text-emerald-400 transition-colors"
                    >
                      <Tag className="h-3 w-3 text-[#64748B]" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-[#1E2433] px-4 py-2 bg-[#090A0F] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Navigate with ↵ Enter</span>
          <span>SkillAtlas Developer Marketplace</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
