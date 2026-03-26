"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";

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
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
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
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {emptyMessage ?? "No data available."}
          </p>
          {emptyAction && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
