import React from "react";

export default function ChatTabs({ activeTab, setActiveTab }) {
  const tabs = ["Rooms", "Media"];

  return (
    <div className="flex flex-col">
      <div className="flex justify-around border-b border-slate-800 bg-[#0f0f12]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-500 to-blue-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
