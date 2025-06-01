import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,

        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});
