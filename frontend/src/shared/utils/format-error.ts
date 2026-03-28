const NETWORK_ERROR_PATTERNS = [
  "Failed to fetch",
  "NetworkError",
  "Network request failed",
  "Load failed",
];

/**
 * Convert a raw error into a user-friendly message.
 * Replaces cryptic browser network errors with a clear message.
 */
export function formatErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    message = (error as { message: string }).message;
  } else {
    return fallback;
  }

  if (NETWORK_ERROR_PATTERNS.some((p) => message.includes(p))) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  return message || fallback;
}
