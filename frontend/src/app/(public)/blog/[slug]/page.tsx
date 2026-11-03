import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS } from "@/constants/blog";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <PageContainer maxWidth="narrow">
      <div className="space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 border-b border-[#1E2433] pb-6">
          <Badge variant="brand" className="text-xs">
            {post.tag}
          </Badge>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B] font-mono">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[#F8FAFC]">{post.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{post.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime}</span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-sm text-[#94A3B8] leading-relaxed space-y-4">
          <p className="text-base text-[#F8FAFC] leading-relaxed">
            As autonomous AI agents shift from experimental chatbots to production-grade engineers and researchers, the way we package knowledge and tool integrations must evolve.
          </p>

          <h2 className="text-lg font-bold text-[#F8FAFC] pt-4">
            1. Why Monolithic System Prompts Fail
          </h2>
          <p>
            When complex capabilities are crammed into a single massive system prompt, LLMs suffer from attention dilution, context window exhaustion, and hallucination on tool contracts.
          </p>
          <p>
            SkillAtlas solves this with the <strong className="text-[#F8FAFC]">SKILL.md standard</strong>: a structured directory format containing concise instructions, reference documents, schema definitions, and executable scripts.
          </p>

          <h2 className="text-lg font-bold text-[#F8FAFC] pt-4">
            2. The Anatomy of an Immutable Version
          </h2>
          <p>
            When an agent relies on a skill in production, that skill must not change unpredictably. SkillAtlas enforces semantic version immutability for all published releases:
          </p>
          <pre className="p-4 rounded-[8px] bg-[#090A0F] border border-[#1E2433] text-xs font-mono text-emerald-400 overflow-x-auto">
{`# Pulling a specific immutable release
npx skillatlas add sql-query-optimizer --version 1.2.0`}
          </pre>

          <h2 className="text-lg font-bold text-[#F8FAFC] pt-4">
            3. Summary &amp; Next Steps
          </h2>
          <p>
            Start packaging your own custom agentic skills today on SkillAtlas. Use the interactive creator studio or import directly from any public GitHub repository.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
