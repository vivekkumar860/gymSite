/** Discriminated union for AI output validation results. */
export type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; reason: string };
