import React from "react";
import dayjs from "dayjs";
import { useSettings } from "../../context/SettingsContext";

export default function ChatMessage({ message, currentUser }) {
  const mine = message.username === currentUser;
  const { settings } = useSettings();
  const compact = settings?.chat?.compactMode;
  const showTs = settings?.chat?.showTimestamps !== false;
  return (
    <div className={`flex mb-3 ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] ${compact ? "px-2 py-1" : "px-3 py-2"} rounded-2xl ${
          mine
            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        <p className="text-sm">{message.msg}</p>
        {showTs && (
          <p className="text-[10px] text-slate-300 text-right mt-1">
            {dayjs(message.createdAt).format("hh:mm A")}
          </p>
        )}
      </div>
    </div>
  );
}
