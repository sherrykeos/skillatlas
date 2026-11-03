import React from "react";
import { Boxes, Download, ThumbsUp, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface CreatorStatsGridProps {
  publishedCount: number;
  draftCount?: number;
  totalDownloads: number;
  totalUpvotes: number;
}

export function CreatorStatsGrid({
  publishedCount,
  draftCount = 0,
  totalDownloads,
  totalUpvotes,
}: CreatorStatsGridProps) {
  const stats = [
    {
      title: "Published Skills",
      value: publishedCount.toString(),
      icon: Boxes,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    {
      title: "Draft Skills",
      value: draftCount.toString(),
      icon: FileText,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
    {
      title: "Total Downloads",
      value: formatNumber(totalDownloads),
      icon: Download,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
    },
    {
      title: "Total Upvotes",
      value: formatNumber(totalUpvotes),
      icon: ThumbsUp,
      color: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className="p-5 border-[#1E2433] bg-[#0F1219] shadow-sm hover:border-[#2E384D] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#94A3B8]">{item.title}</span>
              <div className={`p-2 rounded-[8px] border ${item.bg} ${item.border} ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-mono text-[#F8FAFC]">{item.value}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
