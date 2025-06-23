import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  server: {
    proxy: {
      "/api": {
        target: "https://mern-estate-backend-tped.vercel.app",
        changeOrigin: true,
        secure: false,
        // ❌ Don't strip the /api prefix
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
