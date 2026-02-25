import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ChatMessage from "./ChatMessage";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://techaurex.onrender.com";

export default function ChatRoom({ room, username, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const endRef = useRef(null);
  const { settings } = useSettings();
  const { token } = useAuth(); // Get token for socket auth

  useEffect(() => {
    if (!token) return; // Don't connect without token

    // Connect to /chat namespace with auth token
    socketRef.current = io(`${SOCKET_URL}/chat`, {
      auth: {
        token: token // Backend expects token in handshake.auth.token
      },
      transports: ['websocket', 'polling']
    });
    
    socketRef.current.emit("join-room", { roomId: room.id });

    socketRef.current.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Note: Chat history loading via API will be implemented when backend message routes are ready
    // For now, messages are received only via socket after joining
    setLoading(false);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [room.id, token]); // Add token to dependencies

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      msg: input,
      username,
      createdAt: new Date().toISOString(),
    };
    setMessages((p) => [...p, newMsg]);
    socketRef.current.emit("chat-message", {
      ...newMsg,
      roomId: room.id,
    });
    setInput("");
  };

  const handleKeyDown = (e) => {
    const enterToSend = settings?.chat?.enterToSend !== false;
    if (enterToSend) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    } else {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        sendMessage();
      }
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400">←</button>
          <div>
            <p className="font-semibold">{room.name}</p>
            <p className="text-xs text-slate-400">{room.id}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#0f0f12]">
        {loading ? (
          <div className="text-slate-400 text-sm">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="text-slate-400 text-sm">No messages yet.</div>
        ) : (
          messages.map((m, i) => (
            <ChatMessage key={i} message={m} currentUser={username} />
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-[#0d0d10] flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-slate-900 text-white p-2 rounded-lg outline-none"
        />
        <button
          onClick={sendMessage}
          className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
