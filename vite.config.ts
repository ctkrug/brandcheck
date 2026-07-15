/// <reference types="vitest/config" />
import { defineConfig } from "vite";

// Relative base so the built site works from any subpath
// (e.g. apps.charliekrug.com/brandcheck) with no server-side rewriting.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/scorer.ts", "src/urlState.ts"],
    },
  },
});
