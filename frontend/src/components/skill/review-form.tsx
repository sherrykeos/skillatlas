"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/auth-context";
import { toast } from "sonner";

interface ReviewFormProps {
  skillId: string;
  onSubmit: (content: string) => Promise<void>;
}

export function ReviewForm({ skillId, onSubmit }: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!isAuthenticated) {
      toast.error("Please sign in to write a review.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent("");
      toast.success("Review submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="border border-[#1E2433] rounded-[10px] bg-[#0F1219] p-5 text-center shadow-xl">
        <p className="text-xs text-[#94A3B8] mb-3">
          Sign in to leave a review and share feedback with the developer.
        </p>
        <Button asChild variant="secondary" size="sm">
          <a href={`/login?redirect=/skills/${skillId}`}>Sign In to Review</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#1E2433] rounded-[10px] bg-[#0F1219] p-4 space-y-3 shadow-xl">
      <div className="text-xs font-semibold text-[#F8FAFC]">Write a Review</div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="How well does this skill perform? Share prompt effectiveness, integration caveats, or agent performance..."
        className="min-h-[80px] text-xs"
        required
      />
      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          variant="primary"
          size="sm"
          className="gap-1.5 font-semibold shadow-md shadow-emerald-500/15"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
        </Button>
      </div>
    </form>
  );
}
