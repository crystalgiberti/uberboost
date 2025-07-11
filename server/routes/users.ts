import { RequestHandler } from "express";
import { queries } from "../database.js";
import { z } from "zod";
import { AuthenticatedRequest } from "../auth/middleware.js";

const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
});

const updateSettingsSchema = z.object({
  dailyGoal: z.number().min(0).optional(),
  preferredSurgeMin: z.number().min(1).optional(),
  maxDriveDistance: z.number().min(1).optional(),
  notificationsEnabled: z.boolean().optional(),
  voiceEnabled: z.boolean().optional(),
  darkMode: z.boolean().optional(),
  settingsJson: z.record(z.any()).optional(),
});

export const handleGetProfile: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const fullUser = queries.getUserById.get(user.id);

    if (!fullUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(fullUser);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const handleUpdateProfile: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const updateData = updateProfileSchema.parse(req.body);

    // Get current user data
    const currentUser = queries.getUserById.get(user.id) as any;
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Merge with existing data
    const mergedData = {
      firstName: updateData.firstName ?? currentUser.first_name,
      lastName: updateData.lastName ?? currentUser.last_name,
      phone: updateData.phone ?? currentUser.phone,
      city: updateData.city ?? currentUser.city,
    };

    queries.updateUser.run(
      mergedData.firstName,
      mergedData.lastName,
      mergedData.phone,
      mergedData.city,
      user.id,
    );

    const updatedUser = queries.getUserById.get(user.id);
    res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const handleGetSettings: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    let settings = queries.getUserSettings.get(user.id) as any;

    if (!settings) {
      // Create default settings if they don't exist
      queries.upsertUserSettings.run(
        user.id,
        150, // daily_goal
        1.5, // preferred_surge_min
        10, // max_drive_distance
        1, // notifications_enabled
        1, // voice_enabled
        0, // dark_mode
        JSON.stringify({}), // settings_json
      );

      settings = queries.getUserSettings.get(user.id);
    }

    // Parse settings_json
    const parsedSettings = {
      ...settings,
      settings_json: settings.settings_json
        ? JSON.parse(settings.settings_json)
        : {},
    };

    res.json(parsedSettings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

export const handleUpdateSettings: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;
    const updateData = updateSettingsSchema.parse(req.body);

    // Get current settings
    let currentSettings = queries.getUserSettings.get(user.id) as any;

    if (!currentSettings) {
      // Create default settings
      currentSettings = {
        user_id: user.id,
        daily_goal: 150,
        preferred_surge_min: 1.5,
        max_drive_distance: 10,
        notifications_enabled: 1,
        voice_enabled: 1,
        dark_mode: 0,
        settings_json: "{}",
      };
    }

    // Parse current settings_json
    const currentSettingsJson = currentSettings.settings_json
      ? JSON.parse(currentSettings.settings_json)
      : {};

    // Merge settings
    const mergedData = {
      dailyGoal: updateData.dailyGoal ?? currentSettings.daily_goal,
      preferredSurgeMin:
        updateData.preferredSurgeMin ?? currentSettings.preferred_surge_min,
      maxDriveDistance:
        updateData.maxDriveDistance ?? currentSettings.max_drive_distance,
      notificationsEnabled:
        updateData.notificationsEnabled !== undefined
          ? updateData.notificationsEnabled
          : Boolean(currentSettings.notifications_enabled),
      voiceEnabled:
        updateData.voiceEnabled !== undefined
          ? updateData.voiceEnabled
          : Boolean(currentSettings.voice_enabled),
      darkMode:
        updateData.darkMode !== undefined
          ? updateData.darkMode
          : Boolean(currentSettings.dark_mode),
      settingsJson: {
        ...currentSettingsJson,
        ...(updateData.settingsJson || {}),
      },
    };

    queries.upsertUserSettings.run(
      user.id,
      mergedData.dailyGoal,
      mergedData.preferredSurgeMin,
      mergedData.maxDriveDistance,
      mergedData.notificationsEnabled ? 1 : 0,
      mergedData.voiceEnabled ? 1 : 0,
      mergedData.darkMode ? 1 : 0,
      JSON.stringify(mergedData.settingsJson),
    );

    const updatedSettings = queries.getUserSettings.get(user.id) as any;
    const parsedUpdatedSettings = {
      ...updatedSettings,
      settings_json: JSON.parse(updatedSettings.settings_json),
    };

    res.json(parsedUpdatedSettings);
  } catch (error) {
    console.error("Update settings error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export const handleGetDashboard: RequestHandler = async (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;

    // Get user profile
    const profile = queries.getUserById.get(user.id);

    // Get user settings
    const settings = queries.getUserSettings.get(user.id);

    // Get vehicles
    const vehicles = queries.getUserVehicles.all(user.id);

    // Get ride stats for today
    const todayStr = new Date().toISOString().split("T")[0];
    const todayStats = queries.getUserRideStats.get(user.id, todayStr);

    // Get ride stats for this month
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split("T")[0];
    const monthStats = queries.getUserRideStats.get(user.id, monthStartStr);

    // Get recent rides
    const recentRides = queries.getUserRides.all(user.id, 10, 0);

    res.json({
      user: profile,
      settings: settings
        ? {
            ...settings,
            settings_json: settings.settings_json
              ? JSON.parse(settings.settings_json)
              : {},
          }
        : null,
      vehicles,
      stats: {
        today: todayStats,
        month: monthStats,
      },
      recentRides,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const handleDeleteAccount: RequestHandler = (req, res) => {
  try {
    const user = (req as AuthenticatedRequest).user!;

    // Delete user (cascade will handle related data)
    queries.db.prepare("DELETE FROM users WHERE id = ?").run(user.id);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
