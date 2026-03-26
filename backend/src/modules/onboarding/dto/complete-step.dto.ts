import { z } from 'zod';

const ONBOARDING_STEP_VALUES = [
  'PROFILE_CREATED',
  'GOAL_SELECTED',
  'FITNESS_LEVEL_SET',
  'FIRST_PLAN_CREATED',
  'FIRST_SESSION_LOGGED',
] as const;

/** Zod schema for completing an onboarding step. */
export const CompleteStepSchema = z.object({
  step: z.enum(ONBOARDING_STEP_VALUES),
});

export type CompleteStepDto = z.infer<typeof CompleteStepSchema>;

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEP_VALUES.length;
