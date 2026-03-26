"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldWrapper } from "@/shared/components/form-field-wrapper";
import { StepLayout } from "./step-layout";
import {
  injuryRestrictionsSchema,
  bodyAreas,
  type InjuryRestrictionsData,
} from "../schemas/injury-restrictions.schema";

type InjuryRestrictionsStepProps = {
  defaultValues: Partial<InjuryRestrictionsData>;
  onSubmit: (data: InjuryRestrictionsData) => void;
  onBack: () => void;
};

const BODY_AREA_LABELS: Record<(typeof bodyAreas)[number], string> = {
  shoulders: "Shoulders",
  back: "Back",
  knees: "Knees",
  wrists: "Wrists",
  ankles: "Ankles",
  hips: "Hips",
  neck: "Neck",
  elbows: "Elbows",
};

export function InjuryRestrictionsStep({
  defaultValues,
  onSubmit,
  onBack,
}: InjuryRestrictionsStepProps) {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<InjuryRestrictionsData>({
    resolver: zodResolver(injuryRestrictionsSchema),
    defaultValues: {
      hasInjuries: false,
      injuredAreas: [],
      ...defaultValues,
    },
  });

  const hasInjuries = watch("hasInjuries");
  const injuredAreas = watch("injuredAreas") ?? [];

  function toggleArea(area: (typeof bodyAreas)[number]) {
    const next = injuredAreas.includes(area)
      ? injuredAreas.filter((a) => a !== area)
      : [...injuredAreas, area];
    setValue("injuredAreas", next);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <StepLayout
        title="Injuries & Restrictions"
        description="Let us know if you have any injuries so we can adjust recommendations."
        onBack={onBack}
      >
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant={!hasInjuries ? "default" : "outline"}
              onClick={() => {
                setValue("hasInjuries", false);
                setValue("injuredAreas", []);
                setValue("injuryNotes", "");
              }}
              aria-pressed={!hasInjuries}
            >
              No injuries
            </Button>
            <Button
              type="button"
              variant={hasInjuries ? "default" : "outline"}
              onClick={() => setValue("hasInjuries", true)}
              aria-pressed={hasInjuries}
            >
              I have injuries
            </Button>
          </div>

          {hasInjuries && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium">Affected Areas</span>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Injured body areas"
                >
                  {bodyAreas.map((area) => (
                    <Button
                      key={area}
                      type="button"
                      variant={
                        injuredAreas.includes(area) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleArea(area)}
                      aria-pressed={injuredAreas.includes(area)}
                    >
                      {BODY_AREA_LABELS[area]}
                    </Button>
                  ))}
                </div>
              </div>

              <FormFieldWrapper
                label="Additional notes (optional)"
                error={errors.injuryNotes?.message}
                htmlFor="injuryNotes"
              >
                <Textarea
                  id="injuryNotes"
                  placeholder="Describe any specific limitations..."
                  rows={3}
                  {...register("injuryNotes")}
                />
              </FormFieldWrapper>
            </div>
          )}
        </div>
      </StepLayout>
    </form>
  );
}
