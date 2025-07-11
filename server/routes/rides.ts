import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { queries } from "../database.js";
import { z } from "zod";
import { AuthenticatedRequest } from "../auth/middleware.js";

const createRideSchema = z.object({
  vehicleId: z.string().optional(),
  date: z.string(),
  time: z.string(),
  pickupLocation: z.string().min(1),
  dropoffLocation: z.string().min(1),
  rideType: z.enum(["UberX", "UberXL", "Uber Pool", "Uber Black"]),
  earnings: z.number().min(0),
  surge: z.number().min(1).default(1.0),
  duration: z.number().min(0).default(0),
  distance: z.number().min(0).default(0),
  tips: z.number().min(0).default(0),
  notes: z.string().optional(),
  source: z.enum(["manual", "voice", "import"]).default("manual"),
});

const updateRideSchema = createRideSchema.partial();

export const handleCreateRide: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const rideData = createRideSchema.parse(req.body);

    const rideId = uuidv4();

    queries.createRide.run(
      rideId,
      user.id,
      rideData.vehicleId || null,
      rideData.date,
      rideData.time,
      rideData.pickupLocation,
      rideData.dropoffLocation,
      rideData.rideType,
      rideData.earnings,
      rideData.surge,
      rideData.duration,
      rideData.distance,
      rideData.tips,
      rideData.notes || null,
      rideData.source,
    );

    const createdRide = queries.getUserRides.get(user.id, 1, 0);

    res.status(201).json(createdRide);
  } catch (error) {
    console.error("Create ride error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create ride" });
  }
};

export const handleGetRides: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const rides = queries.getUserRides.all(user.id, limit, offset);

    res.json({
      rides,
      pagination: {
        page,
        limit,
        hasMore: rides.length === limit,
      },
    });
  } catch (error) {
    console.error("Get rides error:", error);
    res.status(500).json({ error: "Failed to fetch rides" });
  }
};

export const handleGetRideStats: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const period = (req.query.period as string) || "30"; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    const startDateStr = startDate.toISOString().split("T")[0];

    const stats = queries.getUserRideStats.get(user.id, startDateStr);

    // Get today's stats
    const todayStr = new Date().toISOString().split("T")[0];
    const todayStats = queries.getUserRideStats.get(user.id, todayStr);

    res.json({
      period: {
        days: parseInt(period),
        ...stats,
      },
      today: todayStats,
    });
  } catch (error) {
    console.error("Get ride stats error:", error);
    res.status(500).json({ error: "Failed to fetch ride statistics" });
  }
};

export const handleDeleteRide: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const rideId = req.params.id;

    const result = queries.deleteRide.run(rideId, user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }

    res.json({ message: "Ride deleted successfully" });
  } catch (error) {
    console.error("Delete ride error:", error);
    res.status(500).json({ error: "Failed to delete ride" });
  }
};

export const handleBulkCreateRides: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const ridesData = z.array(createRideSchema).parse(req.body);

    const createBulk = queries.db.transaction((rides) => {
      for (const rideData of rides) {
        const rideId = uuidv4();
        queries.createRide.run(
          rideId,
          user.id,
          rideData.vehicleId || null,
          rideData.date,
          rideData.time,
          rideData.pickupLocation,
          rideData.dropoffLocation,
          rideData.rideType,
          rideData.earnings,
          rideData.surge,
          rideData.duration,
          rideData.distance,
          rideData.tips,
          rideData.notes || null,
          rideData.source,
        );
      }
    });

    createBulk(ridesData);

    res.status(201).json({
      message: `Successfully created ${ridesData.length} rides`,
      count: ridesData.length,
    });
  } catch (error) {
    console.error("Bulk create rides error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create rides" });
  }
};

export const handleExportRides: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const format = (req.query.format as string) || "csv";

    // Get all rides for export
    const rides = queries.getUserRides.all(user.id, 10000, 0);

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "Date",
        "Time",
        "Pickup Location",
        "Dropoff Location",
        "Ride Type",
        "Earnings",
        "Surge",
        "Duration",
        "Distance",
        "Tips",
        "Notes",
        "Source",
      ];

      const csvContent = [
        headers.join(","),
        ...rides.map((ride: any) =>
          [
            ride.date,
            ride.time,
            `"${ride.pickup_location}"`,
            `"${ride.dropoff_location}"`,
            ride.ride_type,
            ride.earnings,
            ride.surge,
            ride.duration,
            ride.distance,
            ride.tips,
            `"${ride.notes || ""}"`,
            ride.source,
          ].join(","),
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=uber-rides-${new Date().toISOString().split("T")[0]}.csv`,
      );
      res.send(csvContent);
    } else {
      // JSON format
      res.json(rides);
    }
  } catch (error) {
    console.error("Export rides error:", error);
    res.status(500).json({ error: "Failed to export rides" });
  }
};
