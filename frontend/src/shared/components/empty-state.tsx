"use client";

import type { EmptyStateProps } from "@/shared/types/common.types";
import { Button } from "@/components/ui/button";

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 animate-float">
          <Icon />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-lg font-black tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground/80">{description}</p>
        )}
      </div>
      {action && (
        <Button onClick={action.onClick} className="glow-primary">{action.label}</Button>
      )}
    </div>
  );
}
