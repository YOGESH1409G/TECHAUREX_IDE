import React, { useState, useEffect } from "react";
import { getUserRooms } from "../../services/roomService";
import CreateJoinModal from "./CreateJoinModal";

export default function ChatRoomList({ onJoinRoom }) {
  const [modalType, setModalType] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getUserRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalType(null);
    fetchRooms(); // Refresh room list after creating/joining
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b border-slate-800">
        <button
          onClick={() => setModalType("join")}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 font-medium"
        >
          Join Room
        </button>
        <button
          onClick={() => setModalType("create")}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-medium"
        >
          Create Room
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-center text-slate-400 mt-8">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <div className="text-center text-slate-400 mt-8">
            <p className="mb-2">No rooms yet</p>
            <p className="text-sm">Create a room or join one to get started!</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => onJoinRoom(room)}
              className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold">
                    {room.group ? room.roomName : room.participants?.find(p => p.user._id !== room.createdBy)?._id || 'Chat'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {room.group ? `${room.participants?.length || 0} members` : '1:1 Chat'}
                  </p>
                  {room.lastMessage && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {room.lastMessage.text || 'No messages yet'}
                    </p>
                  )}
                </div>
                {room.roomCode && (
                  <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                    {room.roomCode}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {modalType && (
        <CreateJoinModal
          type={modalType}
          onClose={handleModalClose}
          onJoin={(room) => {
            handleModalClose();
            onJoinRoom(room);
          }}
        />
      )}
    </div>
  );
}
