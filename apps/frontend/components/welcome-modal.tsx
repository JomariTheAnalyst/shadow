"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/layout/modal-context";
import { LogoBurst } from "./graphics/logo/logo-burst";
import { Check } from "lucide-react";
import { useGitHubStatus } from "@/hooks/github/use-github-status";
import { useApiKeys, useApiKeyValidation } from "@/hooks/api-keys/use-api-keys";
import Link from "next/link";

export function WelcomeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { openSettingsModal } = useModal();

  // Don't show welcome modal in local development
  const isLocal = process.env.NODE_ENV === "development" || 
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" || process.env.NEXT_PUBLIC_FORCE_GITHUB_APP !== 'true';

  const handleConnectGitHub = () => {
    // onOpenChange(false);
    openSettingsModal("github");
  };

  const handleSetupAPIKeys = () => {
    // onOpenChange(false);
    openSettingsModal("models");
  };

  const { data: githubStatus } = useGitHubStatus();
  const { data: apiKeys } = useApiKeys();
  const { data: validationState } = useApiKeyValidation();

  // Check if at least one API key is set up and verified
  const hasValidApiKey =
    apiKeys &&
    validationState &&
    Object.keys(apiKeys).some((provider) => {
      const key = apiKeys[provider as keyof typeof apiKeys];
      const validation =
        validationState[provider as keyof typeof validationState];
      return key && key.length > 0 && validation?.isValid;
    });

  // Check if both setup tasks are complete
  const canGetStarted = isLocal || (hasValidApiKey && githubStatus?.isAppInstalled);

  return (
    <Dialog open={open} onOpenChange={canGetStarted ? onOpenChange : undefined}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="items-center py-4">
          <LogoBurst size="lg" forceAnimate={canGetStarted} />
          <DialogTitle className="sr-only">Welcome to Shadow</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Welcome to Shadow! Complete the following steps to get started. This
            configuration can always be changed later in Settings.
          </p>

          <div className="mt-3 flex items-start gap-3">
            <div className="bg-primary text-primary-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
              1
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <div className="flex items-center gap-2">
                <p className="font-medium">Connect the Shadow GitHub App</p>
                {githubStatus?.isAppInstalled && (
                  <Check className="size-4 text-green-400" />
                )}
              </div>
              <p className="text-muted-foreground pb-2 text-sm">
                Gives Shadow access to work on your existing repositories.
              </p>
              <Button
                disabled={githubStatus?.isAppInstalled}
                variant="secondary"
                onClick={handleConnectGitHub}
              >
                Connect GitHub
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
              2
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Add your model API keys</p>
                {hasValidApiKey && <Check className="size-4 text-green-400" />}
              </div>
              <p className="text-muted-foreground pb-2 text-sm">
                Shadow is BYOK; enter your own API keys to use the models.
              </p>
              <Button variant="secondary" onClick={handleSetupAPIKeys}>
                {hasValidApiKey ? "Manage API Keys" : "Setup API Keys"}
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <div className="bg-card rounded-lg border p-3">
              <div className="flex flex-col gap-3">
                <p className="text-muted-foreground text-[13px] leading-tight">
                  <strong>Important:</strong> While your data is stored
                  securely, we recommend not working on codebases requiring
                  enterprise-grade security with Shadow. Your API keys are never
                  permanently stored remotely.{" "}
                  <Link
                    href="https://example.com"
                    target="_blank"
                    className="font-medium underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Get Started button - always show, full width */}
          <div className="">
            <Button
              onClick={() => onOpenChange(false)}
              disabled={!canGetStarted}
              className="w-full"
            >
              Start Building
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
