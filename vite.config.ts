import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  plugins: [
    react(),
    runtimeErrorOverlay(),
    // If you want to use the cartographer plugin conditionally,
    // handle it differently (not with await inside plugins array).
    // For now, comment this out to avoid syntax errors:
    // ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
    //   ? [await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer())]
    //   : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
