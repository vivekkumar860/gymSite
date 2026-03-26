"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { StepLayout } from "./step-layout";
import {
  goalSelectionSchema,
  type GoalSelectionData,
} from "../schemas/goal-selection.schema";

type GoalSelectionStepProps = {
  defaultValues: Partial<GoalSelectionData>;
  onSubmit: (data: GoalSelectionData) => void;
  onBack: () => void;
};

const FITNESS_GOALS = [
  {
    value: "lose_weight",
    label: "Lose Weight",
    description: "Burn fat and get lean",
  },
  {
    value: "build_muscle",
    label: "Build Muscle",
    description: "Gain strength and size",
  },
  {
    value: "maintain",
    label: "Stay Fit",
    description: "Maintain current fitness",
  },
  {
    value: "improve_endurance",
    label: "Improve Endurance",
    description: "Boost stamina and cardio",
  },
] as const;

export function GoalSelectionStep({
  defaultValues,
  onSubmit,
  onBack,
}: GoalSelectionStepProps) {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalSelectionData>({
    resolver: zodResolver(goalSelectionSchema),
    defaultValues,
  });

  const selected = watch("fitnessGoal");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout
        title="What's your main fitness goal?"
        description="This helps us personalize your experience."
        onBack={onBack}
      >
        <div className="space-y-3">
          <div
            className="grid grid-cols-2 gap-3"
            role="radiogroup"
            aria-label="Fitness goal"
          >
            {FITNESS_GOALS.map((goal) => (
              <Card
                key={goal.value}
                role="radio"
                aria-checked={selected === goal.value}
                tabIndex={0}
                className={`cursor-pointer transition-colors hover:border-primary ${
                  selected === goal.value
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() =>
                  setValue("fitnessGoal", goal.value, { shouldValidate: true })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setValue("fitnessGoal", goal.value, {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                  <span className="font-medium">{goal.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {goal.description}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.fitnessGoal && (
            <p className="text-sm text-destructive" role="alert">
              {errors.fitnessGoal.message}
            </p>
          )}
        </div>
      </StepLayout>
    </form>
  );
}
