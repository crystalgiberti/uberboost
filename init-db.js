import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join("./dist", "uber_boost.db");
console.log("Initializing database at:", dbPath);

const db = new Database(dbPath);
db.exec("PRAGMA foreign_keys = ON");

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

// User sessions table
db.exec(`
  CREATE TABLE IF NOT EXISTS user_sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )
`);

console.log("✅ Database initialized successfully");
db.close();
