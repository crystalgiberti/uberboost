import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { queries } from "../database.js";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  city: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const handleRegister: RequestHandler = async (req, res) => {
  console.log("Registration attempt:", {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    hasPassword: !!req.body.password,
  });

  try {
    const { email, password, firstName, lastName, phone, city } =
      registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = queries.getUserByEmail.get(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const userId = uuidv4();
    queries.createUser.run(
      userId,
      email,
      passwordHash,
      firstName,
      lastName,
      phone || null,
      city || null,
    );

    // Create default settings
    queries.upsertUserSettings.run(
      userId,
      150, // daily_goal
      1.5, // preferred_surge_min
      10, // max_drive_distance
      1, // notifications_enabled
      1, // voice_enabled
      0, // dark_mode
      JSON.stringify({}), // settings_json
    );

    // Create session
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    queries.createSession.run(token, userId, expiresAt.toISOString());

    // Return user data and token
    const user = queries.getUserById.get(userId);

    res.json({
      user,
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Registration failed" });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Get user
    const user = queries.getUserByEmail.get(email) as any;
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create session
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    queries.createSession.run(token, user.id, expiresAt.toISOString());

    // Return user data (without password hash)
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Login failed" });
  }
};

export const handleLogout: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    queries.deleteSession.run(token);
  }

  res.json({ message: "Logged out successfully" });
};

export const handleMe: RequestHandler = (req, res) => {
  // This route uses requireAuth middleware, so req.user is guaranteed
  res.json({ user: (req as any).user });
};
