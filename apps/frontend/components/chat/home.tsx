"use client";

import { useEffect, useState, useTransition } from "react";
import { LogoHover } from "../graphics/logo/logo-hover";
import { PromptForm } from "./prompt-form";
import { WelcomeModal } from "../welcome-modal";
import { useAuthSession } from "../auth/session-provider";
import type { FilteredRepository } from "@/lib/github/types";
import type { ModelType } from "@repo/types";

const WELCOME_MODAL_SHOWN_KEY = "shadow-welcome-modal-shown";
const WELCOME_MODAL_COMPLETED_KEY = "shadow-welcome-modal-completed";
const WELCOME_MODAL_DELAY = 300;

export function HomePageContent({
  initialGitCookieState,
  initialSelectedModel,
}: {
  initialGitCookieState?: {
    repo: FilteredRepository | null;
    branch: { name: string; commitSha: string } | null;
  } | null;
  initialSelectedModel?: ModelType | null;
}) {
  const [isPending, startTransition] = useTransition();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const { session, isLoading } = useAuthSession();

  useEffect(() => {
    // Show welcome modal for authenticated users who haven't completed the welcome flow
    if (!isLoading && session) {
      const hasCompletedWelcome = localStorage.getItem(
        WELCOME_MODAL_COMPLETED_KEY
      );

      if (!hasCompletedWelcome) {
        setTimeout(() => {
          setShowWelcomeModal(true);
        }, WELCOME_MODAL_DELAY);
      }
    }
  }, [session, isLoading]);

  const handleWelcomeModalClose = (open: boolean) => {
    setShowWelcomeModal(open);
    if (!open) {
      // Mark both the old and new keys for backward compatibility
      localStorage.setItem(WELCOME_MODAL_SHOWN_KEY, "true");
      localStorage.setItem(WELCOME_MODAL_COMPLETED_KEY, "true");
    }
  };

  return (
    <div className="mx-auto mt-20 flex w-full max-w-xl flex-col items-center gap-10 overflow-hidden p-4">
      <div className="font-departureMono flex select-none items-center gap-4 text-3xl font-medium tracking-tighter">
        <LogoHover size="lg" forceAnimate={isPending} />
        Code with{" "}
        <span className="text-muted-foreground inline-flex items-center gap-2">
          Shadow
        </span>
      </div>
      <PromptForm
        isHome
        initialGitCookieState={initialGitCookieState}
        initialSelectedModel={initialSelectedModel}
        transition={{ isPending, startTransition }}
      />

      <WelcomeModal
        open={showWelcomeModal}
        onOpenChange={handleWelcomeModalClose}
      />
    </div>
  );
}
