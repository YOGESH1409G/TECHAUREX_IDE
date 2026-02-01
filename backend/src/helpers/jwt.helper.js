import jwt from "jsonwebtoken";
import { loadEnv } from "../config/env.js";

const config = loadEnv();

/**
 * Generate JWT access token
 * @param {Object} payload
 */
export const signAccessToken = (payload) => {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES || "15m",
  });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload
 */
export const signRefreshToken = (payload) => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES || "7d",
  });
};

/**
 * Verify token (access or refresh)
 */
export const verifyToken = (token, isRefresh = false) => {
  try {
    const secret = isRefresh
      ? config.JWT_REFRESH_SECRET
      : config.JWT_ACCESS_SECRET;
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

/**
 * Decode token without verification
 */
export const decodeToken = (token) => jwt.decode(token);
