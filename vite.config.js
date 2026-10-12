import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["embla-carousel-react"],
  },
  build: {
    chunkSizeWarningLimit: 1200,
    // NOTE: no custom manualChunks here. A previous config split React into a
    // "react-vendor" chunk while React-dependent packages (sonner,
    // use-sync-external-store via recharts, embla) landed in other chunks.
    // Those cross-chunk cycles made modules evaluate before React was
    // initialized ("Cannot access before initialization", "Cannot set
    // properties of undefined"). Vite's default chunking keeps a safe order.
  },
  base: "/Car_Rentals_Services/",
});
