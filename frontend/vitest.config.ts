import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
    env: {
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:3001/api",
      NEXT_PUBLIC_APP_NAME: "FitTrack",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
