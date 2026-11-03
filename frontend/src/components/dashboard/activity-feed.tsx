import React from "react";
import Link from "next/link";
import { ArrowUpRight, Download, ThumbsUp, GitCommit, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skill } from "@/types/skill";
import { formatDate } from "@/lib/utils";

interface ActivityFeedProps {
  skills: Skill[];
}

export function ActivityFeed({ skills }: ActivityFeedProps) {
  const recentSkills = skills.slice(0, 5);

  return (
    <Card className="border-[#1E2433] bg-[#0F1219] shadow-sm">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>Recent Activity</span>
        </CardTitle>
        <Link
          href="/skills"
          className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
        >
          <span>View all</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        {recentSkills.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#64748B]">
            No recent activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#1E2433]/70">
            {recentSkills.map((skill) => {
              const latestVersion = skill.versions?.[0]?.version || "1.0.0";
              const downloads = skill.downloadCount ?? skill._count?.downloads ?? 0;
              const upvotes = skill.upvoteCount ?? skill._count?.upvotes ?? 0;

              return (
                <div key={skill.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 overflow-hidden">
                    <Link
                      href={`/skills/${skill.slug}`}
                      className="text-xs font-semibold text-[#F8FAFC] hover:text-emerald-400 transition-colors truncate block"
                    >
                      {skill.name}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-mono">
                      <span className="text-emerald-400">v{latestVersion}</span>
                      <span>•</span>
                      <span>{formatDate(skill.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#94A3B8] shrink-0">
                    <div className="flex items-center gap-1" title="Downloads">
                      <Download className="h-3 w-3 text-[#64748B]" />
                      <span>{downloads}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Upvotes">
                      <ThumbsUp className="h-3 w-3 text-[#64748B]" />
                      <span>{upvotes}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
