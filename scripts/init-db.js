#!/usr/bin/env node

// Initialize the database before starting the server
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initializeDatabase } from "../server/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Initializing database...");
try {
  initializeDatabase();
  console.log("Database initialized successfully!");
} catch (error) {
  console.error("Failed to initialize database:", error);
  process.exit(1);
}
