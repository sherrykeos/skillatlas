"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Code2,
  Terminal,
  ShieldCheck,
  GitBranch,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "overview", label: "Overview & Vision", icon: BookOpen },
  { id: "quickstart", label: "Quickstart (CLI)", icon: Terminal },
  { id: "skill-format", label: "SKILL.md Specification", icon: Code2 },
  { id: "multifile", label: "Multi-File Packages", icon: Layers },
  { id: "immutability", label: "Immutability & Signing", icon: ShieldCheck },
  { id: "github-sync", label: "GitHub Repository Sync", icon: GitBranch },
  { id: "versioning", label: "Semantic Versioning", icon: Sparkles },
  { id: "api-reference", label: "API & SDK Reference", icon: ExternalLink },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <PageContainer>
      <PageHeader
        title="SkillAtlas Specification &amp; Docs"
        description="Comprehensive developer guide to authoring, signing, versioning, and deploying agentic capabilities."
        badge="RFC-9422 Spec"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Table of Contents */}
        <div className="lg:col-span-3 border border-[#1E2433] rounded-[10px] bg-[#0F1219] p-3 space-y-1 sticky top-20 shadow-xl">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
            Table of Contents
          </div>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs text-left transition-colors font-mono ${
                  isActive
                    ? "bg-[#161B26] text-emerald-400 border border-[#1E2433] font-semibold"
                    : "text-[#94A3B8] hover:bg-[#161B26]/60 hover:text-[#F8FAFC]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-emerald-400" : "text-[#64748B]"}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Main Content */}
        <div className="lg:col-span-9 border border-[#1E2433] rounded-[10px] bg-[#0F1219] p-6 sm:p-8 space-y-8 text-sm text-[#94A3B8] leading-relaxed shadow-xl">
          {/* Section 1: Overview */}
          <section id="overview" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight border-b border-[#1E2433] pb-3">
              Overview &amp; Architecture
            </h2>
            <p>
              SkillAtlas is an open, standardized registry and package format for AI agent capabilities. Much like npm transformed JavaScript and Docker standardized container runtimes, SkillAtlas standardizes how autonomous agents discover, inspect, and run external skills.
            </p>
            <p>
              Every skill published to the registry is immutable, cryptographically hash-verified, and statically audited for prompt injection vectors and key leaks before distribution.
            </p>
            <div className="p-4 rounded-[8px] bg-[#090A0F] border border-[#1E2433] text-xs font-mono text-emerald-400">
              Core Principles: Zero Hallucination • Immutability by Default • Multi-Runtime Interoperability
            </div>
          </section>

          {/* Section 2: Quickstart */}
          <section id="quickstart" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight border-b border-[#1E2433] pb-3">
              Quickstart (CLI Installation)
            </h2>
            <p>
              You can pull any public skill directly into your local agent workspace or repository using our zero-install npx runner:
            </p>
            <pre className="p-4 rounded-[8px] bg-[#090A0F] border border-[#1E2433] text-xs font-mono text-emerald-400 overflow-x-auto">
{`# Install into Claude Code, Antigravity, or Cursor
npx skillatlas add @developer/react-reviewer

# Install a specific semantic version
npx skillatlas add @developer/react-reviewer@1.2.0`}
            </pre>
          </section>

          {/* Section 3: SKILL.md Specification */}
          <section id="skill-format" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight border-b border-[#1E2433] pb-3">
              SKILL.md Specification Format
            </h2>
            <p>
              The core of every skill is the <code className="text-emerald-400 bg-[#161B26] px-1.5 py-0.5 rounded font-mono">SKILL.md</code> file. It begins with strict YAML frontmatter followed by structured markdown execution instructions:
            </p>
            <pre className="p-4 rounded-[8px] bg-[#090A0F] border border-[#1E2433] text-xs font-mono text-[#F8FAFC] overflow-x-auto leading-relaxed">
{`---
name: react-reviewer
description: Automated AST static analysis and hook audit
tools: ["read_file", "run_ast"]
---

# React Component Reviewer

When analyzing React codebases, follow these strict execution guidelines:
1. Parse the component tree for unnecessary top-level hooks.
2. Flag missing dependency references in useEffect / useMemo.
3. Suggest semantic HTML tags and ARIA labels for accessible components.`}
            </pre>
          </section>

          {/* Section 4: Multi-File Packages */}
          <section id="multifile" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight border-b border-[#1E2433] pb-3">
              Multi-File Packages
            </h2>
            <p>
              In addition to <code className="text-emerald-400 font-mono">SKILL.md</code>, skills can bundle auxiliary scripts, Python parsers, reference documents, or TypeScript utilities:
            </p>
            <pre className="p-4 rounded-[8px] bg-[#090A0F] border border-[#1E2433] text-xs font-mono text-[#94A3B8] overflow-x-auto">
{`my-skill/
├── SKILL.md            # Primary prompt contract & tools manifest
├── scripts/
│   └── ast_checker.py  # Sandboxed execution script
└── references/
    └── rules.json      # Structured rule dictionary`}
            </pre>
          </section>

          {/* Section 5: Immutability */}
          <section id="immutability" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight border-b border-[#1E2433] pb-3">
              Immutability &amp; Safety Guarantees
            </h2>
            <p>
              To protect autonomous agents from runtime supply-chain attacks or unexpected prompt drift, SkillAtlas enforces strict immutability:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong className="text-[#F8FAFC]">Immutable Versions:</strong> Once a version is marked <code className="text-emerald-400 font-mono">PUBLISHED</code>, its content can never be modified or overwritten.</li>
              <li><strong className="text-[#F8FAFC]">Content Hash Verification:</strong> Every version has a computed SHA-256 integrity hash.</li>
              <li><strong className="text-[#F8FAFC]">Validation Guard:</strong> A non-empty <code className="text-emerald-400 font-mono">SKILL.md</code> is strictly required.</li>
            </ul>
          </section>

          {/* Section 6: GitHub Sync */}
          <section id="github-sync" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight border-b border-[#1E2433] pb-3">
              GitHub Repository Sync
            </h2>
            <p>
              Creators can import skills directly from public GitHub repositories using the <strong>GitHub Import Wizard</strong>.
            </p>
            <p>
              Our 4-step wizard connects to the public GitHub API, allows you to select up to 50 files (requiring <code className="text-emerald-400 font-mono">SKILL.md</code>), configures metadata, and provisions a new editable draft.
            </p>
          </section>

          {/* Section 7: Versioning */}
          <section id="versioning" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight border-b border-[#1E2433] pb-3">
              Semantic Versioning
            </h2>
            <p>
              All skills follow strict semantic versioning (<code className="text-emerald-400 font-mono">MAJOR.MINOR.PATCH</code>). When publishing revisions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>MAJOR (1.0.0 → 2.0.0):</strong> Breaking changes to instructions, prompt interfaces, or required tools.</li>
              <li><strong>MINOR (1.0.0 → 1.1.0):</strong> New features, additional scripts, or extended instructions.</li>
              <li><strong>PATCH (1.0.0 → 1.0.1):</strong> Prompt clarifications, typo fixes, or minor formatting edits.</li>
            </ul>
          </section>

          {/* Section 8: API Reference */}
          <section id="api-reference" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight border-b border-[#1E2433] pb-3">
              API Reference
            </h2>
            <p>
              SkillAtlas exposes a public RESTful API for programmatically discovering and retrieving skill bundles:
            </p>
            <pre className="p-4 rounded-[8px] bg-[#090A0F] border border-[#1E2433] text-xs font-mono text-emerald-400 overflow-x-auto">
{`GET /api/marketplace/skills?category=development&sort=popular
GET /api/marketplace/skills/@slug/download
GET /api/skills/:id/versions`}
            </pre>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
