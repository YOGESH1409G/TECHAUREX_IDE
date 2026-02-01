import React, { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export default function Room() {
  const { socket, joinRoom, users, connected } = useSocket();

  useEffect(() => {
    joinRoom("room-123", { id: "user123", displayName: "Yogesh" });
  }, []);

  return (
    <div className="p-6 text-white">
      <h2>Room ID: room-123</h2>
      <p>Socket Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>
      <h3>Users in Room:</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.displayName}</li>
        ))}
      </ul>
    </div>
  );
}
