import React, { useState } from "react";
import ChatTabs from "./ChatTabs";
import ChatRoomList from "./ChatRoomList";
import ChatRoom from "./ChatRoom";
import ChatMedia from "./ChatMedia";
import { MessageSquare } from "lucide-react";

export default function ChatDrawer({ username }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Rooms");
  const [activeRoom, setActiveRoom] = useState(null);

  const renderTabContent = () => {
    if (activeRoom) return <ChatRoom room={activeRoom} username={username} onBack={() => setActiveRoom(null)} />;
    switch (activeTab) {
      case "Rooms":
        return <ChatRoomList onJoinRoom={setActiveRoom} />;
      case "Media":
        return <ChatMedia />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-24 z-50 rounded-full bg-linear-to-r from-indigo-500 to-blue-500 hover:opacity-90 text-white p-3 shadow-lg"
      >
        <MessageSquare size={22} />
      </button>

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-40 w-[380px] transform transition-transform duration-300 bg-[#0d0d0f] text-white border-r border-slate-800 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Tabs */}
        {!activeRoom && <ChatTabs activeTab={activeTab} setActiveTab={setActiveTab} />}

        {/* Dynamic content */}
        <div className="flex-1 overflow-hidden">{renderTabContent()}</div>
      </div>
    </>
  );
}
