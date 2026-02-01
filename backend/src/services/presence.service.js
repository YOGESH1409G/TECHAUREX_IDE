// src/services/presence.service.js
import User from "../models/user.model.js";
import { getUserStatus, getManyStatuses } from "../sockets/utils/socketUtils.js"; //we will do this later remember


// 1️⃣ Get presence status for a single user (socket first, DB fallback)
export async function getPresenceStatus(userId) {
  if (!userId) return { online: false, lastSeen: null };

  try {
    const socketStatus = await getUserStatus(String(userId));
    if (socketStatus) return socketStatus;
  } catch (err) {
    // Optional: log error if needed
  }

  const user = await User.findById(userId).select("isOnline lastSeen").lean();
  return user
    ? { online: !!user.isOnline, lastSeen: user.lastSeen || null }
    : { online: false, lastSeen: null };
}


// 2️⃣ Get presence status for multiple users (socket first, DB fallback)
export async function getPresenceStatuses(userIds = []) {
  if (!Array.isArray(userIds) || userIds.length === 0) return {};

  const ids = userIds.map(String);
  let socketStatuses = {};

  try {
    socketStatuses = (await getManyStatuses(ids)) || {};
  } catch (err) {
    // Optional: log error if needed
    socketStatuses = {};
  }

  const missingIds = ids.filter((id) => !socketStatuses[id]);
  let dbStatuses = {};

  if (missingIds.length > 0) {
    const users = await User.find({ _id: { $in: missingIds } })
      .select("_id isOnline lastSeen")
      .lean();

    users.forEach((u) => {
      dbStatuses[String(u._id)] = { online: !!u.isOnline, lastSeen: u.lastSeen || null };
    });

    missingIds.forEach((id) => {
      if (!dbStatuses[id]) dbStatuses[id] = { online: false, lastSeen: null };
    });
  }

  // Socket statuses override DB statuses when available
  return { ...dbStatuses, ...socketStatuses };
}
  

// 3️⃣ Update a single user's presence (DB only)
export async function setUserPresence(userId, online = true) {
  if (!userId) return null;

  const user = await User.findById(userId);
  if (!user) return null;

  user.isOnline = online;
  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  return { userId: String(user._id), online: user.isOnline, lastSeen: user.lastSeen };
}


// 4️⃣ Batch update multiple users' presence (DB only)
export async function setMultipleUsersPresence(userIds = [], online = false) {
  if (!Array.isArray(userIds) || userIds.length === 0) return [];

  const now = new Date();
  await User.updateMany(
    { _id: { $in: userIds } },
    { $set: { isOnline: online, lastSeen: now } }
  );
  return userIds.map((id) => ({ userId: String(id), online, lastSeen: now }));
}

