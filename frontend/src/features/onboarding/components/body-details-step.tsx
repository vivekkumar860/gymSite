"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FormFieldWrapper } from "@/shared/components/form-field-wrapper";
import { StepLayout } from "./step-layout";
import {
  bodyDetailsSchema,
  type BodyDetailsData,
} from "../schemas/body-details.schema";
import { Button } from "@/components/ui/button";

type BodyDetailsStepProps = {
  defaultValues: Partial<BodyDetailsData>;
  onSubmit: (data: BodyDetailsData) => void;
  onBack: () => void;
  isFirstStep: boolean;
};

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export function BodyDetailsStep({
  defaultValues,
  onSubmit,
  onBack,
  isFirstStep,
}: BodyDetailsStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BodyDetailsData>({
    resolver: zodResolver(bodyDetailsSchema),
    defaultValues,
  });

  const selectedGender = watch("gender");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout
        title="Body Details"
        description="Tell us about yourself. All fields are optional."
        isFirstStep={isFirstStep}
        onBack={onBack}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormFieldWrapper
              label="Height (cm)"
              error={errors.height?.message}
              htmlFor="height"
            >
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="170"
                aria-describedby={errors.height ? "height-error" : undefined}
                {...register("height", { valueAsNumber: true })}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Weight (kg)"
              error={errors.weight?.message}
              htmlFor="weight"
            >
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                aria-describedby={errors.weight ? "weight-error" : undefined}
                {...register("weight", { valueAsNumber: true })}
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper
            label="Date of Birth"
            error={errors.dateOfBirth?.message}
            htmlFor="dateOfBirth"
          >
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
          </FormFieldWrapper>

          <div className="space-y-2">
            <span className="text-sm font-medium">Gender</span>
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={
                    selectedGender === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setValue("gender", option.value, { shouldValidate: true })
                  }
                  aria-pressed={selectedGender === option.value}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
