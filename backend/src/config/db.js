// config/db.js
import mongoose from "mongoose";
import logger from "./logger.js";
import { loadEnv } from "./env.js";

const { MONGO_URI } = loadEnv();

// Clean, readable MongoDB connection options
const mongooseOptions = {
  maxPoolSize: 20,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export async function connectDB(retries = 5, delay = 2000) {
  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
    logger.info(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    logger.error(`❌ MongoDB connection error: ${error.message}`);

    if (retries > 0) {
      logger.warn(`🔄 Retrying... (${retries} attempts left)`);
      await new Promise((res) => setTimeout(res, delay));
      return connectDB(retries - 1, delay * 2);
    }
    logger.error("❌ Failed to connect after multiple attempts");
    process.exit(1);
  }

  mongoose.connection.on("connected", () => logger.info("📡 MongoDB connected"));
  mongoose.connection.on("reconnected", () => logger.info("🔁 MongoDB reconnected"));
  mongoose.connection.on("error", (err) => logger.error("⚠️ MongoDB error:", err));
  mongoose.connection.on("disconnected", () => logger.warn("⚠️ MongoDB disconnected"));
}
