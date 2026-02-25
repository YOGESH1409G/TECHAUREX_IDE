// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const { token } = useAuth(); // Get token for socket auth

  useEffect(() => {
    if (!token) return; // Don't connect without token

    // Connect to /presence namespace with auth token
    const socket = io(`${import.meta.env.VITE_SOCKET_URL}/presence`, {
      auth: {
        token: token // Backend expects token in handshake.auth.token
      },
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;

    // Handle connection events
    socket.on("connect", () => {
      setConnected(true);

      // Rejoin if last room stored
      const lastRoom = localStorage.getItem("lastRoom");
      if (lastRoom) {
        joinRoom(lastRoom);
      }
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // Listen for presence events (backend uses user:online and user:offline)
    socket.on("user:online", ({ userId }) => {
      // Handle user online
      if (import.meta.env.DEV) console.log("User online:", userId);
    });

    socket.on("user:offline", ({ userId, lastSeen }) => {
      // Handle user offline  
      if (import.meta.env.DEV) console.log("User offline:", userId, lastSeen);
      // Handle user offline
      console.log("User offline:", userId, lastSeen);
    });

    socket.on("room-users", (list) => {
      setUsers(list);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]); // Add token to dependencies

  // Emit join-room event
  const joinRoom = (roomId) => {
    if (!socketRef.current) return;
    socketRef.current.emit("join-room", { roomId });
    localStorage.setItem("lastRoom", roomId);
    setRoomId(roomId);
  };

  // 5️⃣ Emit leave-room event
  const leaveRoom = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("leave-room");
    localStorage.removeItem("lastRoom");
    setRoomId(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        users,
        roomId,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
