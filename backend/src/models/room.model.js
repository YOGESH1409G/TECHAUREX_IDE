import mongoose from "mongoose";
import ParticipantSchema from "./participant.model.js";
import LastMessageSchema from "./lastmessage.model.js";

import { getDateTimeStamp } from "../utils/dateTimeStamp.js";

const { Schema } = mongoose;

const RoomSchema = new Schema(
  {
    roomName: { type: String, trim: true, default: () => `new_${getDateTimeStamp()}`, minlength: 1, maxlength: 100 },
    description: { type: String, trim: true, default: null },
    group: { type: Boolean, default: false,  },
    isPrivate: { type: Boolean, default: false, },
    participants: { type: [ParticipantSchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, },
    avatar: { type: String, default: null },
    archived: { type: Boolean, default: false, },
    lastMessage: { type: LastMessageSchema, default: null },
    // oneToOneKey: { type: String, default: null, sparse: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    roomCode: {
      type: String,
      trim: true,
      default: null,
      sparse: true,
      index: true,
      minlength: 7,
      maxlength: 7,
      match: /^[a-z0-9]{7}$/,
    }
  },
  { timestamps: true }
);

// expose virtuals in API responses
RoomSchema.set("toJSON", { virtuals: true });
RoomSchema.set("toObject", { virtuals: true });

/**
 * Virtuals
 */
RoomSchema.virtual("memberCount").get(function () {
  return this.participants ? this.participants.length : 0;
});

RoomSchema.virtual("isIsPrivate").get(function () {
  return !!this.isPrivate;
});

RoomSchema.virtual("isGroup").get(function () {
  return !!this.group;
});

RoomSchema.virtual("isArchived").get(function () {
  return !!this.archived;
});

// RoomSchema.virtual("isOneToOne").get(function () {
//   return !this.group && !!this.oneToOneKey;
// });

RoomSchema.virtual("hasAvatar").get(function () {
  return !!this.avatar;
});

RoomSchema.virtual("type").get(function () {
  return this.group ? "group" : "private";
});

RoomSchema.virtual("lastMessageTime").get(function () {
  return this.lastMessage?.createdAt || null;
});

/**
 * Instance methods (require arguments)
 */
RoomSchema.methods.isMember = function (userId) {
  if (!userId) return false;
  return this.participants.some(p => String(p.user) === String(userId));
};

RoomSchema.methods.isAdmin = function (userId) {
  if (!userId) return false;
  return this.participants.some(p => String(p.user) === String(userId) && p.role === "admin");
};

RoomSchema.methods.getMember = function (userId) {
  if (!userId) return null;
  return this.participants.find(p => String(p.user) === String(userId)) || null;
};

RoomSchema.methods.getAdmins = function() {
  return this.participants.filter(p => p.role === "admin");
};


/**
 * Static helpers
 */

RoomSchema.statics.isRoomCodeExist = async function (code) {
  if (!code) return false;
  const exists = await this.exists({ roomCode: code });
  return !!exists; // returns true if found, false if not };
};

RoomSchema.statics.makeOneToOneKey = function (userA, userB) {
  if (String(userA) === String(userB)) throw new Error("Cannot create 1:1 room with same user");
  const a = String(userA);
  const b = String(userB);
  return a < b ? `${a}_${b}` : `${b}_${a}`;
};

// RoomSchema.statics.findOneToOne = async function (userA, userB) {
//   const key = this.makeOneToOneKey(userA, userB);
//   return this.findOne({ isGroup: false, oneToOneKey: key, isArchived: false });
// };

// RoomSchema.statics.getOrCreateOneToOne = async function (userA, userB, createdBy) {
//   const key = this.makeOneToOneKey(userA, userB);
//   const existing = await this.findOne({ isGroup: false, oneToOneKey: key, isArchived: false });
//   if (existing) return existing;

//   const participants = [
//     { user: userA, role: "member", joinedAt: new Date() },
//     { user: userB, role: "member", joinedAt: new Date() },
//   ];

//   return this.findOneAndUpdate(
//     { oneToOneKey: key },
//     {
//       $setOnInsert: {
//         isGroup: false,
//         name: null,
//         description: null,
//         participants,
//         createdBy,
//         oneToOneKey: key,
//         isArchived: false,
//       },
//     },
//     { new: true, upsert: true }
//   );
// };

/**
 * Participant helpers
 */
RoomSchema.statics.addParticipant = function (roomId, userId, role = "member") {
  return this.findByIdAndUpdate(
    roomId,
    { $addToSet: { participants: { user: userId, role, joinedAt: new Date() } } },
    { new: true }
  );
};

RoomSchema.statics.removeParticipant = function (roomId, userId) {
  return this.findByIdAndUpdate(
    roomId,
    { $pull: { participants: { user: userId } } },
    { new: true }
  );
};

RoomSchema.statics.viewParticipants = async function (roomId) {
  const room = await this.findById(roomId).populate("participants.user", "name avatar email");
  if (!room) return [];
  return room.participants.map((p) => ({
    _id: p.user._id,
    name: p.user.name,
    avatar: p.user.avatar,
    email: p.user.email,
    role: p.role,
    joinedAt: p.joinedAt,
  }));
};


/**
 * LastMessage helper
 */
RoomSchema.statics.updateLastMessage = function (roomId, messageDoc) {
  return this.findByIdAndUpdate(
    roomId,
    { $set: { lastMessage: messageDoc } },
    { new: true }
  );
};

/**
 * Indexes
 */
RoomSchema.index({ "participants.user": 1, isGroup: 1 });
RoomSchema.index({ "lastMessage.createdAt": -1 });
RoomSchema.index({ createdBy: 1 });


const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);
export default Room;

