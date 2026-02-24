// src/services/token.service.js
import bcrypt from "bcrypt";
import Token from "../models/token.model.js";
import { signAccessToken, verifyToken } from "../helpers/jwt.helper.js";
import { ApiError } from "../utils/ApiError.js";
import { loadEnv } from "../config/env.js";

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken
 */
export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) throw new ApiError(401, "Refresh token missing");

  const config = loadEnv();
  let decoded;
  try {
    decoded = verifyToken(refreshToken, config.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // Find the refresh token in DB
  const tokens = await Token.find({ user: decoded.sub });
  const validToken = await Promise.any(
    tokens.map((t) =>
      bcrypt.compare(refreshToken, t.token).then((v) => (v ? t : null))
    )
  ).catch(() => null);

  if (!validToken) throw new ApiError(401, "Invalid or expired refresh token");

  // Generate new access token (refresh token stays same)
  const newAccessToken = signAccessToken({ sub: decoded.sub });
  return { newAccessToken, refreshToken }; // refreshToken unchanged
}
