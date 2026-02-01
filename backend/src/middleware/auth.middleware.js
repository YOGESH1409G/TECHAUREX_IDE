// src/middleware/auth.middleware.js
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../helpers/jwt.helper.js";

/**
 * protectAuth - Express middleware to protect routes.
 *
 * Behavior:
 * 1. If Authorization: Bearer <token> -> verify and set req.user
 * 2. Else if x-user-id header -> req.user = { id: ... } (testing convenience)
 * 3. Else -> 401 Unauthorized
 */
export async function protectAuth(req, res, next) {
  try {
    const authHeader = req.get("authorization");

    // ---- 1) Bearer token path ----
    if (authHeader) {
      const [scheme, token] = authHeader.trim().split(/\s+/);

      if (/^bearer$/i.test(scheme) && token) {
        try {
          const payload = verifyToken(token); // may throw

          // Validate payload user id (sub / id / userId)
          const userId = [payload.sub, payload.id, payload.userId]
            .find(v => typeof v === "string" || typeof v === "number");

          if (!userId) {
            throw new ApiError(401, "Invalid token payload");
          }

          // Do NOT spread entire JWT (security improvement #6)
          req.user = { id: String(userId) };
          return next();

        } catch (err) {
          return next(
            err instanceof ApiError
              ? err
              : new ApiError(401, "Invalid or expired token")
          );
        }
      }
    }

    // ---- 2) Testing fallback ----
    const testUid = req.get("x-user-id");
    if (testUid) {
      req.user = { id: String(testUid), provider: "stub" };
      return next();
    }

    // ---- 3) No auth ----
    return next(new ApiError(401, "Unauthorized"));

  } catch (err) {
    return next(err);
  }
}
