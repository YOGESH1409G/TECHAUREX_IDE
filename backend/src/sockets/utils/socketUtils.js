// ./sockets/utils/socketUtils.js
// TODO: temporary will do later

export async function getUserStatus(userId) {
  return { online: false, lastSeen: null };
}

export async function getManyStatuses(userIds = []) {
  const result = {};
  userIds.forEach((id) => {
    result[id] = { online: false, lastSeen: null };
  });
  return result;
}
