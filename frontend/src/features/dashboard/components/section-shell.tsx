"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  title: string;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: { label: string; onClick: () => void };
  children: React.ReactNode;
  className?: string;
};

export function SectionShell({
  title,
  isLoading,
  isError,
  onRetry,
  isEmpty,
  emptyMessage,
  emptyAction,
  children,
  className,
}: SectionShellProps) {
  if (isError) {
    return (
      <ErrorBoundaryCard
        title={title}
        message={`Failed to load ${title.toLowerCase()}.`}
        onRetry={onRetry}
      />
    );
  }

  if (isLoading) {
    return (
      <Card className={cn("glass card-depth-2 rounded-2xl border-border/30", className)}>
        <CardHeader>
          <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className={cn("glass card-depth-2 rounded-2xl border-border/30", className)}>
        <CardHeader>
          <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground/80">
            {emptyMessage ?? "No data available."}
          </p>
          {emptyAction && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3 hover:border-primary/40 hover:bg-primary/5"
              onClick={emptyAction.onClick}
            >
              {emptyAction.label}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("glass card-depth-2 rounded-2xl border-border/30 interactive", className)}>
      <CardHeader>
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-primary/60">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
