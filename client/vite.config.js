import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/", // Ensure base is set for Vercel deployment
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["echoboard.dev", "localhost", "127.0.0.1"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Ensure the output directory is 'dist'
  },
});
