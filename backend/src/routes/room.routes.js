import express from "express";
import { createRoom } from "../controllers/room.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only route you need for now
router.post("/create", protectAuth, createRoom);

export default router;
