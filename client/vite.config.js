import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/prueba/", // el gateway lo monta en /prueba
  server: {
    proxy: { "/prueba/servidor": "http://localhost:4001" },
  },
});
