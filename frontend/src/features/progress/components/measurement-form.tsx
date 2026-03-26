"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  measurementFormSchema,
  MEASUREMENT_SITES,
  MEASUREMENT_SITE_LABELS,
  type MeasurementFormSchema,
} from "../schemas/measurement-schema";
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

type MeasurementFormProps = {
  onSubmit: (data: MeasurementFormSchema) => void;
  isSubmitting?: boolean;
};

export function MeasurementForm({
  onSubmit,
  isSubmitting,
}: MeasurementFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MeasurementFormSchema>({
    resolver: zodResolver(measurementFormSchema),
    defaultValues: {
      measuredAt: new Date().toISOString().split("T")[0],
    },
  });

  const siteValue = watch("site");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormFieldWrapper
        label="Site"
        error={errors.site?.message}
        required
        htmlFor="site"
      >
        <Select
          value={siteValue ?? ""}
          onValueChange={(value) =>
            setValue("site", value as MeasurementFormSchema["site"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger id="site">
            <SelectValue placeholder="Select measurement site" />
          </SelectTrigger>
          <SelectContent>
            {MEASUREMENT_SITES.map((s) => (
              <SelectItem key={s} value={s}>
                {MEASUREMENT_SITE_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Value (cm)"
        error={errors.valueCm?.message}
        required
        htmlFor="valueCm"
      >
        <Input
          id="valueCm"
          type="number"
          step="0.1"
          placeholder="0.0"
          {...register("valueCm", { valueAsNumber: true })}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Date"
        error={errors.measuredAt?.message}
        required
        htmlFor="measuredAt"
      >
        <Input
          id="measuredAt"
          type="date"
          {...register("measuredAt")}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Notes"
        error={errors.notes?.message}
        htmlFor="notes"
      >
        <Textarea
          id="notes"
          placeholder="Any notes about this measurement..."
          {...register("notes")}
        />
      </FormFieldWrapper>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Measurement"}
      </Button>
    </form>
  );
}
