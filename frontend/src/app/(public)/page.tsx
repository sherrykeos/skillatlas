"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  Terminal,
  Cpu,
  ShieldCheck,
  Globe2,
  Boxes,
  PlusCircle,
  Copy,
  Check,
  Flame,
  CheckCircle2,
  Play,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/categories";
import { useQuery } from "@tanstack/react-query";
import { marketplaceApi } from "@/lib/api/marketplace";
import { SkillGrid } from "@/components/marketplace/skill-grid";
import { toast } from "sonner";

export default function LandingPage() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"cli" | "spec" | "runtimes">("cli");
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [copiedCli, setCopiedCli] = useState(false);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<string>("");
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(3);

  // Hotkey listener for '/' or 'Cmd+K' to focus the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch real marketplace statistics from database
  const { data: stats } = useQuery({
    queryKey: ["marketplace-stats"],
    queryFn: () => marketplaceApi.getStats(),
  });

  // Fetch real categories with counts from database
  const { data: dbCategories } = useQuery({
    queryKey: ["marketplace-categories"],
    queryFn: () => marketplaceApi.getCategories(),
  });

  // Fetch real published skills from database
  const { data: skillsData, isLoading } = useQuery({
    queryKey: ["featured-skills", selectedHomeCategory],
    queryFn: () =>
      marketplaceApi.getSkills({
        limit: 6,
        sort: "popular",
        category: selectedHomeCategory || undefined,
      }),
  });

  const featuredSkills = skillsData?.skills || [];
  const activeSkill = featuredSkills[selectedSkillIndex] || featuredSkills[0] || null;

  const categories = (dbCategories && dbCategories.length > 0)
    ? dbCategories
    : CATEGORIES.map((c) => ({
        id: c.slug,
        name: c.name,
        slug: c.slug,
        description: c.description,
        _count: { Skills: 0 },
      }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
    toast.success("Command copied to clipboard!");
  };

  const runSimulation = () => {
    setSimulating(true);
    setSimStep(0);
    setTimeout(() => setSimStep(1), 500);
    setTimeout(() => setSimStep(2), 1100);
    setTimeout(() => {
      setSimStep(3);
      setSimulating(false);
    }, 1800);
  };

  const cliCommand = activeSkill
    ? `npx skillatlas add ${activeSkill.slug}`
    : `npx skillatlas init my-agent-skill`;

  return (
    <div className="flex flex-col min-h-screen bg-[#090A0F]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1E2433] py-16 lg:py-24">
        {/* Subtle technical background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141824_1px,transparent_1px),linear-gradient(to_bottom,#141824_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        {/* Ambient top emerald glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Official Monogram Badge + Live Database Ticker */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-wide shadow-sm hover:border-emerald-500/50 transition-colors">
                <div className="relative h-4 w-4 shrink-0">
                  <Image
                    src="/logo.png"
                    alt="SkillAtlas"
                    fill
                    className="object-contain drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                  />
                </div>
                <span className="font-semibold text-emerald-300">SkillAtlas Registry</span>
                <span className="text-[#64748B]">|</span>
                <span className="text-[#94A3B8] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {stats ? `${stats.totalSkills} Published ${stats.totalSkills === 1 ? "Skill" : "Skills"}` : "Live Database"}
                </span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.08]">
                Equip your AI agents <br />
                <span className="text-emerald-400">with verified skills.</span>
              </h1>

              <p className="text-base sm:text-md text-[#94A3B8] max-w-xl leading-relaxed">
                The open developer registry for standardized, sandboxed agent capabilities.
                Audit AST parameters, verify prompt immutability, and install into Claude Code, Antigravity, Cursor, or custom runtimes in seconds.
              </p>

              {/* Command-Palette Spotlight Search Input */}
              <form onSubmit={handleSearch} className="max-w-xl">
                <div className="relative flex items-center group">
                  <Search className="absolute left-4 h-5 w-5 text-[#64748B] group-focus-within:text-emerald-400 transition-colors" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search capabilities, tools, runtimes (e.g. web-search, git-review)..."
                    className="w-full h-13 rounded-[10px] border border-[#1E2433] bg-[#0F1219] pl-12 pr-28 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all shadow-2xl"
                  />
                  <div className="absolute right-3 hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#64748B] bg-[#161B26] border border-[#1E2433] px-2 py-1 rounded">
                    <span>Press</span>
                    <kbd className="text-[#F8FAFC] font-semibold">/</kbd>
                  </div>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild variant="primary" size="lg" className="shadow-lg shadow-emerald-500/20 font-semibold">
                  <Link href="/explore">
                    <span>Explore Marketplace</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>

                <Button asChild variant="secondary" size="lg">
                  <Link href="/skills/new">
                    <PlusCircle className="h-4 w-4 mr-2 text-emerald-400" />
                    <span>Publish a Skill</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Hero: Real Interactive Registry Terminal Simulator */}
            <div className="lg:col-span-5">
              <div className="rounded-[12px] border border-[#1E2433] bg-[#0F1219] overflow-hidden shadow-2xl">
                {/* Terminal Window Chrome */}
                <div className="px-4 py-3 bg-[#131722] border-b border-[#1E2433] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/70" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 text-xs font-mono text-[#64748B] flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                      <span>skillatlas-cli</span>
                    </span>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <button
                      onClick={() => setActiveTab("cli")}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeTab === "cli"
                          ? "bg-[#161B26] text-emerald-400 border border-[#1E2433] font-semibold"
                          : "text-[#64748B] hover:text-[#94A3B8]"
                      }`}
                    >
                      Terminal
                    </button>
                    <button
                      onClick={() => setActiveTab("spec")}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeTab === "spec"
                          ? "bg-[#161B26] text-emerald-400 border border-[#1E2433] font-semibold"
                          : "text-[#64748B] hover:text-[#94A3B8]"
                      }`}
                    >
                      SKILL.md
                    </button>
                    <button
                      onClick={() => setActiveTab("runtimes")}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeTab === "runtimes"
                          ? "bg-[#161B26] text-emerald-400 border border-[#1E2433] font-semibold"
                          : "text-[#64748B] hover:text-[#94A3B8]"
                      }`}
                    >
                      Runtimes
                    </button>
                  </div>
                </div>

                {/* Package Quick Selector Pills (Real Skills From Database) */}
                {featuredSkills.length > 0 && (
                  <div className="px-4 py-2 bg-[#0C0F17] border-b border-[#1E2433] flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {featuredSkills.slice(0, 4).map((pkg, idx) => (
                      <button
                        key={pkg.id}
                        onClick={() => {
                          setSelectedSkillIndex(idx);
                          runSimulation();
                        }}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all shrink-0 ${
                          selectedSkillIndex === idx
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-medium"
                            : "text-[#64748B] hover:text-[#94A3B8] border border-transparent"
                        }`}
                      >
                        {pkg.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab Content 1: CLI */}
                {activeTab === "cli" && (
                  <div className="p-5 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span>// Pull directly into your agent repository</span>
                      {activeSkill && (
                        <button
                          onClick={runSimulation}
                          disabled={simulating}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 active:scale-95 transition-all"
                        >
                          <Play className="h-2.5 w-2.5" />
                          <span>{simulating ? "Executing..." : "Test Command"}</span>
                        </button>
                      )}
                    </div>

                    <div className="p-3 rounded-[8px] bg-[#090A0F] border border-[#1E2433] flex items-center justify-between text-[#F8FAFC]">
                      <span className="truncate selection:bg-emerald-500 selection:text-black">
                        {cliCommand}
                      </span>
                      <button
                        onClick={() => handleCopy(cliCommand)}
                        className="ml-2 p-1.5 rounded hover:bg-[#161B26] text-[#64748B] hover:text-emerald-400 transition-colors shrink-0"
                        title="Copy command"
                      >
                        {copiedCli ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-[#94A3B8]">
                      {activeSkill ? (
                        <>
                          {simStep >= 1 && (
                            <div className="flex items-center gap-2 text-sky-400 animate-fadeIn">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">Resolved registry skill: {activeSkill.name}</span>
                            </div>
                          )}
                          {simStep >= 2 && (
                            <div className="flex items-center gap-2 text-emerald-400 animate-fadeIn">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">Verified author @{activeSkill.author?.username || "creator"}</span>
                            </div>
                          )}
                          {simStep >= 3 && (
                            <div className="flex items-center gap-2 text-emerald-300 font-semibold animate-fadeIn">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">Ready to execute in .agents/skills/{activeSkill.slug}/</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-[#64748B] space-y-1">
                          <p>✓ SkillAtlas standard CLI ready</p>
                          <p>✓ Use `npx skillatlas init &lt;name&gt;` to scaffold a skill</p>
                          <p>✓ Ready for Claude, Cursor, Antigravity, and MCP</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab Content 2: SKILL.md */}
                {activeTab === "spec" && (
                  <div className="p-5 space-y-3 font-mono text-xs text-[#94A3B8]">
                    <div className="text-emerald-400 font-semibold">// Standardized Prompt Architecture</div>
                    <div className="p-3.5 rounded-[8px] bg-[#090A0F] border border-[#1E2433] space-y-1 text-[11px] leading-relaxed">
                      <p className="text-sky-400">---</p>
                      <p><span className="text-emerald-400">name:</span> {activeSkill?.slug || "sample-skill"}</p>
                      <p><span className="text-emerald-400">description:</span> {activeSkill?.description || "Reusable agentic capability specification."}</p>
                      <p><span className="text-emerald-400">category:</span> {activeSkill?.category?.name || "General"}</p>
                      <p className="text-sky-400">---</p>
                      <p className="text-[#F8FAFC] pt-1">
                        # {activeSkill?.name || "Skill Documentation"}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {activeSkill?.description || "Detailed multi-file instructions and tool schemas."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab Content 3: Runtimes */}
                {activeTab === "runtimes" && (
                  <div className="p-5 space-y-3 text-xs">
                    <p className="text-[#94A3B8] text-xs">
                      SkillAtlas packages drop directly into all leading agent runtimes:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2.5 rounded-[6px] border border-[#1E2433] bg-[#090A0F] text-[#F8FAFC] flex items-center gap-1.5 hover:border-emerald-500/40 transition-colors">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>Claude Code (.claude)</span>
                      </div>
                      <div className="p-2.5 rounded-[6px] border border-[#1E2433] bg-[#090A0F] text-[#F8FAFC] flex items-center gap-1.5 hover:border-emerald-500/40 transition-colors">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>Antigravity (AGY)</span>
                      </div>
                      <div className="p-2.5 rounded-[6px] border border-[#1E2433] bg-[#090A0F] text-[#F8FAFC] flex items-center gap-1.5 hover:border-emerald-500/40 transition-colors">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>Cursor (.cursor/skills)</span>
                      </div>
                      <div className="p-2.5 rounded-[6px] border border-[#1E2433] bg-[#090A0F] text-[#F8FAFC] flex items-center gap-1.5 hover:border-emerald-500/40 transition-colors">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>MCP Servers</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer status bar */}
                <div className="px-5 py-2.5 bg-[#090A0F] border-t border-[#1E2433] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Spec: RFC-9422</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">Standardized Agent Skill</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Runtime Compatibility Ecosystem Strip */}
      <section className="border-b border-[#1E2433] bg-[#0B0E14] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#64748B] shrink-0">
              Compatible Agent Runtimes:
            </span>
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-[#94A3B8]">
              {[
                "Claude Code",
                "Google Antigravity",
                "Cursor IDE",
                "OpenAI Swarm",
                "LangChain",
                "CrewAI",
                "Model Context Protocol (MCP)",
              ].map((runtime) => (
                <span
                  key={runtime}
                  className="hover:text-[#F8FAFC] transition-colors flex items-center gap-1.5 cursor-default"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {runtime}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Database Metrics Strip (Strictly Real PostgreSQL Figures) */}
      <section className="border-b border-[#1E2433] bg-[#090A0F] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
                {stats ? stats.totalSkills : "0"}
              </div>
              <div className="text-xs text-[#64748B] uppercase tracking-wider font-mono">Published Skills</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F8FAFC]">
                {stats ? stats.totalDownloads : "0"}
              </div>
              <div className="text-xs text-[#64748B] uppercase tracking-wider font-mono">Package Downloads</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-400">
                {stats ? stats.totalUpvotes : "0"}
              </div>
              <div className="text-xs text-[#64748B] uppercase tracking-wider font-mono">Developer Upvotes</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
                {stats ? stats.totalCategories : categories.length}
              </div>
              <div className="text-xs text-[#64748B] uppercase tracking-wider font-mono">Active Domains</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills Section with Category Filter Chips */}
      <section className="py-16 border-b border-[#1E2433] bg-[#090A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-emerald-400" />
                <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
                  Published Agent Skills
                </h2>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1">
                Live skills from the registry sorted by community downloads and ratings.
              </p>
            </div>

            <Button asChild variant="secondary" size="sm">
              <Link href="/explore">
                <span>View All Marketplace</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Quick Domain Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-4 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedHomeCategory("")}
              className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                !selectedHomeCategory
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                  : "bg-[#0F1219] text-[#94A3B8] border border-[#1E2433] hover:text-[#F8FAFC]"
              }`}
            >
              All Domains
            </button>
            {CATEGORIES.slice(0, 8).map((cat) => {
              const active = selectedHomeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedHomeCategory(active ? "" : cat.slug)}
                  className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                    active
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 font-medium"
                      : "bg-[#0F1219] text-[#94A3B8] border border-[#1E2433] hover:text-[#F8FAFC]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <SkillGrid
            skills={featuredSkills}
            isLoading={isLoading}
            emptyTitle="No skills published yet"
            emptyDescription="Create and publish your first skill to seed the registry."
            actionLabel="Publish a Skill"
            onAction={() => router.push("/skills/new")}
          />
        </div>
      </section>

      {/* Browse by Functional Domain Grid */}
      <section className="py-16 border-b border-[#1E2433] bg-[#0B0E14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
                Browse by Functional Domain
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Filter by specialized execution layers and agent task types.
              </p>
            </div>

            <Button asChild variant="ghost" size="sm" className="text-xs text-emerald-400">
              <Link href="/categories">All Categories →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => {
              const skillCount = cat._count?.Skills ?? 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group p-5 rounded-[10px] border border-[#1E2433] bg-[#0F1219] hover:border-[#2E384D] hover:bg-[#131722] hover:-translate-y-0.5 transition-all duration-200 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-[8px] border border-[#1E2433] bg-[#161B26] flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Boxes className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {skillCount} {skillCount === 1 ? "skill" : "skills"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#F8FAFC] group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                      {cat.description || "Agentic skills and workflows."}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engineering Standards */}
      <section className="py-16 border-b border-[#1E2433] bg-[#090A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              Built for production AI infrastructure.
            </h2>
            <p className="text-sm text-[#94A3B8]">
              Standardized, verifiable, and executable capabilities designed to eliminate agent hallucination and runtime failures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-[10px] border border-[#1E2433] bg-[#0F1219] space-y-3 hover:border-[#2E384D] transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-[8px] border border-sky-500/20 bg-sky-500/10 flex items-center justify-center text-sky-400">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Open Specification</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Standardized SKILL.md format with YAML frontmatter, execution instructions, and isolated prompt assets. Zero vendor lock-in.
              </p>
            </div>

            <div className="p-6 rounded-[10px] border border-[#1E2433] bg-[#0F1219] space-y-3 hover:border-[#2E384D] transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-[8px] border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Sandboxed &amp; Audited</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Automated AST static checking guarantees no leaked environment secrets, parameter tampering, or malicious shell payloads.
              </p>
            </div>

            <div className="p-6 rounded-[10px] border border-[#1E2433] bg-[#0F1219] space-y-3 hover:border-[#2E384D] transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-[8px] border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Instant CLI Pull</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                One command installs any skill directly into your agent repository: <code>npx skillatlas add @slug</code>.
              </p>
            </div>

            <div className="p-6 rounded-[10px] border border-[#1E2433] bg-[#0F1219] space-y-3 hover:border-[#2E384D] transition-colors shadow-sm">
              <div className="h-10 w-10 rounded-[8px] border border-purple-500/20 bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Runtime Composable</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Plug seamlessly into Claude Code, Antigravity, Cursor, LangChain, CrewAI, AutoGen, or custom agent frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer CTA */}
      <section className="py-20 bg-[#0B0E14] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
            <Package className="h-3.5 w-3.5" />
            <span>Open Skill Registry Standard</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
            Ready to distribute your agent capabilities?
          </h2>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            Publish modular, verified skills to power the next generation of autonomous agents.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild variant="primary" size="lg" className="shadow-lg shadow-emerald-500/15">
              <Link href="/explore">
                <span>Explore Marketplace</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/skills/new">
                <PlusCircle className="h-4 w-4 mr-2 text-emerald-400" />
                <span>Publish a Skill</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
