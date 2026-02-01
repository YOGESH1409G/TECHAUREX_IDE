// src/middleware/socketAuth.middleware.js
import logger from "../config/logger.js";
import { verifyToken } from "../helpers/jwt.helper.js";
import { loadEnv } from "../config/env.js";

const { NODE_ENV = "development" } = loadEnv();
const isProd = NODE_ENV === "production";

/**
 * Extract token from handshake
 * Priority: auth.token > Authorization header > handshake.query.token
 * @param {import('socket.io').Handshake} handshake
 * @returns {string|null}
 */

function extractToken(handshake) {
  if (!handshake) return null;
  // 1️⃣ Check handshake.auth.token
  if (handshake.auth?.token) return handshake.auth.token;
  // 2️⃣ Check Authorization header (Bearer token)
  const authHeader = handshake.headers?.authorization;
  if (authHeader?.startsWith("Bearer ")) return authHeader.split(" ")[1];
  // 3️⃣ Check query string
  if (handshake.query?.token) return handshake.query.token;

  return null;
}

/**
 * Socket.IO authentication middleware
 * @param {import('socket.io').Socket} socket
 * @param {(err?: any) => void} next
 */
export async function socketAuth(socket, next) {
  try {
    if (!socket?.handshake) {
      if (!isProd) logger.warn("[socketAuth] Invalid handshake", socket?.id);
      return next(new Error("Unauthorized: invalid handshake"));
    }

    // 1️⃣ Extract token
    const token = extractToken(socket.handshake);
    if (!token) {
      if (!isProd) logger.warn("[socketAuth] Missing token", socket.id);
      return next(new Error("Unauthorized: no token provided"));
    }

    // 2️⃣ Verify token (access token)
    let payload;
    try {
      payload = verifyToken(token); // synchronous, throws on invalid/expired
    } catch (err) {
      if (!isProd)
        logger.warn(`[socketAuth] Token verification failed (socketId=${socket.id}): ${err.message}`);
      return next(new Error("Unauthorized: invalid or expired token"));
    }

    // 3️⃣ Normalize user info and attach to socket
    const userId = payload.sub || payload.userId || payload.id;
    if (!userId) {
      if (!isProd)
        logger.warn(`[socketAuth] Token payload missing user ID (socketId=${socket.id})`);
      return next(new Error("Unauthorized: token missing user identifier"));
    }

    socket.user = { ...payload, id: userId };
    socket.userId = String(userId);
    socket.deviceId = socket.handshake.auth?.deviceId || payload.deviceId || socket.id;
    socket.userName = payload.name || payload.username || payload.email || null;
    socket.provider = payload.provider || "manual";
    socket.accessToken = token; // optional, remove if sensitive

    if (!isProd) {
      logger.debug(`[socketAuth] Socket ${socket.id} authenticated`, {
        userId: socket.userId,
        provider: socket.provider,
        deviceId: socket.deviceId,
      });
    }

    // 4️⃣ Allow connection
    return next();
  } catch (err) {
    logger.error("[socketAuth] Unexpected error during auth", err);
    return next(new Error("Unauthorized"));
  }
}
