"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, PlusCircle, LayoutDashboard, Bookmark, Settings, LogOut, User, Sparkles } from "lucide-react";
import { Logo } from "./logo";
import { useAuth } from "@/lib/auth/auth-context";
import { SearchModal } from "@/components/common/search-modal";

export function MobileHeader() {
  const { user, isCreator, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 h-14 border-b border-[#1E2433] bg-[#090A0F]/95 backdrop-blur-md px-4 flex items-center justify-between">
        <Logo size="sm" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-[6px] hover:bg-[#161B26]"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] rounded-[6px] hover:bg-[#161B26]"
            aria-label="Menu"
          >
            {drawerOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {drawerOpen && (
          <div className="absolute top-14 left-0 right-0 border-b border-[#1E2433] bg-[#0F1219] p-4 space-y-2 animate-in slide-in-from-top-2 shadow-2xl">
            {isCreator ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F8FAFC] hover:bg-[#161B26]"
                >
                  <LayoutDashboard className="h-4 w-4 text-emerald-400" />
                  <span>Creator Dashboard</span>
                </Link>
                <Link
                  href="/skills"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F8FAFC] hover:bg-[#161B26]"
                >
                  <PlusCircle className="h-4 w-4 text-cyan-400" />
                  <span>My Skills</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F8FAFC] hover:bg-[#161B26]"
                >
                  <User className="h-4 w-4 text-emerald-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/become-creator"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-emerald-400 hover:bg-emerald-500/10 font-medium"
                >
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>Become a Creator</span>
                </Link>
              </>
            )}
            <Link
              href="/saved"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F8FAFC] hover:bg-[#161B26]"
            >
              <Bookmark className="h-4 w-4 text-emerald-300" />
              <span>Saved Skills</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-[#F8FAFC] hover:bg-[#161B26]"
            >
              <Settings className="h-4 w-4 text-[#94A3B8]" />
              <span>Settings</span>
            </Link>
            {user && (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm text-rose-400 hover:bg-rose-500/10 pt-2 border-t border-[#1E2433]"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out ({user.username})</span>
              </button>
            )}
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
