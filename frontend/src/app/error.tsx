"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-black tracking-tighter">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          An unexpected error occurred. Please try again or return to the
          dashboard.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link
          href={ROUTES.dashboard}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
