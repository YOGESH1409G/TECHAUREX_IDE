import express from "express";
import authCheckRoutes from "./auth.checkRoute.js";

const router = express.Router();

// Prefix all check routes under /check
router.use("/", authCheckRoutes);

export default router;
