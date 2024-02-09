/// <reference types="vitest" />
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
    // server: { deps: { inline: ["lodash"] } },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000/",
      },
    },
  },
});
