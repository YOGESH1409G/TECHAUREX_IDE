import { Server } from "socket.io";
import logger from "./logger.js";
import { loadEnv } from "./env.js";
import { initNamespaces } from "../sockets/index.js"; 
import { isRedisEnabled, initRedis, getPubClient, getSubClient } from "./redis.js";

// Load environment variables for Socket.IO configuration
const { CLIENT_URL = "*", SOCKET_TRANSPORTS = "websocket,polling" } = loadEnv();

export const initSocketServer = async (httpServer) => {
  // 1️⃣ Create Socket.IO server instance
  const io = new Server(httpServer, {
    cors: { origin: CLIENT_URL, credentials: true },
    transports: SOCKET_TRANSPORTS.split(","), // allow websocket and polling transports
  });
  logger.info("⚡ Socket.IO server started");


  // 2️⃣ Attach Redis adapter if enabled (fail-safe)
  if (isRedisEnabled()) {
    try {
      // Initialize Redis clients
      await initRedis();

      // Dynamically import createAdapter only if Redis is used
      const { createAdapter } = await import("@socket.io/redis-adapter");

      const pubClient = getPubClient();
      const subClient = getSubClient();

      // Attach Redis adapter to Socket.IO for multi-instance support
      io.adapter(createAdapter(pubClient, subClient));
      logger.info("✅ Redis adapter attached");
      
    } catch (err) {
      logger.error("❌ Redis adapter failed, continuing without Redis:", err);
    }
  } else {
    // Redis not enabled → run in single-instance mode
    logger.info("ℹ️ Redis disabled — single-instance mode");
  }


  // 3️⃣ Initialize namespaces (e.g., /chat, /call, /presence)
  initNamespaces(io);
  logger.info("📡 Namespaces initialized");


  // 4️⃣ Global socket event logging
  io.on("connection", (socket) => {
    logger.info(`🟢 Connected: ${socket.id}`);
    socket.on("disconnect", (reason) => logger.info(`🔴 Disconnected (${socket.id}): ${reason}`));
    socket.on("error", (err) => logger.warn(`⚠️ Socket error [${socket.id}]: ${err.message}`));
  });


  // 5️⃣ Server ready
  logger.info("🚀 Socket.IO ready");

  return io;
};