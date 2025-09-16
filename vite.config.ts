import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "./example",
  resolve: {
    alias: {
      "@dotjs/framework": path.resolve(__dirname, "framework/src"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
    hmr: false,
  },
});
