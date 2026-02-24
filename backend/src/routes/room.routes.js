import express from "express";
import { createRoom, joinRoom, getUserRooms } from "../controllers/room.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Room routes
router.get("/", protectAuth, getUserRooms);
router.post("/", protectAuth, createRoom);
router.post("/join", protectAuth, joinRoom);

export default router;
