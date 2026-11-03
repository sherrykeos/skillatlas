"use client";

import React from "react";
import Link from "next/link";
import { Download, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skill } from "@/types/skill";
import { formatNumber } from "@/lib/utils";

interface DownloadsChartProps {
  skills?: Skill[];
}

export function DownloadsChart({ skills = [] }: DownloadsChartProps) {
  const publishedSkills = skills.filter((s) => s.status === "PUBLISHED");
  const totalDownloads = skills.reduce(
    (acc, s) => acc + (s.downloadCount ?? s._count?.downloads ?? 0),
    0
  );

  const skillsWithDownloads = [...skills].sort(
    (a, b) =>
      (b.downloadCount ?? b._count?.downloads ?? 0) -
      (a.downloadCount ?? a._count?.downloads ?? 0)
  );

  const maxDownloads = Math.max(
    ...skillsWithDownloads.map((s) => s.downloadCount ?? s._count?.downloads ?? 0),
    1
  );

  return (
    <Card className="border-[#1E2433] bg-[#0F1219] shadow-sm">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Package Installations</span>
          </CardTitle>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real download metrics queried from database
          </p>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold font-mono text-emerald-400">
            {formatNumber(totalDownloads)}
          </span>
          <span className="text-[11px] text-[#64748B] block font-mono">Total Installs</span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-4">
        {skills.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            No skills created yet. Publish a skill to track its installations.
          </div>
        ) : totalDownloads === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Package className="h-8 w-8 text-[#64748B] mx-auto opacity-50" />
            <p className="text-xs text-[#94A3B8]">0 installations recorded so far.</p>
            <p className="text-[11px] text-[#64748B]">
              Share your skill command to let developers install it via CLI.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {skillsWithDownloads.slice(0, 6).map((skill) => {
              const count = skill.downloadCount ?? skill._count?.downloads ?? 0;
              const percentage = Math.round((count / maxDownloads) * 100);

              return (
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <Link
                      href={`/skills/${skill.slug}`}
                      className="font-mono text-[#F8FAFC] hover:text-emerald-400 transition-colors truncate max-w-[240px]"
                    >
                      {skill.name}
                    </Link>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {formatNumber(count)} {count === 1 ? "install" : "installs"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#161B26] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
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
