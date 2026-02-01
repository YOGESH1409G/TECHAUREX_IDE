import React from "react";

export default function ChatCalls() {
  return (
    <div className="p-6 text-slate-400 text-sm h-full flex flex-col items-center justify-center">
      <p className="mb-2">📞 No active calls yet.</p>
      <button className="px-4 py-2 rounded-full bg-linear-to-r from-indigo-500 to-blue-500 text-white font-medium">
        Start a Call
      </button>
    </div>
  );
}
