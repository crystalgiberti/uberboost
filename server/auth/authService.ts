import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city: string;
  subscriptionStatus: "trial" | "active" | "expired" | "cancelled";
  subscriptionPlan: "basic" | "premium";
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  createdAt: Date;
  lastLoginAt?: Date;
  role: "driver" | "admin";
  isVerified: boolean;
  profileData?: {
    carMake?: string;
    carModel?: string;
    carYear?: string;
    licensePlate?: string;
    uberRating?: number;
    totalTrips?: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city: string;
}

export class AuthService {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "uber-boost-secret-key";
  private static readonly JWT_EXPIRES_IN = "30d";
  private static readonly TRIAL_DURATION_DAYS = 7;

  // User database (in production, use PostgreSQL/MongoDB)
  private static users: Map<string, User> = new Map();
  private static emailToId: Map<string, string> = new Map();

  /**
   * Register a new user with trial subscription
   */
  static async register(
    data: RegisterData,
  ): Promise<{ user: User; token: string }> {
    // Check if email already exists
    if (this.emailToId.has(data.email.toLowerCase())) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + this.TRIAL_DURATION_DAYS);

    const user: User = {
      id: userId,
      email: data.email.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      city: data.city,
      subscriptionStatus: "trial",
      subscriptionPlan: "basic",
      trialEndsAt,
      createdAt: new Date(),
      role: "driver",
      isVerified: false,
    };

    // Store user
    this.users.set(userId, user);
    this.emailToId.set(data.email.toLowerCase(), userId);

    // Store hashed password separately (in production, use secure password storage)
    this.storePassword(userId, hashedPassword);

    // Generate JWT token
    const token = this.generateToken(user);

    // Send verification email (implement email service)
    await this.sendVerificationEmail(user);

    return { user: this.sanitizeUser(user), token };
  }

  /**
   * Login user
   */
  static async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> {
    const userId = this.emailToId.get(credentials.email.toLowerCase());
    if (!userId) {
      throw new Error("Invalid email or password");
    }

    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify password
    const storedPassword = this.getStoredPassword(userId);
    const isValidPassword = await bcrypt.compare(
      credentials.password,
      storedPassword,
    );

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    user.lastLoginAt = new Date();
    this.users.set(userId, user);

    // Check subscription status
    await this.updateSubscriptionStatus(user);

    // Generate token
    const tokenExpiry = credentials.rememberMe ? "30d" : "24h";
    const token = this.generateToken(user, tokenExpiry);

    return { user: this.sanitizeUser(user), token };
  }

  /**
   * Verify JWT token
   */
  static async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      const user = this.users.get(decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Update subscription status
      await this.updateSubscriptionStatus(user);

      return this.sanitizeUser(user);
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  /**
   * Update user subscription status
   */
  static async updateSubscriptionStatus(user: User): Promise<void> {
    const now = new Date();

    if (
      user.subscriptionStatus === "trial" &&
      user.trialEndsAt &&
      now > user.trialEndsAt
    ) {
      user.subscriptionStatus = "expired";
    }

    if (
      user.subscriptionStatus === "active" &&
      user.subscriptionEndsAt &&
      now > user.subscriptionEndsAt
    ) {
      user.subscriptionStatus = "expired";
    }

    this.users.set(user.id, user);
  }

  /**
   * Activate subscription (called after successful payment)
   */
  static async activateSubscription(
    userId: string,
    plan: "basic" | "premium",
    durationMonths: number = 1,
  ): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const subscriptionEndsAt = new Date();
    subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + durationMonths);

    user.subscriptionStatus = "active";
    user.subscriptionPlan = plan;
    user.subscriptionEndsAt = subscriptionEndsAt;
    user.trialEndsAt = undefined; // Clear trial

    this.users.set(userId, user);
    return this.sanitizeUser(user);
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const user = this.users.get(userId);
    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: Partial<User>,
  ): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Merge updates
    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);

    return this.sanitizeUser(updatedUser);
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(adminUserId: string): Promise<User[]> {
    const admin = this.users.get(adminUserId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    return Array.from(this.users.values()).map((user) =>
      this.sanitizeUser(user),
    );
  }

  /**
   * Get subscription analytics (admin only)
   */
  static async getSubscriptionAnalytics(adminUserId: string) {
    const admin = this.users.get(adminUserId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const users = Array.from(this.users.values());

    return {
      totalUsers: users.length,
      activeSubscriptions: users.filter(
        (u) => u.subscriptionStatus === "active",
      ).length,
      trialUsers: users.filter((u) => u.subscriptionStatus === "trial").length,
      expiredSubscriptions: users.filter(
        (u) => u.subscriptionStatus === "expired",
      ).length,
      revenue: {
        monthly:
          users.filter((u) => u.subscriptionStatus === "active").length * 9.99,
        projected: users.length * 9.99 * 0.7, // Assuming 70% conversion
      },
      newSignupsToday: users.filter((u) => {
        const today = new Date();
        return u.createdAt.toDateString() === today.toDateString();
      }).length,
    };
  }

  // Private helper methods
  private static generateToken(
    user: User,
    expiresIn: string = this.JWT_EXPIRES_IN,
  ): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
      },
      this.JWT_SECRET,
      { expiresIn },
    );
  }

  private static sanitizeUser(user: User): User {
    // Remove sensitive information
    const { ...sanitized } = user;
    return sanitized;
  }

  private static passwordStore: Map<string, string> = new Map();

  private static storePassword(userId: string, hashedPassword: string): void {
    this.passwordStore.set(userId, hashedPassword);
  }

  private static getStoredPassword(userId: string): string {
    return this.passwordStore.get(userId) || "";
  }

  private static async sendVerificationEmail(user: User): Promise<void> {
    // Implement email verification
    console.log(`Verification email would be sent to ${user.email}`);
  }

  /**
   * Initialize with admin user
   */
  static async initializeAdmin(): Promise<void> {
    const adminEmail = "admin@eliv8.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123!";

    if (!this.emailToId.has(adminEmail)) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const adminId = "admin_001";

      const admin: User = {
        id: adminId,
        email: adminEmail,
        firstName: "Admin",
        lastName: "User",
        city: "Jacksonville",
        subscriptionStatus: "active",
        subscriptionPlan: "premium",
        createdAt: new Date(),
        role: "admin",
        isVerified: true,
      };

      this.users.set(adminId, admin);
      this.emailToId.set(adminEmail, adminId);
      this.storePassword(adminId, hashedPassword);

      console.log("Admin user initialized:", adminEmail);
    }
  }
}

// Initialize admin on startup
AuthService.initializeAdmin();
