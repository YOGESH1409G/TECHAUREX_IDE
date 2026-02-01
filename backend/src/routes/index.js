import express from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js"
import oauthRoutes from "./oauth.routes.js";
import roomRoutes from './room.routes.js'
import userRoutes from "./user.routes.js";

const router = express.Router();

// Mount individual route files
router.use("/health", healthRoutes);
router.use("/oauth", oauthRoutes);
router.use("/auth", authRoutes);

router.use("/rooms", roomRoutes);
// router.use("/user",userRoutes)

router.use("/user", userRoutes);

// TODO: add other routes when ready

export default router;
