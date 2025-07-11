import express from "express";
import cors from "cors";
import { initializeDatabase } from "./database.js";
import { requireAuth, optionalAuth } from "./auth/middleware.js";

// Route imports
import { handleDemo } from "./routes/demo.js";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleMe,
} from "./routes/auth.js";
import {
  handleCreateRide,
  handleGetRides,
  handleGetRideStats,
  handleDeleteRide,
  handleBulkCreateRides,
  handleExportRides,
} from "./routes/rides.js";
import {
  handleCreateVehicle,
  handleGetVehicles,
  handleUpdateVehicle,
  handleDeleteVehicle,
  handleCreateMaintenanceRecord,
  handleGetMaintenanceRecords,
  handleGetVehicleStats,
} from "./routes/vehicles.js";
import {
  handleGetProfile,
  handleUpdateProfile,
  handleGetSettings,
  handleUpdateSettings,
  handleGetDashboard,
  handleDeleteAccount,
} from "./routes/users.js";

export function createServer() {
  const app = express();

  // Initialize database only when actually running the server
  if (process.env.NODE_ENV !== "build") {
    try {
      initializeDatabase();
    } catch (error) {
      console.error("Database initialization failed:", error);
      // In production, you might want to exit, but for development we continue
      if (process.env.NODE_ENV === "production") {
        process.exit(1);
      }
    }
  }

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Uber Boost API v1.0",
      timestamp: new Date().toISOString(),
    });
  });

  // Test endpoint for debugging
  app.get("/api/test", (_req, res) => {
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  // Test POST endpoint
  app.post("/api/test", (req, res) => {
    res.json({
      status: "ok",
      received: req.body,
      timestamp: new Date().toISOString(),
    });
  });

  // Demo route (keeping for backward compatibility)
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", requireAuth, handleLogout);
  app.get("/api/auth/me", requireAuth, handleMe);

  // User routes
  app.get("/api/users/profile", requireAuth, handleGetProfile);
  app.put("/api/users/profile", requireAuth, handleUpdateProfile);
  app.get("/api/users/settings", requireAuth, handleGetSettings);
  app.put("/api/users/settings", requireAuth, handleUpdateSettings);
  app.get("/api/users/dashboard", requireAuth, handleGetDashboard);
  app.delete("/api/users/account", requireAuth, handleDeleteAccount);

  // Ride routes
  app.post("/api/rides", requireAuth, handleCreateRide);
  app.post("/api/rides/bulk", requireAuth, handleBulkCreateRides);
  app.get("/api/rides", requireAuth, handleGetRides);
  app.get("/api/rides/stats", requireAuth, handleGetRideStats);
  app.get("/api/rides/export", requireAuth, handleExportRides);
  app.delete("/api/rides/:id", requireAuth, handleDeleteRide);

  // Vehicle routes
  app.post("/api/vehicles", requireAuth, handleCreateVehicle);
  app.get("/api/vehicles", requireAuth, handleGetVehicles);
  app.put("/api/vehicles/:id", requireAuth, handleUpdateVehicle);
  app.delete("/api/vehicles/:id", requireAuth, handleDeleteVehicle);
  app.get("/api/vehicles/:vehicleId/stats", requireAuth, handleGetVehicleStats);

  // Maintenance routes
  app.post(
    "/api/vehicles/:vehicleId/maintenance",
    requireAuth,
    handleCreateMaintenanceRecord,
  );
  app.get(
    "/api/vehicles/:vehicleId/maintenance",
    requireAuth,
    handleGetMaintenanceRecords,
  );

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Server error:", err);
      res.status(500).json({ error: "Internal server error" });
    },
  );

  // 404 handler
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  console.log("Uber Boost API server initialized with database persistence");

  return app;
}
