"use client";

import { useState } from "react";
import type { NutritionPlanSummary } from "@/api/schemas/nutrition.schema";
import { formatDietType } from "../utils/format-nutrition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";

type NutritionPlanHistoryCardProps = {
  plans: NutritionPlanSummary[];
  isLoading: boolean;
  onActivate?: (planId: string) => void;
  activatingPlanId?: string | null;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function NutritionPlanHistoryCard({
  plans,
  isLoading,
  onActivate,
  activatingPlanId,
}: NutritionPlanHistoryCardProps) {
  const [open, setOpen] = useState(false);
  const [confirmPlan, setConfirmPlan] = useState<NutritionPlanSummary | null>(null);

  if (isLoading) {
    return (
      <div className="glass card-depth-2 rounded-2xl p-5 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-4/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (plans.length <= 1) return null;

  return (
    <div className="glass card-depth-2 rounded-2xl overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-primary/5"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Plan History</span>
          <span className="rounded-full glass px-2 py-0.5 text-xs text-muted-foreground font-medium">
            {plans.length}
          </span>
        </div>
        <ChevronDownIcon
          className={`size-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-3 px-5 pb-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex items-center gap-4 rounded-xl p-4 transition-colors ${
                plan.isActive
                  ? "bg-primary/5 border border-primary/20"
                  : "glass hover:bg-primary/5"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{plan.planName}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {formatDate(plan.createdAt)} &middot; {plan.dailyCalories} kcal
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className="bg-muted text-muted-foreground text-xs">
                  {formatDietType(plan.dietType)}
                </Badge>
                {plan.isActive ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Active
                  </Badge>
                ) : onActivate ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activatingPlanId === plan.id}
                    onClick={() => setConfirmPlan(plan)}
                    className="hover:border-primary/40 hover:bg-primary/5"
                  >
                    {activatingPlanId === plan.id ? "Activating..." : "Set Active"}
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmPlan}
        onOpenChange={(isOpen) => { if (!isOpen) setConfirmPlan(null); }}
        title={`Switch to ${confirmPlan?.planName ?? "this plan"}?`}
        description="This will deactivate your current plan."
        confirmLabel="Activate"
        onConfirm={() => {
          if (confirmPlan && onActivate) {
            onActivate(confirmPlan.id);
          }
        }}
      />
    </div>
  );
}
