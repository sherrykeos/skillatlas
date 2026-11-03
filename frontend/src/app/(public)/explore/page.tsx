"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Boxes,
  Code2,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag as TagIcon,
  X,
} from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import { SkillGrid } from "@/components/marketplace/skill-grid";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/categories";
import { marketplaceApi } from "@/lib/api/marketplace";
import { LoadingState } from "@/components/common/loading-state";

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialSearch = searchParams.get("search") || searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = (searchParams.get("sort") as "latest" | "popular" | "upvotes") || "latest";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<"latest" | "popular" | "upvotes">(initialSort);
  const [page, setPage] = useState(initialPage);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort !== "latest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));

    const newQuery = params.toString();
    const newUrl = newQuery ? `/explore?${newQuery}` : "/explore";
    router.replace(newUrl, { scroll: false });
  }, [search, category, sort, page, router]);

  // Query marketplace
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketplace-skills", { page, limit: 12, search, category, sort }],
    queryFn: () =>
      marketplaceApi.getSkills({
        page,
        limit: 12,
        search: search || undefined,
        category: category || undefined,
        sort,
      }),
    placeholderData: (previousData) => previousData,
  });

  const skills = data?.skills || [];
  const pagination = data?.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSort("latest");
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || category || sort !== "latest");

  return (
    <PageContainer>
      <PageHeader
        title="Explore Skills"
        description="Discover and integrate reusable agentic capabilities built by the developer community."
        badge={`${pagination.total || 0} Skills`}
      />
      <div className="grid grid-cols-1 gap-8 items-start">
        {/* Right Main Marketplace Area */}
        <div className="space-y-6">
          {/* Top Filter Bar */}
          <MarketplaceFilters
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            selectedCategory={category}
            onCategoryChange={(val) => {
              setCategory(val);
              setPage(1);
            }}
            selectedSort={sort}
            onSortChange={(val) => {
              setSort(val);
              setPage(1);
            }}
            onReset={handleReset}
            hasActiveFilters={hasActiveFilters}
            totalCount={pagination.total}
          />

          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#161B26] border border-[#1E2433] text-[#F8FAFC] font-mono">
                  <span>Query: &quot;{search}&quot;</span>
                  <button onClick={() => setSearch("")} className="text-[#64748B] hover:text-[#F8FAFC]">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                  <span>Category: {CATEGORIES.find((c) => c.slug === category)?.name || category}</span>
                  <button onClick={() => setCategory("")} className="text-emerald-400 hover:text-emerald-300">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Skills Grid */}
          <SkillGrid
            skills={skills}
            isLoading={isLoading}
            emptyTitle="No matching skills found"
            emptyDescription="No skills matched your filter criteria. Try adjusting your query or resetting filters."
            actionLabel="Reset Filters"
            onAction={handleReset}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-[#1E2433]">
              <div className="text-xs text-[#64748B] font-mono">
                Page <span className="text-[#F8FAFC] font-medium">{pagination.page}</span> of{" "}
                <span className="text-[#F8FAFC] font-medium">{pagination.totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                  variant="secondary"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages || isLoading}
                  variant="secondary"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<LoadingState message="Loading marketplace..." />}>
      <ExploreContent />
    </Suspense>
  );
}
