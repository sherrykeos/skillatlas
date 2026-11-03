import React from "react";
import { GitCommit, Calendar, FileCode, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SkillVersion } from "@/types/skill";
import { formatDate } from "@/lib/utils";

interface SkillVersionListProps {
  versions: SkillVersion[];
}

export function SkillVersionList({ versions }: SkillVersionListProps) {
  if (!versions || versions.length === 0) {
    return (
      <div className="p-8 text-center border border-[#1E2433] rounded-[10px] bg-[#0F1219] text-[#94A3B8] text-sm shadow-sm">
        No version history recorded for this skill.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((v, index) => (
        <div
          key={v.id || v.version}
          className="border border-[#1E2433] rounded-[10px] bg-[#0F1219] p-5 transition-all duration-150 hover:border-emerald-500/30 space-y-3 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#F8FAFC]">
                <GitCommit className="h-4 w-4 text-emerald-400" />
                <span>v{v.version}</span>
              </div>
              {index === 0 && (
                <Badge variant="brand" className="text-[10px] px-2 py-0.2">
                  Latest
                </Badge>
              )}
              {v.publishedAt ? (
                <Badge variant="success" className="text-[10px] gap-1 px-2">
                  <CheckCircle2 className="h-3 w-3" />
                  Published (Immutable)
                </Badge>
              ) : (
                <Badge variant="warning" className="text-[10px]">
                  Draft
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-[#64748B] font-mono">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(v.publishedAt || v.createdAt)}</span>
              </div>
              {v.files && (
                <div className="flex items-center gap-1">
                  <FileCode className="h-3.5 w-3.5" />
                  <span>{v.files.length} files</span>
                </div>
              )}
            </div>
          </div>

          {v.changelog ? (
            <div className="text-xs text-[#94A3B8] bg-[#161B26] border border-[#1E2433] rounded-[6px] p-3 font-mono leading-relaxed whitespace-pre-wrap">
              {v.changelog}
            </div>
          ) : (
            <p className="text-xs text-[#64748B] italic">
              No changelog notes provided for this release.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
