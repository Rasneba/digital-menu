import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  /* The Arena preview proxy serves the app from a generated subdomain —
     don't reject its Host header. */
  server: { allowedHosts: true },
  preview: { allowedHosts: true },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
