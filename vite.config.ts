import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      globals: {
        Buffer: true, // Enables Buffer polyfill
      },
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
  define: {
    global: "window", // Fixes "global is not defined" issue
  },
});
