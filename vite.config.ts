import { defineConfig } from "vite";

// Relative base so the built site works from any subpath
// (e.g. apps.charliekrug.com/brandcheck) with no server-side rewriting.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
});
