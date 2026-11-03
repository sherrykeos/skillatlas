import React from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#090A0F] flex flex-col justify-between">
      {/* Auth Top Header */}
      <header className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-[#1E2433] bg-[#090A0F]/80 backdrop-blur-md">
        <Logo size="md" />
        <Link
          href="/"
          className="text-xs text-[#94A3B8] hover:text-emerald-400 transition-colors font-mono"
        >
          ← Back to Marketplace
        </Link>
      </header>

      {/* Auth Main Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Auth Footer */}
      <footer className="h-14 border-t border-[#1E2433] px-6 flex items-center justify-center text-xs text-[#64748B] font-mono">
        <p>© {new Date().getFullYear()} SkillAtlas. Protected by JWT auth &amp; Argon2/Bcrypt.</p>
      </footer>
    </div>
  );
}
