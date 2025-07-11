import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { queries } from "../database.js";
import { z } from "zod";
import { AuthenticatedRequest } from "../auth/middleware.js";

const createVehicleSchema = z.object({
  year: z
    .number()
    .min(1990)
    .max(new Date().getFullYear() + 1),
  make: z.string().min(1),
  model: z.string().min(1),
  color: z.string().min(1),
  licensePlate: z.string().min(1),
  mileage: z.number().min(0).default(0),
  fuelType: z.enum(["gas", "hybrid", "electric"]).default("gas"),
  mpg: z.number().min(1).max(100).default(25),
  isActive: z.boolean().default(true),
});

const updateVehicleSchema = createVehicleSchema.partial();

const createMaintenanceSchema = z.object({
  type: z.enum([
    "oil_change",
    "tire_rotation",
    "inspection",
    "repair",
    "other",
  ]),
  description: z.string().min(1),
  date: z.string(),
  mileage: z.number().min(0),
  cost: z.number().min(0),
  location: z.string().min(1),
  nextDue: z.number().optional(),
});

export const handleCreateVehicle: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const vehicleData = createVehicleSchema.parse(req.body);

    const vehicleId = uuidv4();

    queries.createVehicle.run(
      vehicleId,
      user.id,
      vehicleData.year,
      vehicleData.make,
      vehicleData.model,
      vehicleData.color,
      vehicleData.licensePlate,
      vehicleData.mileage,
      vehicleData.fuelType,
      vehicleData.mpg,
      vehicleData.isActive ? 1 : 0,
    );

    const createdVehicle = queries.getUserVehicles.all(user.id)[0];

    res.status(201).json(createdVehicle);
  } catch (error) {
    console.error("Create vehicle error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create vehicle" });
  }
};

export const handleGetVehicles: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const vehicles = queries.getUserVehicles.all(user.id);

    res.json(vehicles);
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

export const handleUpdateVehicle: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const vehicleId = req.params.id;
    const updateData = updateVehicleSchema.parse(req.body);

    // Get existing vehicle to merge data
    const existingVehicles = queries.getUserVehicles.all(user.id);
    const existingVehicle = existingVehicles.find(
      (v: any) => v.id === vehicleId,
    );

    if (!existingVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const mergedData = { ...existingVehicle, ...updateData };

    const result = queries.updateVehicle.run(
      mergedData.year,
      mergedData.make,
      mergedData.model,
      mergedData.color,
      mergedData.license_plate || mergedData.licensePlate,
      mergedData.mileage,
      mergedData.fuel_type || mergedData.fuelType,
      mergedData.mpg,
      mergedData.is_active !== undefined
        ? mergedData.is_active
        : mergedData.isActive
          ? 1
          : 0,
      vehicleId,
      user.id,
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const updatedVehicles = queries.getUserVehicles.all(user.id);
    const updatedVehicle = updatedVehicles.find((v: any) => v.id === vehicleId);

    res.json(updatedVehicle);
  } catch (error) {
    console.error("Update vehicle error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update vehicle" });
  }
};

export const handleDeleteVehicle: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const vehicleId = req.params.id;

    const result = queries.deleteVehicle.run(vehicleId, user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
};

export const handleCreateMaintenanceRecord: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const vehicleId = req.params.vehicleId;
    const maintenanceData = createMaintenanceSchema.parse(req.body);

    // Verify vehicle belongs to user
    const userVehicles = queries.getUserVehicles.all(user.id);
    const vehicle = userVehicles.find((v: any) => v.id === vehicleId);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const recordId = uuidv4();

    queries.createMaintenanceRecord.run(
      recordId,
      vehicleId,
      maintenanceData.type,
      maintenanceData.description,
      maintenanceData.date,
      maintenanceData.mileage,
      maintenanceData.cost,
      maintenanceData.location,
      maintenanceData.nextDue || null,
    );

    const records = queries.getVehicleMaintenanceRecords.all(vehicleId);
    const createdRecord = records[0];

    res.status(201).json(createdRecord);
  } catch (error) {
    console.error("Create maintenance record error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create maintenance record" });
  }
};

export const handleGetMaintenanceRecords: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const vehicleId = req.params.vehicleId;

    // Verify vehicle belongs to user
    const userVehicles = queries.getUserVehicles.all(user.id);
    const vehicle = userVehicles.find((v: any) => v.id === vehicleId);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const records = queries.getVehicleMaintenanceRecords.all(vehicleId);

    res.json(records);
  } catch (error) {
    console.error("Get maintenance records error:", error);
    res.status(500).json({ error: "Failed to fetch maintenance records" });
  }
};

export const handleGetVehicleStats: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const vehicleId = req.params.vehicleId;

    // Verify vehicle belongs to user
    const userVehicles = queries.getUserVehicles.all(user.id);
    const vehicle = userVehicles.find((v: any) => v.id === vehicleId);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Get maintenance records for cost calculation
    const maintenanceRecords =
      queries.getVehicleMaintenanceRecords.all(vehicleId);
    const totalMaintenanceCost = maintenanceRecords.reduce(
      (sum: number, record: any) => sum + record.cost,
      0,
    );

    // Estimate fuel costs based on mileage and MPG
    const avgGasPrice = 3.5; // Could be made dynamic
    const estimatedFuelCost = (vehicle.mileage / vehicle.mpg) * avgGasPrice;

    // Get ride count for this vehicle
    const rideCount = queries.db
      .prepare("SELECT COUNT(*) as count FROM rides WHERE vehicle_id = ?")
      .get(vehicleId) as any;

    res.json({
      vehicle,
      stats: {
        totalMaintenanceCost,
        estimatedFuelCost,
        rideCount: rideCount.count,
        maintenanceRecordsCount: maintenanceRecords.length,
        costPerMile:
          vehicle.mileage > 0
            ? (totalMaintenanceCost + estimatedFuelCost) / vehicle.mileage
            : 0,
      },
      maintenanceRecords,
    });
  } catch (error) {
    console.error("Get vehicle stats error:", error);
    res.status(500).json({ error: "Failed to fetch vehicle statistics" });
  }
};
