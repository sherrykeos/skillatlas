"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/page-container";
import { LoadingState } from "@/components/common/loading-state";
import { usersApi } from "@/lib/api/users";
import { useAuth } from "@/lib/auth/auth-context";
import { UserProfileView } from "@/components/profile/user-profile-view";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const username = decodeURIComponent(resolvedParams.username);
  const { user: authUser } = useAuth();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["user-profile", username],
    queryFn: () => usersApi.getPublicProfile(username),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <PageContainer className="py-16">
        <LoadingState message="Loading developer profile..." />
      </PageContainer>
    );
  }

  if (isError || !profile) {
    notFound();
  }

  const isOwner =
    Boolean(authUser?.username && authUser.username.toLowerCase() === username.toLowerCase()) ||
    Boolean(authUser?.id && authUser.id === profile.id);

  return (
    <PageContainer className="py-8">
      <UserProfileView profile={profile} isOwner={isOwner} />
    </PageContainer>
  );
}
