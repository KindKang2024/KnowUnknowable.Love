import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import glsl from "vite-plugin-glsl";

export default defineConfig(({ mode }) => ({
  esbuild: {
    drop: ['console', 'debugger'],
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/open': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
    react(),
    glsl(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.bin"],
}));
