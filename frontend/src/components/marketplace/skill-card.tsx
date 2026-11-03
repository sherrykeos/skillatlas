"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, ThumbsUp, Bookmark, Code2, Sparkles, MessageSquare, ShieldCheck, Copy, Check, Terminal } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skill } from "@/types/skill";
import { formatNumber, formatDate, getInitials } from "@/lib/utils";
import { engagementApi } from "@/lib/api/engagement";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

interface SkillCardProps {
  skill: Skill;
  onSaveToggle?: (skillId: string, isSaved: boolean) => void;
}

export function SkillCard({ skill, onSaveToggle }: SkillCardProps) {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(skill.hasSaved || false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to save skills to your library.");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await engagementApi.unsaveSkill(skill.id);
        setIsSaved(false);
        onSaveToggle?.(skill.id, false);
        toast.success("Skill removed from saved library.");
      } else {
        await engagementApi.saveSkill(skill.id);
        setIsSaved(true);
        onSaveToggle?.(skill.id, true);
        toast.success("Skill saved to your library.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update saved skill.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyInstall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cmd = `npx skillatlas add ${skill.slug}`;
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    toast.success(`Copied "${cmd}"`);
    setTimeout(() => setCopied(false), 2000);
  };

  const latestVersion = skill.versions?.[0]?.version || "1.0.0";
  const downloads = skill.downloadCount ?? skill._count?.downloads ?? 0;
  const upvotes = skill.upvoteCount ?? skill._count?.upvotes ?? 0;
  const reviews = skill.reviewCount ?? skill._count?.reviews ?? 0;

  return (
    <Card className="group relative flex flex-col justify-between border-[#1E2433] bg-[#0F1219] hover:border-emerald-500/40 hover:bg-[#131722] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
      <Link href={`/skills/${skill.slug}`} className="block">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Category Icon Badge */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#1E2433] bg-[#161B26] text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500/40 transition-all">
              <Code2 className="h-5 w-5" />
            </div>

            {/* Top Action Pills (Copy install & Bookmark) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyInstall}
                aria-label="Copy CLI install command"
                title="Copy install command"
                className="p-2 rounded-[6px] border border-[#1E2433] bg-[#090A0F] text-[#64748B] hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Terminal className="h-3.5 w-3.5" />}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                aria-label={isSaved ? "Remove from saved" : "Save skill"}
                className={`p-2 rounded-[6px] border transition-colors ${
                  isSaved
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
                    : "bg-[#090A0F] text-[#64748B] border-[#1E2433] hover:text-[#F8FAFC] hover:border-emerald-500/30"
                }`}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-current text-emerald-400" : ""}`} />
              </button>
            </div>
          </div>

          {/* Skill Title & Author */}
          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-emerald-400 transition-colors line-clamp-1">
                {skill.name}
              </h3>
              <span title="AST Audited & Verified">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              </span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
              {skill.author ? (
                <>
                  <Avatar className="h-4 w-4 border border-[#1E2433] bg-[#161B26]">
                    <AvatarImage src={skill.author.avatar || undefined} alt={skill.author.username} />
                    <AvatarFallback className="text-[8px] text-emerald-400 font-mono">{getInitials(skill.author.username)}</AvatarFallback>
                  </Avatar>
                  <span className="font-mono text-[11px]">by <span className="text-[#F8FAFC] font-medium">@{skill.author.username}</span></span>
                </>
              ) : (
                <span className="font-mono text-[11px]">by <span className="text-[#F8FAFC]">@skillatlas</span></span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 pb-3">
          {/* Description */}
          <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed mb-3">
            {skill.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {skill.category && (
              <Badge variant="brand" className="text-[10px] px-2 py-0.5 font-mono">
                {skill.category.name}
              </Badge>
            )}
            {skill.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag.id || tag.name} variant="outline" className="text-[10px] px-2 py-0.5 font-mono">
                #{tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-5 pt-3 border-t border-[#1E2433] flex items-center justify-between text-xs text-[#64748B] font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 hover:text-emerald-400 transition-colors" title={`${downloads} downloads`}>
            <Download className="h-3.5 w-3.5 text-[#64748B]" />
            <span>{formatNumber(downloads)}</span>
          </div>

          <div className="flex items-center gap-1 hover:text-emerald-400 transition-colors" title={`${upvotes} upvotes`}>
            <ThumbsUp className="h-3.5 w-3.5 text-[#64748B]" />
            <span>{formatNumber(upvotes)}</span>
          </div>

          {reviews > 0 && (
            <div className="flex items-center gap-1 hover:text-emerald-400 transition-colors" title={`${reviews} reviews`}>
              <MessageSquare className="h-3.5 w-3.5 text-[#64748B]" />
              <span>{reviews}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#161B26] border border-[#1E2433] text-[10px] text-[#94A3B8]">
            v{latestVersion}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
