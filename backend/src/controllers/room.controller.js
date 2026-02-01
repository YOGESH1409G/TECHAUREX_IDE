// src/controllers/room.controller.js
import { RoomService } from "../services/room.service.js";
import {ApiError} from "../utils/ApiError.js";

/**
 * Create a room (group or 1:1)
 * POST /api/v1/rooms
 */
export async function createRoom(req, res, next) {
  try {
    const payload = req.body;       // roomName, group, etc.
    const userId = req.user.id;     // comes automatically from JWT

    const room = await RoomService.createRoom(payload, userId);

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}

