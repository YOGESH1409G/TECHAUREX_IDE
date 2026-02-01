
import mongoose from "mongoose";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import logger from "../config/logger.js";
import { shortHasher } from "../utils/shortHasher.js";

/**
 * Create a room (1:1 or group)
 * @param {Object} payload - Room data from frontend
 * @param {String} userId - ID of the user creating the room
 * @returns {Object} Created or existing room
 */
export async function createRoom(payload, userId) {
  const {
    roomName,
    description = null,
    avatar = null,
    group,
    isPrivate,
    participants = [], // For 1:1, contains ONE contact ID (other user)
    metadata = {},
  } = payload;

  try {
    // ---------------------- 1️⃣ ONE-TO-ONE ROOM ----------------------
    if (!group) {
      const otherUserId = participants[0];
      if (!otherUserId) throw new Error("You must select one contact to create a 1:1 room.");

      // Fetch logged-in user with contacts populated
      const user = await User.findById(userId).populate("contacts").exec();
      if (!user) throw new Error("Logged-in user not found");
      user.contacts = user.contacts || [];
      user.oneToOne = user.oneToOne || [];

      // Check if a 1:1 room already exists
      const existingRoom = await user.findOneToOne(otherUserId);
      if (existingRoom) {
        logger.info(`💬 Returning existing 1:1 room ${existingRoom.roomCode} between users ${user.username} and ${existingRoom.participants.find(p => p.user.toString() !== userId).username}`);
        return existingRoom;
      }

      // Validate that the participant is in user's contacts
      const contactExists = user.contacts.some(
        (contact) => contact.user.toString() === otherUserId.toString()
      );
      if (!contactExists) throw new Error("Selected user is not in your contacts. Cannot create 1:1 room.");

      // Fetch the other participant
      const otherUser = await User.findById(otherUserId).exec();
      if (!otherUser) throw new Error("Selected participant not found");
      const otherUsername = otherUser.username;

      const username = user.username;

      // Create new 1:1 room
      const room = await Room.create({
        group: false,
        participants: [
          { user: userId, username, role: "member", joinStatus: "approved" },
          { user: otherUserId, username: otherUsername, role: "member", joinStatus: "approved" },
        ],
        createdBy: userId,
        metadata,
        oneToOneKey: Room.makeOneToOneKey(userId, otherUserId),
      });

      room.roomCode = await shortHasher(room._id);
      room.isPrivate = true;
      await room.save();

      // Update both users' oneToOne arrays
      await User.findByIdAndUpdate(userId, {
        $addToSet: { oneToOne: { withUser: otherUserId, roomId: room._id } },
      });
      await User.findByIdAndUpdate(otherUserId, {
        $addToSet: { oneToOne: { withUser: userId, roomId: room._id } },
      });

      logger.info(`💬 1:1 Room created: ${room._id} between users ${username} and ${otherUsername}`);
      logger.info(`🔑 RoomCode: ${room.roomCode}`);

      return room;
    }


    // ---------------------- 2️⃣ GROUP ROOM ----------------------
    if (!roomName || roomName.trim().length < 1 || roomName.trim().length > 50) {
      throw new Error("Room name is required and must be 1-50 characters for group rooms.");
    }

    const room = await Room.create({
      roomName: roomName.trim(),
      description,
      avatar,
      group: true,
      isPrivate: !!isPrivate,
      createdBy: userId,
      metadata,
      participants: [
        { user: userId, role: "admin", joinStatus: "approved" } // creator is admin
      ],
    });

    // Generate room code
    room.roomCode = await shortHasher(room._id);
    await room.save();

    logger.info(`🗫 Group Room created: ${room._id} by user ${userId}`);
    logger.info(`🔑 RoomCode: ${room.roomCode}`);

    // Add room to creator's rooms array
    await User.findByIdAndUpdate(userId, { $addToSet: { rooms: room._id } });

    return room;

  } catch (error) {
    logger.error(`❌ Failed to create room by user ${userId}: ${error.message}`, { error });
    throw error;
  }
}

export const RoomService = {
  createRoom,
};

