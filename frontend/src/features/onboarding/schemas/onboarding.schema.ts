import { z } from "zod";
import { bodyDetailsSchema } from "./body-details.schema";
import { goalSelectionSchema } from "./goal-selection.schema";
import { activityScheduleSchema } from "./activity-schedule.schema";
import { equipmentAccessSchema } from "./equipment-access.schema";
import { injuryRestrictionsSchema } from "./injury-restrictions.schema";
import { dietPreferenceSchema } from "./diet-preference.schema";

export const onboardingSchema = bodyDetailsSchema
  .merge(goalSelectionSchema)
  .merge(activityScheduleSchema)
  .merge(equipmentAccessSchema)
  .merge(injuryRestrictionsSchema)
  .merge(dietPreferenceSchema);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const ONBOARDING_STEPS = [
  { id: "body-details", label: "Body Details" },
  { id: "goal-selection", label: "Goals" },
  { id: "activity-schedule", label: "Activity" },
  { id: "equipment-access", label: "Equipment" },
  { id: "injury-restrictions", label: "Injuries" },
  { id: "diet-preference", label: "Diet" },
  { id: "summary", label: "Summary" },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];
