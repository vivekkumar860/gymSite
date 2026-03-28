"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActiveNutritionPlan } from "../hooks/use-daily-nutrition";
import { useRegenerateMeals } from "../hooks/use-regenerate-meals";
import { useRegenerateMeal } from "../hooks/use-regenerate-meal";
import { useNutritionPlanHistory } from "../hooks/use-nutrition-plan-history";
import { useActivatePlan } from "../hooks/use-activate-plan";
import { MacroTargetsCard } from "../components/macro-targets-card";
import { PlanStatsRow } from "../components/plan-stats-row";
import { MealCard } from "../components/meal-card";
import { NutritionPlanHistoryCard } from "../components/nutrition-plan-history-card";
import { PageHeader } from "@/shared/components/page-header";
import { ErrorBoundaryCard } from "@/shared/components/error-boundary-card";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { formatErrorMessage } from "@/shared/utils/format-error";
import {
  formatDietType,
  formatMealPlanType,
  formatBudgetPreference,
} from "../utils/format-nutrition";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon, PencilIcon, UtensilsCrossedIcon, ArrowRightIcon } from "lucide-react";
import { ROUTES } from "@/config/routes";

function NutritionLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="glass card-depth-2 rounded-2xl p-6 space-y-3">
        <Skeleton className="h-7 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
      {/* Macro card skeleton */}
      <div className="glass card-depth-2 rounded-2xl p-6">
        <Skeleton className="h-4 w-28 mb-5" />
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Skeleton className="size-48 rounded-full shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
      {/* Meal card skeletons */}
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass card-depth-2 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NutritionDailyView() {
  const router = useRouter();
  const { data: plan, isLoading, isError, error, refetch } = useActiveNutritionPlan();
  const regenerate = useRegenerateMeals();
  const regenerateMeal = useRegenerateMeal();
  const history = useNutritionPlanHistory();
  const activatePlan = useActivatePlan();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activatingPlanId, setActivatingPlanId] = useState<string | null>(null);
  const [regeneratingMealId, setRegeneratingMealId] = useState<string | null>(null);

  function handleActivate(planId: string) {
    setActivatingPlanId(planId);
    activatePlan.mutate(planId, {
      onSuccess: () => {
        toast.success("Plan activated");
        setActivatingPlanId(null);
      },
      onError: (err) => {
        toast.error(formatErrorMessage(err, "Failed to activate plan"));
        setActivatingPlanId(null);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Nutrition Plan" />
        <NutritionLoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Nutrition Plan" />
        <div className="rounded-2xl border-2 border-destructive/20 bg-destructive/5 p-6">
          <ErrorBoundaryCard
            message={formatErrorMessage(error, "Failed to load nutrition plan.")}
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
        <PageHeader title="Nutrition Plan" />
        <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center">
          <div className="mx-auto flex flex-col items-center gap-4">
            <UtensilsCrossedIcon className="size-16 text-primary/40 animate-float" />
            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tighter gradient-text">Your nutrition plan lives here</h3>
              <p className="text-sm text-muted-foreground/80 max-w-md mx-auto">
                Generate a personalised AI-powered nutrition plan based on your goals, diet preferences, and budget.
              </p>
            </div>
            <Button
              size="lg"
              className="mt-2 glow-primary"
              onClick={() => router.push(ROUTES.nutrition.plan)}
            >
              Create Nutrition Plan
              <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          </div>
        </div>
        <NutritionPlanHistoryCard
          plans={history.data ?? []}
          isLoading={history.isLoading}
          onActivate={handleActivate}
          activatingPlanId={activatingPlanId}
        />
      </div>
    );
  }

  const isRegenerating = regenerate.isPending;

  function handleRegenerate() {
    regenerate.mutate(plan!.id, {
      onSuccess: () => {
        toast.success("Meals regenerated successfully");
      },
      onError: (err) => {
        toast.error(formatErrorMessage(err, "Failed to regenerate meals"));
      },
    });
  }

  function handleRegenerateMeal(mealId: string) {
    setRegeneratingMealId(mealId);
    regenerateMeal.mutate(
      { planId: plan!.id, mealId },
      {
        onSettled: () => setRegeneratingMealId(null),
      },
    );
  }

  return (
    <div className="min-h-screen mesh-bg space-y-6 p-4 md:p-6">
      {/* Hero header card */}
      <div className="glass card-depth-3 rounded-2xl p-6 animate-slide-up"
        style={{
          backgroundImage: "linear-gradient(135deg, color-mix(in oklch, var(--glow) 8%, transparent) 0%, transparent 50%)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <h1 className="text-2xl font-black tracking-tighter">{plan.planName}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {plan.mealPlanType && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  {formatMealPlanType(plan.mealPlanType)}
                </Badge>
              )}
              <Badge className="bg-muted text-muted-foreground text-xs">
                {formatDietType(plan.dietType)}
              </Badge>
              {plan.budgetPreference && (
                <Badge className="bg-muted text-muted-foreground text-xs">
                  {formatBudgetPreference(plan.budgetPreference)}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(ROUTES.nutrition.plan)}
            >
              <PencilIcon className="mr-1.5 size-3.5" />
              Update Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isRegenerating}
              onClick={() => setConfirmOpen(true)}
              className="hover:border-primary/40 hover:bg-primary/5"
            >
              <RefreshCwIcon className={`mr-1.5 size-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Regenerating..." : "Regenerate Meals"}
            </Button>
          </div>
        </div>
      </div>

      {/* BMR / TDEE / Daily Target stats */}
      <PlanStatsRow
        bmr={plan.bmr ?? null}
        tdee={plan.tdee ?? null}
        dailyTarget={plan.targetMacros.calories}
      />

      {/* Macro donut + targets */}
      <MacroTargetsCard targetMacros={plan.targetMacros} />

      {/* Planned meals */}
      <div className="space-y-4">
        {plan.meals.map((meal, idx) => (
          <div
            key={meal.id}
            className="animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <MealCard
              meal={meal}
              isRegenerating={regeneratingMealId === meal.id}
              onRegenerate={() => handleRegenerateMeal(meal.id)}
            />
          </div>
        ))}
      </div>

      {/* Plan history */}
      {history.isError ? (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <span>Could not load plan history.</span>
          <Button variant="ghost" size="sm" onClick={() => history.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <NutritionPlanHistoryCard
          plans={history.data ?? []}
          isLoading={history.isLoading}
          onActivate={handleActivate}
          activatingPlanId={activatingPlanId}
        />
      )}

      {/* Regenerate all meals confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Regenerate Meals?"
        description="This will replace all current meals with a new generated set. Your plan targets will stay the same."
        confirmLabel={isRegenerating ? "Regenerating..." : "Regenerate"}
        onConfirm={handleRegenerate}
      />
    </div>
  );
}
