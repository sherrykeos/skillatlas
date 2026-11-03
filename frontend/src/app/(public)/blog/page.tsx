import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Engineering Blog",
  description: "Official updates, architecture notes, and developer guides from the SkillAtlas team.",
};

export default function BlogPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Engineering Blog"
        description="Official updates, architecture notes, and developer guides from the SkillAtlas team."
      />

      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#1E2433] rounded-[10px] bg-[#0F1219]/60 my-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#161B26] border border-[#1E2433] text-emerald-400 mb-4 shadow-sm shadow-emerald-500/10">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">No articles published yet</h3>
        <p className="text-sm text-[#94A3B8] max-w-sm mb-6">
          Official engineering writeups and architecture guides will be published here.
        </p>
        <Button asChild variant="primary" size="sm">
          <Link href="/docs">Read Developer Docs</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
