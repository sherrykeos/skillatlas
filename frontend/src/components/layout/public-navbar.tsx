"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  Bookmark,
  Settings,
  LogOut,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  Compass,
  Layers,
  FileCode,
  Flame,
} from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PUBLIC_NAV_ITEMS } from "@/constants/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getInitials } from "@/lib/utils";
import { SearchModal } from "@/components/common/search-modal";
import { BecomeCreatorDialog } from "@/components/creator/become-creator-dialog";

export function PublicNavbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isCreator, isAdmin, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [creatorDialogOpen, setCreatorDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1E2433] bg-[#090A0F]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-15">
            <Logo size="md" />

            <nav className="hidden md:flex items-center gap-7 text-sm">
              <span className="text-emerald-200">|</span>
              <Link
                href="/explore"
                className={`transition-colors py-1 font-medium flex items-center gap-1.5 ${
                  pathname === "/explore"
                    ? "text-emerald-400 font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {/* <Compass className="h-4 w-4" /> */}
                <span className="text-xs">Explore</span>
              </Link>

              <Link
                href="/categories"
                className={`transition-colors py-1 font-medium flex items-center gap-1.5 ${
                  pathname.startsWith("/categories")
                    ? "text-emerald-400 font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {/* <Layers className="h-4 w-4" /> */}
                <span className="text-xs">Categories</span>
              </Link>

              <Link
                href="/docs"
                className={`transition-colors py-1 font-medium flex items-center gap-1.5 ${
                  pathname.startsWith("/docs")
                    ? "text-emerald-400 font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                {/* <FileCode className="h-4 w-4" /> */}
                <span className="text-xs">Docs</span>
              </Link>

              <Link
                href="/blog"
                className={`transition-colors py-1 font-medium ${
                  pathname.startsWith("/blog")
                    ? "text-emerald-400 font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <span className="text-xs">Blog</span>
              </Link>
            </nav>
          </div>

          {/* Quick Search trigger & User Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-[8px] bg-[#0F1219] border border-[#1E2433] hover:border-[#2E384D] text-xs text-[#64748B] hover:text-[#94A3B8] transition-all w-36 sm:w-60 group shadow-inner"
            >
              <Search className="h-3.5 w-3.5 text-[#64748B] group-hover:text-emerald-400 transition-colors" />
              <span className="truncate text-[#94A3B8]">Search skills...</span>
              <div className="ml-auto hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-[#1E2433] bg-[#161B26] text-[10px] font-mono text-[#94A3B8]">
                  ⌘K
                </kbd>
              </div>
            </button>

            {/* User Auth Buttons or Menu */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                {isCreator ? (
                  <Button
                    asChild
                    variant="primary"
                    size="sm"
                    className="hidden sm:inline-flex text-xs gap-1.5 shadow-sm font-semibold"
                  >
                    <Link href="/skills/new">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>Publish</span>
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCreatorDialogOpen(true)}
                    variant="secondary"
                    size="sm"
                    className="hidden sm:inline-flex text-xs gap-1.5 text-emerald-400 hover:border-emerald-500/40"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Become Creator</span>
                  </Button>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-500/30 transition-all outline-none">
                      <Avatar className="h-8 w-8 border border-[#1E2433]">
                        <AvatarImage src={user.avatar || undefined} alt={user.username} />
                        <AvatarFallback className="text-xs bg-[#161B26] text-emerald-400 font-semibold">
                          {getInitials(user.username || user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-1.5 bg-[#0F1219] border-[#1E2433] shadow-2xl rounded-[10px]"
                  >
                    <div className="px-3 py-2 border-b border-[#1E2433]/70">
                      <p className="text-xs font-semibold text-[#F8FAFC] truncate">
                        {user.username}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {isAdmin && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Admin
                          </span>
                        )}
                        {isCreator && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Creator
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#161B26] rounded cursor-pointer"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-[#64748B]" />
                          <span>Creator Dashboard</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/saved"
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#161B26] rounded cursor-pointer"
                        >
                          <Bookmark className="h-3.5 w-3.5 text-[#64748B]" />
                          <span>Saved Skills</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href={`/users/${user.username}`}
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#161B26] rounded cursor-pointer"
                        >
                          <UserIcon className="h-3.5 w-3.5 text-[#64748B]" />
                          <span>Public Profile</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#161B26] rounded cursor-pointer"
                        >
                          <Settings className="h-3.5 w-3.5 text-[#64748B]" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-[#1E2433]" />

                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-xs text-[#94A3B8] hover:text-[#F8FAFC]">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="primary" size="sm" className="text-xs shadow-sm font-semibold">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-[6px] border border-[#1E2433] bg-[#0F1219] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1E2433] bg-[#090A0F] px-4 py-4 space-y-3">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm text-[#94A3B8] hover:bg-[#161B26] hover:text-[#F8FAFC]"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Skills</span>
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm text-[#94A3B8] hover:bg-[#161B26] hover:text-[#F8FAFC]"
              >
                <Layers className="h-4 w-4" />
                <span>Categories</span>
              </Link>
              <Link
                href="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm text-[#94A3B8] hover:bg-[#161B26] hover:text-[#F8FAFC]"
              >
                <FileCode className="h-4 w-4" />
                <span>Documentation</span>
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-[6px] text-sm text-[#94A3B8] hover:bg-[#161B26] hover:text-[#F8FAFC]"
              >
                <span>Blog</span>
              </Link>
            </nav>

            <div className="pt-3 border-t border-[#1E2433] flex flex-col gap-2">
              <Button asChild variant="primary" size="sm" className="w-full justify-center font-semibold">
                <Link href="/skills/new" onClick={() => setMobileMenuOpen(false)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span>Publish a Skill</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Creator onboarding dialog */}
      <BecomeCreatorDialog
        open={creatorDialogOpen}
        onOpenChange={setCreatorDialogOpen}
      />
    </>
  );
}
