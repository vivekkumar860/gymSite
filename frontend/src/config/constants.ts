// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ---------------------------------------------------------------------------
// TanStack Query stale times (in milliseconds)
// ---------------------------------------------------------------------------
export const STALE_TIME_SHORT = 30 * 1000; // 30 seconds
export const STALE_TIME_MEDIUM = 5 * 60 * 1000; // 5 minutes
export const STALE_TIME_LONG = 30 * 60 * 1000; // 30 minutes

// ---------------------------------------------------------------------------
// Date format strings
// ---------------------------------------------------------------------------
export const DATE_FORMAT = "yyyy-MM-dd";
export const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export const DISPLAY_DATE_FORMAT = "MMM d, yyyy";
export const DISPLAY_DATE_TIME_FORMAT = "MMM d, yyyy h:mm a";
export const TIME_FORMAT = "HH:mm";

// ---------------------------------------------------------------------------
// Workout-specific constants
// ---------------------------------------------------------------------------
export const MAX_SETS_PER_EXERCISE = 20;
export const MAX_EXERCISES_PER_WORKOUT = 30;
export const REST_TIMER_DEFAULT_SECONDS = 90;
export const REST_TIMER_MIN_SECONDS = 10;
export const REST_TIMER_MAX_SECONDS = 600;
export const MAX_REPS_PER_SET = 999;
export const MAX_WEIGHT_KG = 1000;
export const MAX_WEIGHT_LBS = 2200;
export const DEFAULT_WEIGHT_INCREMENT_KG = 2.5;
export const DEFAULT_WEIGHT_INCREMENT_LBS = 5;

// ---------------------------------------------------------------------------
// Nutrition constants
// ---------------------------------------------------------------------------
export const DEFAULT_CALORIE_GOAL = 2000;
export const MAX_MEALS_PER_DAY = 10;
export const MACROS = {
  PROTEIN: "protein",
  CARBS: "carbs",
  FAT: "fat",
} as const;

// ---------------------------------------------------------------------------
// Habit tracking
// ---------------------------------------------------------------------------
export const MAX_HABITS = 20;
export const STREAK_GRACE_PERIOD_HOURS = 36;

// ---------------------------------------------------------------------------
// Progress / measurements
// ---------------------------------------------------------------------------
export const MAX_PROGRESS_PHOTOS_PER_ENTRY = 5;
export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ---------------------------------------------------------------------------
// General UI
// ---------------------------------------------------------------------------
export const TOAST_DURATION_MS = 5000;
export const DEBOUNCE_DELAY_MS = 300;
export const ANIMATION_DURATION_MS = 200;
