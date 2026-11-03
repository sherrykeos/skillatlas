"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Boxes,
  Code2,
  Compass,
  Zap,
  BarChart3,
  Palette,
  Cpu,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  PenTool,
  Terminal,
  Megaphone,
  Layers,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { CATEGORIES } from "@/constants/categories";
import { marketplaceApi, CategoryWithCount } from "@/lib/api/marketplace";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP: Record<string, React.ElementType> = {
  development: Code2,
  research: Compass,
  productivity: Zap,
  "data-analysis": BarChart3,
  design: Palette,
  automation: Cpu,
  business: Briefcase,
  education: GraduationCap,
  security: ShieldCheck,
  writing: PenTool,
  devops: Terminal,
  marketing: Megaphone,
  other: Layers,
};

export default function CategoriesPage() {
  const { data: dbCategories, isLoading } = useQuery({
    queryKey: ["marketplace-categories"],
    queryFn: () => marketplaceApi.getCategories(),
  });

  const categories = (dbCategories && dbCategories.length > 0)
    ? dbCategories
    : CATEGORIES.map((c) => ({
        id: c.slug,
        name: c.name,
        slug: c.slug,
        description: c.description,
        _count: { Skills: 0 },
      }));

  return (
    <PageContainer>
      <PageHeader
        title="Skill Categories"
        description="Browse agentic skills organized by domain, capability, and execution layer."
        badge={`${categories.length} Categories`}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-[10px] border border-[#1E2433] bg-[#0F1219] space-y-4"
            >
              <Skeleton className="h-10 w-10 rounded-[8px]" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.slug] || Boxes;
            const skillCount = cat._count?.Skills ?? 0;

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group p-6 rounded-[10px] border border-[#1E2433] bg-[#0F1219] hover:border-emerald-500/40 hover:bg-[#161B26] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-[8px] border border-[#1E2433] bg-[#161B26] flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-500/40 transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono text-[#64748B] group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                      {cat.description || "Specialized agentic capabilities and tools."}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1E2433] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                  <span>Domain: {cat.slug}</span>
                  <span className="text-emerald-400 font-semibold">
                    {skillCount} {skillCount === 1 ? "skill" : "skills"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
