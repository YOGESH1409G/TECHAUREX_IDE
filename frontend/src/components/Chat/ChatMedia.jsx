import React from "react";

export default function ChatMedia() {
  const sampleMedia = [
    { id: 1, name: "dashboard_mock.png", type: "image" },
    { id: 2, name: "project_notes.pdf", type: "file" },
  ];

  return (
    <div className="p-4 overflow-y-auto h-full space-y-3">
      {sampleMedia.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-full">
              {m.type === "image" ? "🖼" : "📄"}
            </div>
            <span className="text-sm">{m.name}</span>
          </div>
          <button className="text-slate-400 hover:text-white">⬇</button>
        </div>
      ))}
    </div>
  );
}
