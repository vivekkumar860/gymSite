import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Import boundary rules
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/components/*", "@/features/*/containers/*", "@/features/*/hooks/*", "@/features/*/schemas/*"],
              message: "Import from the feature barrel (e.g., @/features/workout) instead of reaching into internal files.",
            },
          ],
        },
      ],
    },
  },
  // Feature files cannot import from other features
  {
    files: ["src/features/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/components/*", "@/features/*/containers/*", "@/features/*/hooks/*", "@/features/*/schemas/*"],
              message: "Import from the feature barrel (e.g., @/features/workout) instead of reaching into internal files.",
            },
          ],
        },
      ],
    },
  },
  // Shared layer cannot import from features or api
  {
    files: ["src/shared/**/*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*"],
              message: "Shared layer cannot import from features.",
            },
            {
              group: ["@/api/*"],
              message: "Shared layer cannot import from the API layer.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
