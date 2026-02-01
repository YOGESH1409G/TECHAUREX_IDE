// src/config/redis.js
import { createClient } from "redis";
import logger from "./logger.js";
import { loadEnv } from "./env.js";

// 1️⃣ Load environment variables for Redis configuration
const { USE_REDIS = "false", REDIS_URL = "redis://127.0.0.1:6379" } = loadEnv();
const redisEnabled = USE_REDIS.toString().toLowerCase() === "true";

// 2️⃣ Redis clients and initialization flag
let pubClient = null;
let subClient = null;
let initialized = false;


 //3️⃣ Initialize Redis pub/sub clients (idempotent)
export async function initRedis() {
  if (!redisEnabled) {
    // Redis disabled → skip initialization
    logger.info("ℹ️ Redis disabled (USE_REDIS=false), skipping initialization");
    return null;
  }

  if (initialized && pubClient && subClient) {
    // Already initialized → return existing clients
    logger.info("ℹ️ Redis already initialized");
    return { pubClient, subClient };
  }

  if (!REDIS_URL) {
    throw new Error("REDIS_URL is required when USE_REDIS=true");
  }

  try {
    // 3A Create publisher client with auto-reconnect
    pubClient = createClient({
      url: REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 2000), // exponential backoff up to 2s
      },
    });

    // 3B  Subscriber duplicates publisher client
    subClient = pubClient.duplicate();

    // 3C  Attach logging listeners for observability
    [pubClient, subClient].forEach((client, idx) => {
      client.on("error", (err) => logger.error(`❌ Redis client[${idx}] error:`, err));
      client.on("connect", () => logger.info(`🔄 Redis client[${idx}] connecting...`));
      client.on("ready", () => logger.info(`✅ Redis client[${idx}] ready`));
      client.on("end", () => logger.warn(`⚠️ Redis client[${idx}] connection closed`));
    });

    // 3D  Connect clients
    await pubClient.connect();
    await subClient.connect();

    initialized = true;
    logger.info(`✅ Redis initialized at ${REDIS_URL}`);

    // 3E  Graceful shutdown for process exit or termination
    const shutdown = async () => {
      try {
        if (pubClient) await pubClient.disconnect();
        if (subClient) await subClient.disconnect();
        logger.info("🧹 Redis clients disconnected");
      } catch (err) {
        logger.warn("⚠️ Error during Redis shutdown:", err);
      }
    };

    process.on("exit", shutdown);
    process.on("SIGINT", async () => { await shutdown(); process.exit(0); });
    process.on("SIGTERM", async () => { await shutdown(); process.exit(0); });

    return { pubClient, subClient };
  } catch (err) {
    // 3F  Cleanup on failure
    pubClient = null;
    subClient = null;
    initialized = false;
    logger.error("❌ Failed to initialize Redis clients:", err);
    throw err;
  }
}


//4️⃣ Check if Redis is enabled
export function isRedisEnabled() {
  return redisEnabled;
}


 //5️⃣ Get publisher client
export function getPubClient() {
  if (!redisEnabled) throw new Error("Redis disabled (USE_REDIS=false)");
  if (!pubClient) throw new Error("Redis pubClient not initialized. Call initRedis() first.");
  return pubClient;
}


 //6️⃣ Get subscriber client
export function getSubClient() {
  if (!redisEnabled) throw new Error("Redis disabled (USE_REDIS=false)");
  if (!subClient) throw new Error("Redis subClient not initialized. Call initRedis() first.");
  return subClient;
}
