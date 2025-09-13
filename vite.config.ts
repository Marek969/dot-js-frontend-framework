import { defineConfig } from "vite";

export default defineConfig({
  root: "./example",
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
