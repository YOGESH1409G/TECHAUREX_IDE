import api from './api';

/**
 * Fetch user's contacts from backend
 * @returns {Promise<Array>} Array of contact objects
 */
export const getContacts = async () => {
  try {
    const { data: response } = await api.get('/api/v1/user/contacts');
    // Backend wraps in ApiResponse, access via response.data
    return response.data || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

/**
 * Create a room (1:1 or Group)
 * @param {Object} payload - Room creation payload
 * @param {boolean} payload.group - true for group room, false for 1:1
 * @param {Array<string>} [payload.participants] - User IDs for 1:1 room (required if group=false)
 * @param {string} [payload.roomName] - Room name for group (required if group=true)
 * @param {string} [payload.description] - Room description (optional)
 * @param {string} [payload.avatar] - Room avatar URL (optional)
 * @param {boolean} [payload.isPrivate] - Whether room is private (optional)
 * @returns {Promise<Object>} Created room object
 */
export const createRoom = async (payload) => {
  try {
    const { data: response } = await api.post('/api/v1/rooms', payload);
    // Backend wraps in ApiResponse, access via response.data
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

/**
 * Join a room by room code
 * @param {string} roomCode - Room code to join
 * @returns {Promise<Object>} Room object
 */
export const joinRoomByCode = async (roomCode) => {
  try {
    const { data: response } = await api.post('/api/v1/rooms/join', { roomCode });
    // Backend wraps in ApiResponse, access via response.data
    return response.data;
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

/**
 * Get all rooms for logged-in user
 * @returns {Promise<Array>} Array of room objects
 */
export const getUserRooms = async () => {
  try {
    const { data: response } = await api.get('/api/v1/rooms');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user rooms:', error);
    throw error;
  }
};
