import React from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { CATEGORIES } from "@/constants/categories";

export function Footer() {
  return (
    <footer className="border-t border-[#1E2433] bg-[#090A0F] text-[#94A3B8] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed">
              SkillAtlas is the developer-first marketplace for agentic AI skills.
              Discover, publish, version, and integrate battle-tested workflows for any autonomous agent.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#64748B]">
              // Discover. Build. Share. Reuse.
            </div>
          </div>

          {/* Marketplace Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono uppercase text-[11px] tracking-wider text-[#F8FAFC]">
              Marketplace
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors">
                  Explore Skills
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/skills/new" className="hover:text-emerald-400 transition-colors">
                  Create a Skill
                </Link>
              </li>
              <li>
                <Link href="/github-import" className="hover:text-emerald-400 transition-colors">
                  Import from GitHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono uppercase text-[11px] tracking-wider text-[#F8FAFC]">
              Categories
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal */}
          <div className="space-y-3 text-xs">
            <h4 className="font-mono uppercase text-[11px] tracking-wider text-[#F8FAFC]">
              Developers
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="hover:text-emerald-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <span className="text-[#64748B]">API Reference (v1.0)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E2433] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© {new Date().getFullYear()} SkillAtlas.</p>
          <div className="flex items-center gap-6">
            <span className="text-emerald-100">Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
