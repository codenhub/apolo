import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { deferCssPlugin, i18nValidatePlugin, iconsPlugin } from "./plugins/vite";
import { LOCALE_MANIFEST } from "./src/ui/scripts/i18n/manifest";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  root: "./src",
  publicDir: "./public",
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [tailwindcss(), iconsPlugin(), i18nValidatePlugin({ localeManifest: LOCALE_MANIFEST }), deferCssPlugin()],
  // Prevent Vite from obscuring rust errors
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // Tell Vite to ignore watching tauri directory
      ignored: ["**/tauri/**"],
    },
  },
}));
