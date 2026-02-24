// src/controllers/room.controller.js
import { RoomService } from "../services/room.service.js";
import {ApiError} from "../utils/ApiError.js";

/**
 * Create a room (group or 1:1)
 * POST /api/v1/rooms
 */
export async function createRoom(req, res, next) {
  try {
    console.log('\n🎯 === CREATE ROOM REQUEST ===');
    console.log('User ID:', req.user?.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const payload = req.body;       // roomName, group, etc.
    const userId = req.user.id;     // comes automatically from JWT

    const room = await RoomService.createRoom(payload, userId);

    console.log('✅ Room created successfully:', room._id);
    console.log('📧 Invitation sent:', room.invitationSent || false);

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error) {
    console.error('❌ Error creating room:', error.message);
    next(error);
  }
}

/**
 * Join a room by room code
 * POST /api/v1/rooms/join
 */
export async function joinRoom(req, res, next) {
  try {
    const { roomCode } = req.body;
    const userId = req.user.id;

    if (!roomCode) {
      throw new ApiError(400, "Room code is required");
    }

    const room = await RoomService.joinRoom(userId, roomCode);

    return res.status(200).json({
      success: true,
      message: "Successfully joined room",
      data: room,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all rooms for logged-in user
 * GET /api/v1/rooms
 */
export async function getUserRooms(req, res, next) {
  try {
    const userId = req.user.id;
    const rooms = await RoomService.getUserRooms(userId);

    return res.status(200).json({
      success: true,
      message: "Rooms retrieved successfully",
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
}

