import Database from "better-sqlite3";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize SQLite database
const dbPath = join(__dirname, "..", "uber_boost.db");
export const db = new Database(dbPath);

// Enable foreign keys
db.exec("PRAGMA foreign_keys = ON");

// Initialize database schema
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      city TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Vehicles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      year INTEGER,
      make TEXT,
      model TEXT,
      color TEXT,
      license_plate TEXT,
      mileage INTEGER DEFAULT 0,
      fuel_type TEXT DEFAULT 'gas',
      mpg REAL DEFAULT 25.0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Rides table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rides (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      vehicle_id TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      pickup_location TEXT NOT NULL,
      dropoff_location TEXT NOT NULL,
      ride_type TEXT DEFAULT 'UberX',
      earnings REAL DEFAULT 0,
      surge REAL DEFAULT 1.0,
      duration INTEGER DEFAULT 0,
      distance REAL DEFAULT 0,
      tips REAL DEFAULT 0,
      notes TEXT,
      source TEXT DEFAULT 'manual',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE SET NULL
    )
  `);

  // Maintenance records table
  db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_records (
      id TEXT PRIMARY KEY,
      vehicle_id TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      mileage INTEGER,
      cost REAL DEFAULT 0,
      location TEXT,
      next_due INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE
    )
  `);

  // User settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY,
      daily_goal REAL DEFAULT 150,
      preferred_surge_min REAL DEFAULT 1.5,
      max_drive_distance INTEGER DEFAULT 10,
      notifications_enabled BOOLEAN DEFAULT 1,
      voice_enabled BOOLEAN DEFAULT 1,
      dark_mode BOOLEAN DEFAULT 0,
      settings_json TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // User sessions table (for authentication)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  console.log("Database initialized successfully");
}

// Initialize database immediately
initializeDatabase();

// Helper functions for database operations
export const queries = {
  // Users
  createUser: db.prepare(`
    INSERT INTO users (id, email, password_hash, first_name, last_name, phone, city)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getUserByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),

  getUserById: db.prepare(`
    SELECT id, email, first_name, last_name, phone, city, created_at 
    FROM users WHERE id = ?
  `),

  updateUser: db.prepare(`
    UPDATE users 
    SET first_name = ?, last_name = ?, phone = ?, city = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  // Vehicles
  createVehicle: db.prepare(`
    INSERT INTO vehicles (id, user_id, year, make, model, color, license_plate, mileage, fuel_type, mpg, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getUserVehicles: db.prepare(`
    SELECT * FROM vehicles WHERE user_id = ? ORDER BY is_active DESC, created_at DESC
  `),

  updateVehicle: db.prepare(`
    UPDATE vehicles 
    SET year = ?, make = ?, model = ?, color = ?, license_plate = ?, mileage = ?, fuel_type = ?, mpg = ?, is_active = ?
    WHERE id = ? AND user_id = ?
  `),

  deleteVehicle: db.prepare(`
    DELETE FROM vehicles WHERE id = ? AND user_id = ?
  `),

  // Rides
  createRide: db.prepare(`
    INSERT INTO rides (id, user_id, vehicle_id, date, time, pickup_location, dropoff_location, ride_type, earnings, surge, duration, distance, tips, notes, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getUserRides: db.prepare(`
    SELECT * FROM rides WHERE user_id = ? ORDER BY date DESC, time DESC LIMIT ? OFFSET ?
  `),

  getUserRideStats: db.prepare(`
    SELECT 
      COUNT(*) as total_rides,
      SUM(earnings) as total_earnings,
      SUM(tips) as total_tips,
      AVG(surge) as avg_surge,
      SUM(distance) as total_distance
    FROM rides 
    WHERE user_id = ? AND date >= ?
  `),

  deleteRide: db.prepare(`
    DELETE FROM rides WHERE id = ? AND user_id = ?
  `),

  // Maintenance
  createMaintenanceRecord: db.prepare(`
    INSERT INTO maintenance_records (id, vehicle_id, type, description, date, mileage, cost, location, next_due)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getVehicleMaintenanceRecords: db.prepare(`
    SELECT * FROM maintenance_records WHERE vehicle_id = ? ORDER BY date DESC
  `),

  // Settings
  getUserSettings: db.prepare(`
    SELECT * FROM user_settings WHERE user_id = ?
  `),

  upsertUserSettings: db.prepare(`
    INSERT INTO user_settings (user_id, daily_goal, preferred_surge_min, max_drive_distance, notifications_enabled, voice_enabled, dark_mode, settings_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      daily_goal = excluded.daily_goal,
      preferred_surge_min = excluded.preferred_surge_min,
      max_drive_distance = excluded.max_drive_distance,
      notifications_enabled = excluded.notifications_enabled,
      voice_enabled = excluded.voice_enabled,
      dark_mode = excluded.dark_mode,
      settings_json = excluded.settings_json
  `),

  // Sessions
  createSession: db.prepare(`
    INSERT INTO user_sessions (token, user_id, expires_at)
    VALUES (?, ?, ?)
  `),

  getSession: db.prepare(`
    SELECT us.*, u.id as user_id, u.email, u.first_name, u.last_name 
    FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token = ? AND us.expires_at > CURRENT_TIMESTAMP
  `),

  deleteSession: db.prepare(`
    DELETE FROM user_sessions WHERE token = ?
  `),

  deleteExpiredSessions: db.prepare(`
    DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP
  `),
};

// Clean up expired sessions periodically
setInterval(
  () => {
    queries.deleteExpiredSessions.run();
  },
  60 * 60 * 1000,
); // Every hour
