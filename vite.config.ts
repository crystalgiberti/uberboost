import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      try {
        // Dynamically import the server only during development
        const { createServer } = await import("./server/index.js");
        const app = createServer();

        console.log("🚀 Express server created successfully");

        // Add Express app as middleware to Vite dev server
        // Mount it before Vite's internal middleware to handle API routes first
        server.middlewares.use((req, res, next) => {
          // Only let Express handle API routes
          if (req.url?.startsWith("/api/")) {
            console.log(`🔄 Routing ${req.method} ${req.url} to Express`);
            app(req, res, next);
          } else {
            next();
          }
        });
      } catch (error) {
        console.error("❌ Failed to create Express server:", error);
      }
    },
  };
}
