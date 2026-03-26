import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { AiCapability } from '../types/index.js';
import type { ValidationResult } from '../types/index.js';
import { workoutSuggestionSchema } from './schemas/workout-suggestion.schema.js';
import { mealSwapSuggestionSchema } from './schemas/meal-swap-suggestion.schema.js';
import { progressSummarySchema } from './schemas/progress-summary.schema.js';
import { recoverySuggestionSchema } from './schemas/recovery-suggestion.schema.js';
import { motivationalSummarySchema } from './schemas/motivational-summary.schema.js';

/** Words/phrases that indicate unsafe medical or health claims. */
const SAFETY_BLOCKLIST = [
  'diagnos',
  'prescri',
  'you should take',
  'supplement',
  'steroid',
  'medication',
  'guaranteed results',
  'you will lose',
  'you will gain',
  'cure',
  'treat disease',
  'medical advice',
  'consult your doctor about taking',
];

/**
 * Validates raw LLM output against structural schemas and safety rules.
 *
 * Every AI response must pass through this validator before reaching
 * application services. Failed validation returns a typed `Invalid` result
 * so callers can fall back to deterministic defaults.
 */
@Injectable()
export class OutputValidatorService {
  private readonly logger = new Logger(OutputValidatorService.name);

  private readonly schemas: Record<AiCapability, z.ZodSchema> = {
    [AiCapability.WORKOUT_ADJUSTMENT]: workoutSuggestionSchema,
    [AiCapability.MEAL_SWAP]: mealSwapSuggestionSchema,
    [AiCapability.PROGRESS_SUMMARY]: progressSummarySchema,
    [AiCapability.MISSED_WORKOUT_RECOVERY]: recoverySuggestionSchema,
    [AiCapability.MOTIVATIONAL_SUMMARY]: motivationalSummarySchema,
  };

  /** Validate raw LLM output string for a given capability. */
  validate<T>(
    capability: AiCapability,
    rawOutput: string,
  ): ValidationResult<T> {
    // Step 1: Parse JSON
    const parseResult = this.parseJson(rawOutput);
    if (!parseResult.valid) return parseResult;

    // Step 2: Safety check
    const safetyResult = this.checkSafety(rawOutput);
    if (!safetyResult.valid) return safetyResult;

    // Step 3: Schema validation
    return this.validateSchema<T>(capability, parseResult.data);
  }

  /** Attempt to parse raw string as JSON. */
  private parseJson(raw: string): ValidationResult<unknown> {
    try {
      const data = JSON.parse(raw);
      return { valid: true, data };
    } catch {
      this.logger.warn('AI output is not valid JSON');
      return { valid: false, reason: 'Output is not valid JSON' };
    }
  }

  /** Check raw output against the safety blocklist. */
  private checkSafety(raw: string): ValidationResult<never> {
    const lower = raw.toLowerCase();
    const violation = SAFETY_BLOCKLIST.find((term) => lower.includes(term));

    if (violation) {
      this.logger.warn(`Safety violation detected: "${violation}"`);
      return {
        valid: false,
        reason: `Safety violation: contains blocked term "${violation}"`,
      };
    }

    return { valid: true, data: undefined as never };
  }

  /** Validate parsed data against the Zod schema for this capability. */
  private validateSchema<T>(
    capability: AiCapability,
    data: unknown,
  ): ValidationResult<T> {
    const schema = this.schemas[capability];
    const result = schema.safeParse(data);

    if (!result.success) {
      const issues = result.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ');
      this.logger.warn(`Schema validation failed for ${capability}: ${issues}`);
      return { valid: false, reason: `Schema validation failed: ${issues}` };
    }

    return { valid: true, data: result.data as T };
  }
}
