"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldWrapper } from "@/shared/components/form-field-wrapper";
import {
  exerciseFormSchema,
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
  DIFFICULTY_LEVELS,
  MOVEMENT_PATTERNS,
} from "../schemas/exercise-form-schema";
import type { AdminExercise } from "@/api/services/admin.service";
import { z } from "zod";

type FormValues = z.input<typeof exerciseFormSchema>;

type ExerciseFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: AdminExercise | null;
  onSubmit: (data: z.output<typeof exerciseFormSchema>) => void;
  isPending?: boolean;
};

export function ExerciseFormDialog({
  open,
  onOpenChange,
  exercise,
  onSubmit,
  isPending,
}: ExerciseFormDialogProps) {
  const isEditing = !!exercise;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(exerciseFormSchema) as any,
    defaultValues: {
      exerciseName: "",
      primaryMuscle: undefined,
      equipment: undefined,
      difficulty: "BEGINNER",
      isCompound: false,
      instructions: "",
      videoUrl: "",
    },
  });

  useEffect(() => {
    if (exercise) {
      reset({
        exerciseName: exercise.exerciseName,
        primaryMuscle: exercise.primaryMuscle as FormValues["primaryMuscle"],
        secondaryMuscle: (exercise.secondaryMuscle as FormValues["secondaryMuscle"]) ?? undefined,
        equipment: exercise.equipment as FormValues["equipment"],
        difficulty: (exercise.difficulty as FormValues["difficulty"]) ?? "BEGINNER",
        movementPattern: (exercise.movementPattern as FormValues["movementPattern"]) ?? undefined,
        instructions: exercise.instructions ?? "",
        videoUrl: exercise.videoUrl ?? "",
        isCompound: exercise.isCompound,
      });
    } else {
      reset({
        exerciseName: "",
        primaryMuscle: undefined,
        equipment: undefined,
        difficulty: "BEGINNER",
        isCompound: false,
        instructions: "",
        videoUrl: "",
      });
    }
  }, [exercise, reset]);

  const handleFormSubmit = handleSubmit((data) => {
    const parsed = exerciseFormSchema.parse(data);
    const cleaned: Record<string, unknown> = { ...parsed };
    if (!cleaned.videoUrl) delete cleaned.videoUrl;
    if (!cleaned.instructions) delete cleaned.instructions;
    if (!cleaned.secondaryMuscle) delete cleaned.secondaryMuscle;
    if (!cleaned.movementPattern) delete cleaned.movementPattern;
    onSubmit(cleaned as z.output<typeof exerciseFormSchema>);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Exercise" : "Create Exercise"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <FormFieldWrapper
            label="Exercise Name"
            required
            error={errors.exerciseName?.message}
            htmlFor="exerciseName"
          >
            <Input
              id="exerciseName"
              {...register("exerciseName")}
              placeholder="e.g. Barbell Bench Press"
            />
          </FormFieldWrapper>

          <div className="grid grid-cols-2 gap-4">
            <FormFieldWrapper
              label="Primary Muscle"
              required
              error={errors.primaryMuscle?.message}
            >
              <Select
                value={watch("primaryMuscle") ?? ""}
                onValueChange={(v) =>
                  setValue("primaryMuscle", v as FormValues["primaryMuscle"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {MUSCLE_GROUPS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Secondary Muscle"
              error={errors.secondaryMuscle?.message}
            >
              <Select
                value={watch("secondaryMuscle") ?? "none"}
                onValueChange={(v) =>
                  setValue(
                    "secondaryMuscle",
                    v === "none" ? undefined : (v as FormValues["secondaryMuscle"]),
                    { shouldValidate: true },
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {MUSCLE_GROUPS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormFieldWrapper
              label="Equipment"
              required
              error={errors.equipment?.message}
            >
              <Select
                value={watch("equipment") ?? ""}
                onValueChange={(v) =>
                  setValue("equipment", v as FormValues["equipment"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_TYPES.map((eq) => (
                    <SelectItem key={eq} value={eq}>
                      {eq.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Difficulty"
              error={errors.difficulty?.message}
            >
              <Select
                value={watch("difficulty") ?? "BEGINNER"}
                onValueChange={(v) =>
                  setValue("difficulty", v as FormValues["difficulty"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper
            label="Movement Pattern"
            error={errors.movementPattern?.message}
          >
            <Select
              value={watch("movementPattern") ?? "none"}
              onValueChange={(v) =>
                setValue(
                  "movementPattern",
                  v === "none" ? undefined : (v as FormValues["movementPattern"]),
                  { shouldValidate: true },
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {MOVEMENT_PATTERNS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Instructions"
            error={errors.instructions?.message}
            htmlFor="instructions"
          >
            <Textarea
              id="instructions"
              {...register("instructions")}
              placeholder="Step-by-step instructions..."
              rows={3}
            />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="Video URL"
            error={errors.videoUrl?.message}
            htmlFor="videoUrl"
          >
            <Input
              id="videoUrl"
              {...register("videoUrl")}
              placeholder="https://..."
            />
          </FormFieldWrapper>

          <div className="flex items-center gap-3">
            <Switch
              id="isCompound"
              checked={watch("isCompound") ?? false}
              onCheckedChange={(checked) => setValue("isCompound", checked)}
            />
            <label htmlFor="isCompound" className="text-sm font-medium">
              Compound exercise
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Exercise"
                  : "Create Exercise"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
