
import mongoose from "mongoose";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import Invitation from "../models/invitation.model.js";
import logger from "../config/logger.js";
import { shortHasher } from "../utils/shortHasher.js";
import { sendRoomInvitation, sendWelcomeEmail } from "./email.service.js";

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
    inviteByEmail = null, // NEW: Email address to invite for 1:1 rooms
    metadata = {},
  } = payload;

  try {
    // ---------------------- 1️⃣ ONE-TO-ONE ROOM ----------------------
    if (!group) {
      // NEW: Email invitation flow
      if (inviteByEmail) {
        const inviterUser = await User.findById(userId).exec();
        if (!inviterUser) throw new Error("Logged-in user not found");

        const inviteEmail = inviteByEmail.toLowerCase().trim();

        // Check if user with this email exists
        const inviteeUser = await User.findOne({ email: inviteEmail }).exec();

        if (inviteeUser) {
          // User exists - check if they're in contacts
          const contact = await Contact.findOne({
            user: userId,
            email: inviteEmail,
          }).exec();

          if (!contact) {
            // Add to contacts automatically
            await Contact.create({
              user: userId,
              email: inviteeUser.email,
              username: inviteeUser.username,
              name: inviteeUser.name,
            });
            logger.info(`📇 Added ${inviteeUser.username} to ${inviterUser.username}'s contacts`);
          }

          // Check if 1:1 room already exists
          const existingRoom = await inviterUser.findOneToOne(inviteeUser._id);
          if (existingRoom) {
            logger.info(`💬 Returning existing 1:1 room ${existingRoom.roomCode}`);
            return existingRoom;
          }

          // Create new 1:1 room with both users
          const room = await Room.create({
            group: false,
            participants: [
              { user: userId, username: inviterUser.username, role: "member", joinStatus: "approved" },
              { user: inviteeUser._id, username: inviteeUser.username, role: "member", joinStatus: "approved" },
            ],
            createdBy: userId,
            metadata,
            oneToOneKey: Room.makeOneToOneKey(userId, inviteeUser._id),
            isPrivate: true,
          });

          room.roomCode = await shortHasher(room._id);
          await room.save();

          // Update both users' oneToOne arrays
          await User.findByIdAndUpdate(userId, {
            $addToSet: { oneToOne: { withUser: inviteeUser._id, roomId: room._id } },
          });
          await User.findByIdAndUpdate(inviteeUser._id, {
            $addToSet: { oneToOne: { withUser: userId, roomId: room._id } },
          });

          logger.info(`💬 1:1 Room created: ${room._id} between ${inviterUser.username} and ${inviteeUser.username}`);
          logger.info(`🔑 RoomCode: ${room.roomCode}`);

          return room;
        }

        // User doesn't exist - create invitation and send email
        const tempRoom = await Room.create({
          group: false,
          participants: [
            { user: userId, username: inviterUser.username, role: "member", joinStatus: "approved" },
          ],
          createdBy: userId,
          metadata,
          isPrivate: true,
        });

        tempRoom.roomCode = await shortHasher(tempRoom._id);
        await tempRoom.save();

        // Create invitation record
        const invitation = await Invitation.create({
          email: inviteEmail,
          roomId: tempRoom._id,
          invitedBy: userId,
          roomCode: tempRoom.roomCode,
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        // Send invitation email
        try {
          await sendRoomInvitation(
            inviteEmail,
            tempRoom.roomCode,
            inviterUser.name || inviterUser.username,
            tempRoom._id.toString()
          );
          logger.info(`📧 Invitation email sent to ${inviteEmail} for room ${tempRoom.roomCode}`);
        } catch (emailError) {
          logger.error(`Failed to send invitation email: ${emailError.message}`);
          // Don't throw - room is created, just email failed
        }

        // Update user's oneToOne array (will be updated for invitee when they join)
        await User.findByIdAndUpdate(userId, {
          $addToSet: { rooms: tempRoom._id },
        });

        logger.info(`💬 1:1 Room created with invitation: ${tempRoom._id}`);
        logger.info(`🔑 RoomCode: ${tempRoom.roomCode}`);
        logger.info(`📧 Invitation sent to: ${inviteEmail}`);

        // Return room with invitation flag
        return {
          ...tempRoom.toObject(),
          invitationSent: true,
          invitedEmail: inviteEmail,
        };
      }

      // EXISTING: Contact-based 1:1 room creation
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

/**
 * Join a room using room code
 * @param {String} userId - ID of the user joining the room
 * @param {String} roomCode - 7-character room code
 * @returns {Object} Room with populated data
 */
export async function joinRoom(userId, roomCode) {
  try {
    // Validate room code format
    if (!roomCode || roomCode.length !== 7) {
      throw new Error("Invalid room code format. Must be 7 characters.");
    }

    // Find the room by code
    const room = await Room.findOne({ roomCode: roomCode.toLowerCase().trim() }).exec();
    if (!room) {
      throw new Error("Room not found with this code.");
    }

    // Check if user is already a participant
    const isParticipant = room.participants.some(
      (p) => p.user.toString() === userId.toString()
    );
    if (isParticipant) {
      logger.info(`👤 User ${userId} is already in room ${room._id}`);
      // Return populated room
      return await Room.findById(room._id)
        .populate('participants.user', 'username email avatar')
        .populate('createdBy', 'username email avatar')
        .exec();
    }

    // Check if room is private and user doesn't have an invitation
    if (room.isPrivate) {
      const user = await User.findById(userId).exec();
      if (!user) throw new Error("User not found");

      // Check for valid invitation
      const invitation = await Invitation.findValidInvitation(user.email, roomCode);
      if (!invitation) {
        throw new Error("This is a private room. You need a valid invitation to join.");
      }

      // Accept the invitation
      await Invitation.acceptInvitation(user.email, roomCode);
      logger.info(`📧 Invitation accepted for ${user.email} to room ${room._id}`);
    }

    // Fetch user to get username
    const user = await User.findById(userId).exec();
    if (!user) throw new Error("User not found");

    // Add user to room participants
    room.participants.push({
      user: userId,
      username: user.username,
      role: "member",
      joinStatus: "approved",
      joinedAt: new Date(),
    });
    await room.save();

    // Update user's rooms array
    await User.findByIdAndUpdate(userId, { 
      $addToSet: { rooms: room._id } 
    });

    // If it's a 1:1 room, update oneToOne array
    if (!room.group) {
      const otherUserId = room.participants.find(
        (p) => p.user.toString() !== userId.toString()
      )?.user;
      
      if (otherUserId) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { oneToOne: { withUser: otherUserId, roomId: room._id } },
        });
      }
    }

    logger.info(`✅ User ${user.username} (${userId}) joined room ${room.roomCode}`);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.username, room.roomName || "TechAurex Room")
      .catch(err => logger.warn(`Failed to send welcome email: ${err.message}`));

    // Return populated room
    return await Room.findById(room._id)
      .populate('participants.user', 'username email avatar')
      .populate('createdBy', 'username email avatar')
      .exec();

  } catch (error) {
    logger.error(`❌ Failed to join room with code ${roomCode} by user ${userId}: ${error.message}`, { error });
    throw error;
  }
}

/**
 * Get all rooms for a user
 * @param {String} userId - ID of the user
 * @returns {Array} Array of rooms with populated data
 */
export async function getUserRooms(userId) {
  try {
    const user = await User.findById(userId).populate({
      path: 'rooms',
      populate: {
        path: 'participants.user',
        select: 'username email avatar'
      },
      options: { sort: { 'lastMessage.createdAt': -1 } }
    }).exec();

    if (!user) {
      throw new Error("User not found");
    }

    // Filter out archived rooms and return
    const activeRooms = user.rooms.filter(room => !room.archived);
    
    logger.info(`📋 Retrieved ${activeRooms.length} rooms for user ${userId}`);
    return activeRooms;
  } catch (error) {
    logger.error(`❌ Error fetching rooms for user ${userId}:`, error.message);
    throw error;
  }
}

export const RoomService = {
  createRoom,
  joinRoom,
  getUserRooms,
};

