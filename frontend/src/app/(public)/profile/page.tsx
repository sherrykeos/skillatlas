"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { LoadingState } from "@/components/common/loading-state";
import { PageContainer } from "@/components/layout/page-container";
import { UserProfileView } from "@/components/profile/user-profile-view";

export default function MyProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <PageContainer className="py-16">
        <LoadingState message="Loading your profile..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <UserProfileView
        profile={{
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt,
        }}
        isOwner={true}
      />
    </PageContainer>
  );
}

