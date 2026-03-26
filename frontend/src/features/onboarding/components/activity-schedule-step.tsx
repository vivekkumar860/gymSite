"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepLayout } from "./step-layout";
import {
  activityScheduleSchema,
  type ActivityScheduleData,
} from "../schemas/activity-schedule.schema";

type ActivityScheduleStepProps = {
  defaultValues: Partial<ActivityScheduleData>;
  onSubmit: (data: ActivityScheduleData) => void;
  onBack: () => void;
};

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "New to working out or getting back into it",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Consistent training for 6+ months",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Years of training experience",
  },
] as const;

const DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
] as const;

export function ActivityScheduleStep({
  defaultValues,
  onSubmit,
  onBack,
}: ActivityScheduleStepProps) {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityScheduleData>({
    resolver: zodResolver(activityScheduleSchema),
    defaultValues: {
      preferredWorkoutDays: [],
      ...defaultValues,
    },
  });

  const selectedLevel = watch("experienceLevel");
  const selectedDays = watch("preferredWorkoutDays") ?? [];

  function toggleDay(day: number) {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue("preferredWorkoutDays", next, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout
        title="Activity & Schedule"
        description="Tell us about your experience and preferred workout days."
        onBack={onBack}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-sm font-medium">Experience Level</span>
            <div
              className="grid gap-3"
              role="radiogroup"
              aria-label="Experience level"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <Card
                  key={level.value}
                  role="radio"
                  aria-checked={selectedLevel === level.value}
                  tabIndex={0}
                  className={`cursor-pointer transition-colors hover:border-primary ${
                    selectedLevel === level.value
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() =>
                    setValue("experienceLevel", level.value, {
                      shouldValidate: true,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setValue("experienceLevel", level.value, {
                        shouldValidate: true,
                      });
                    }
                  }}
                >
                  <CardContent className="flex flex-col gap-1 py-4">
                    <span className="font-medium">{level.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {level.description}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors.experienceLevel && (
              <p className="text-sm text-destructive" role="alert">
                {errors.experienceLevel.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <span className="text-sm font-medium">Preferred Workout Days</span>
            <p className="text-xs text-muted-foreground">
              Select at least one day. You can change this later.
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Workout days">
              {DAYS.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={
                    selectedDays.includes(day.value) ? "default" : "outline"
                  }
                  className="size-14 rounded-full"
                  onClick={() => toggleDay(day.value)}
                  aria-pressed={selectedDays.includes(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
            {errors.preferredWorkoutDays && (
              <p className="text-sm text-destructive" role="alert">
                {errors.preferredWorkoutDays.message}
              </p>
            )}
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
