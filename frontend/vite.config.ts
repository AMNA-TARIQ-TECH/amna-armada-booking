import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("recharts") ||
            id.includes("/d3-") ||
            id.includes("victory-vendor") ||
            id.includes("@reduxjs") ||
            id.includes("react-redux") ||
            id.includes("redux") ||
            id.includes("reselect") ||
            id.includes("immer")
          ) {
            return "charts";
          }
          if (id.includes("react-router") || id.includes("@remix-run")) {
            return "router";
          }
          if (
            id.includes("react-dom") ||
            id.includes("/react/") ||
            id.includes("scheduler")
          ) {
            return "react";
          }
        },
      },
    },
  },
});
