import React, { useState } from "react";
import CreateJoinModal from "./CreateJoinModal";

export default function ChatRoomList({ onJoinRoom }) {
  const [modalType, setModalType] = useState(null);

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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Example room list */}
        <div
          onClick={() => onJoinRoom({ id: "design-team", name: "Design Team" })}
          className="p-3 rounded-xl hover:bg-slate-800 cursor-pointer"
        >
          <div>
            <p className="font-semibold">Design Team</p>
            <p className="text-xs text-slate-400">Active 3 members</p>
          </div>
        </div>
      </div>

      {modalType && (
        <CreateJoinModal
          type={modalType}
          onClose={() => setModalType(null)}
          onJoin={onJoinRoom}
        />
      )}
    </div>
  );
}
