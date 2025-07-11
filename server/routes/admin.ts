import { RequestHandler } from "express";
import { AuthService } from "../auth/authService";

// Admin Dashboard Analytics
export const getAdminAnalytics: RequestHandler = async (req, res) => {
  try {
    const adminUserId = req.user?.userId;
    if (!adminUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const analytics = await AuthService.getSubscriptionAnalytics(adminUserId);
    res.json(analytics);
  } catch (error) {
    res.status(403).json({ error: (error as Error).message });
  }
};

// Get all users
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const adminUserId = req.user?.userId;
    if (!adminUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const users = await AuthService.getAllUsers(adminUserId);
    res.json(users);
  } catch (error) {
    res.status(403).json({ error: (error as Error).message });
  }
};

// Update user subscription
export const updateUserSubscription: RequestHandler = async (req, res) => {
  try {
    const adminUserId = req.user?.userId;
    const { userId } = req.params;
    const { subscriptionStatus, subscriptionPlan, durationMonths } = req.body;

    if (!adminUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify admin permissions
    const admin = await AuthService.getUserById(adminUserId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    if (subscriptionStatus === "active" && durationMonths) {
      const updatedUser = await AuthService.activateSubscription(
        userId,
        subscriptionPlan,
        durationMonths,
      );
      res.json(updatedUser);
    } else {
      const updatedUser = await AuthService.updateProfile(userId, {
        subscriptionStatus,
        subscriptionPlan,
      });
      res.json(updatedUser);
    }
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get system health metrics
export const getSystemHealth: RequestHandler = async (req, res) => {
  try {
    const adminUserId = req.user?.userId;
    if (!adminUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const admin = await AuthService.getUserById(adminUserId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Mock system health data (in production, collect real metrics)
    const healthMetrics = {
      serverStatus: "healthy",
      apiStatus: {
        weather: "operational",
        traffic: "operational",
        events: "operational",
        flights: "degraded",
      },
      databaseStatus: "healthy",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      activeConnections: Math.floor(Math.random() * 100) + 50,
      requestsPerMinute: Math.floor(Math.random() * 500) + 200,
      errorRate: Math.random() * 2, // Percentage
      averageResponseTime: Math.floor(Math.random() * 200) + 50, // ms
    };

    res.json(healthMetrics);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Export app usage analytics
export const getUsageAnalytics: RequestHandler = async (req, res) => {
  try {
    const adminUserId = req.user?.userId;
    if (!adminUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const admin = await AuthService.getUserById(adminUserId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Mock usage analytics (in production, collect from actual usage)
    const usageData = {
      totalRidesLogged: Math.floor(Math.random() * 10000) + 5000,
      averageRidesPerUser: Math.floor(Math.random() * 50) + 20,
      mostUsedFeatures: [
        { feature: "Surge Navigation", usage: 85 },
        { feature: "Ride Logger", usage: 78 },
        { feature: "Gas Stations", usage: 65 },
        { feature: "Analytics", usage: 42 },
        { feature: "Schedule", usage: 38 },
      ],
      cityUsage: [
        { city: "Jacksonville", users: 45, percentage: 35 },
        { city: "Miami", users: 38, percentage: 30 },
        { city: "Orlando", users: 25, percentage: 20 },
        { city: "Tampa", users: 19, percentage: 15 },
      ],
      deviceTypes: {
        mobile: 78,
        desktop: 15,
        tablet: 7,
      },
      peakUsageHours: [
        { hour: "07:00", users: 65 },
        { hour: "08:00", users: 89 },
        { hour: "09:00", users: 45 },
        { hour: "17:00", users: 78 },
        { hour: "18:00", users: 92 },
        { hour: "19:00", users: 67 },
      ],
    };

    res.json(usageData);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Send notification to all users
export const sendBroadcastNotification: RequestHandler = async (req, res) => {
  try {
    const adminUserId = req.user?.userId;
    const { title, message, type, targetGroup } = req.body;

    if (!adminUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const admin = await AuthService.getUserById(adminUserId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Mock notification sending (in production, use push notification service)
    const notification = {
      id: `notification_${Date.now()}`,
      title,
      message,
      type,
      targetGroup,
      sentAt: new Date(),
      sentBy: admin.email,
    };

    // Log notification for audit
    console.log("Broadcast notification sent:", notification);

    res.json({
      success: true,
      notification,
      recipientCount: targetGroup === "all" ? 128 : 45, // Mock recipient count
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
