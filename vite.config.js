import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/", 
  server: {
    proxy: {
      "/api": {
        target: "https://mern-estate-backend-pied.vercel.app/",
        changeOrigin: true,
        secure: false,
         rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  plugins: [react(), tailwindcss()],
});
