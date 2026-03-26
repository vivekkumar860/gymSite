"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGoalSchema,
  type CreateGoalSchema,
} from "../schemas/create-goal-schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldWrapper } from "@/shared/components/form-field-wrapper";

type CreateGoalFormProps = {
  onSubmit: (data: CreateGoalSchema) => void;
  isSubmitting?: boolean;
};

const GOAL_TYPES = [
  { value: "LOSE_WEIGHT", label: "Lose Weight" },
  { value: "GAIN_MUSCLE", label: "Gain Muscle" },
  { value: "INCREASE_STRENGTH", label: "Increase Strength" },
  { value: "IMPROVE_ENDURANCE", label: "Improve Endurance" },
  { value: "MAINTAIN", label: "Maintain" },
  { value: "CUSTOM", label: "Custom" },
] as const;

export function CreateGoalForm({ onSubmit, isSubmitting }: CreateGoalFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      title: "",
      description: "",
      unit: "",
      targetDate: "",
    },
  });

  const typeValue = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormFieldWrapper label="Type" error={errors.type?.message} required htmlFor="type">
        <Select
          value={typeValue ?? null}
          onValueChange={(value) =>
            setValue("type", value as CreateGoalSchema["type"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select goal type" />
          </SelectTrigger>
          <SelectContent>
            {GOAL_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldWrapper>

      <FormFieldWrapper label="Title" error={errors.title?.message} required htmlFor="title">
        <Input
          id="title"
          placeholder="e.g., Lose 5kg by summer"
          {...register("title")}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Description" error={errors.description?.message} htmlFor="description">
        <Textarea
          id="description"
          placeholder="Optional description..."
          {...register("description")}
        />
      </FormFieldWrapper>

      <div className="grid grid-cols-2 gap-4">
        <FormFieldWrapper
          label="Target Value"
          error={errors.targetValue?.message}
          required
          htmlFor="targetValue"
        >
          <Input
            id="targetValue"
            type="number"
            step="0.1"
            placeholder="0"
            {...register("targetValue", { valueAsNumber: true })}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Unit" error={errors.unit?.message} htmlFor="unit">
          <Input
            id="unit"
            placeholder="kg, reps, etc."
            {...register("unit")}
          />
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper
        label="Target Date"
        error={errors.targetDate?.message}
        required
        htmlFor="targetDate"
      >
        <Input id="targetDate" type="date" {...register("targetDate")} />
      </FormFieldWrapper>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Goal"}
      </Button>
    </form>
  );
}
