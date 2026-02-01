// server.js
import { loadEnv } from "./src/config/env.js"; 
import { connectDB } from "./src/config/db.js";
import { app } from "./src/app.js";
import logger from "./src/config/logger.js";
import { initSocketServer } from "./src/config/socket.js";

// Load environment variables
const { PORT, NODE_ENV } = loadEnv();

// Start server function
const startServer = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();

    // 2️⃣ Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`🌐 Health check URL: http://localhost:${PORT}/api/v1/health`);
    });

    // 3️⃣ Initialize Socket.IO with optional Redis support
    const io = await initSocketServer(server);

    // 4️⃣ Store Socket.IO instance in Express app for global access
    app.set("io", io);

    // 5️⃣ Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error(`❌ Unhandled Rejection: ${err?.message ?? err}`);
      if (server) server.close(() => process.exit(1));
      else process.exit(1);
    });

    // 6️⃣ Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      logger.error(`❌ Uncaught Exception: ${err?.message ?? err}`);
      if (server) server.close(() => process.exit(1));
      else process.exit(1);
    });

  } catch (error) {
    // 7️⃣ Catch any startup errors
    logger.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

// 8️⃣ Invoke the server startup
startServer();
