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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("recharts")) return "charts";
            // Keep every React-dependent library in the same chunk as React.
            // Splitting them apart (e.g. sonner in "vendor") lets a module run
            // before React is initialized: "Cannot access before initialization".
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router") ||
              id.includes("sonner") ||
              id.includes("next-themes")
            )
              return "react-vendor";
            return "vendor";
          }
        },
      },
    },
  },
  base: "/Car_Rentals_Services/",
});
