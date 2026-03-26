"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { StepLayout } from "./step-layout";
import {
  equipmentAccessSchema,
  equipmentOptions,
  type EquipmentAccessData,
} from "../schemas/equipment-access.schema";

type EquipmentAccessStepProps = {
  defaultValues: Partial<EquipmentAccessData>;
  onSubmit: (data: EquipmentAccessData) => void;
  onBack: () => void;
};

const EQUIPMENT_LABELS: Record<
  (typeof equipmentOptions)[number],
  string
> = {
  full_gym: "Full Gym",
  dumbbells: "Dumbbells",
  barbell: "Barbell & Rack",
  resistance_bands: "Resistance Bands",
  pull_up_bar: "Pull-up Bar",
  kettlebell: "Kettlebell",
  bodyweight_only: "Bodyweight Only",
  cardio_machines: "Cardio Machines",
};

export function EquipmentAccessStep({
  defaultValues,
  onSubmit,
  onBack,
}: EquipmentAccessStepProps) {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<EquipmentAccessData>({
    resolver: zodResolver(equipmentAccessSchema),
    defaultValues: {
      availableEquipment: [],
      ...defaultValues,
    },
  });

  const selected = watch("availableEquipment") ?? [];

  function toggle(item: (typeof equipmentOptions)[number]) {
    const next = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item];
    setValue("availableEquipment", next, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout
        title="Equipment Access"
        description="What equipment do you have access to? Select all that apply."
        onBack={onBack}
      >
        <div className="space-y-3">
          <div
            className="grid grid-cols-2 gap-2"
            role="group"
            aria-label="Available equipment"
          >
            {equipmentOptions.map((item) => (
              <Button
                key={item}
                type="button"
                variant={selected.includes(item) ? "default" : "outline"}
                className="h-auto justify-start px-4 py-3"
                onClick={() => toggle(item)}
                aria-pressed={selected.includes(item)}
              >
                {EQUIPMENT_LABELS[item]}
              </Button>
            ))}
          </div>
          {errors.availableEquipment && (
            <p className="text-sm text-destructive" role="alert">
              {errors.availableEquipment.message}
            </p>
          )}
        </div>
      </StepLayout>
    </form>
  );
}
