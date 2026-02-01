import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import ChatRoom from './Chat/ChatRoom';
import ChatRoomList from './Chat/ChatRoomList';
import ChatTabs from './Chat/ChatTabs';
import ChatMedia from './Chat/ChatMedia';
import SettingsModal from './SettingsModal';
import { Settings } from 'lucide-react';

export default function Navbar({ language, theme, onLanguageChange, onThemeChange }) {
  const { user, logout } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeTab, setActiveTab] = useState('Rooms');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate('/login');
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' },
    { value: 'vs', label: 'Visual Studio' },
  ];

  return (
    <div className="w-full h-12 bg-gray-800 flex items-center px-4 shadow gap-4">
      <h1 className="text-lg font-semibold text-white mr-4">TECH AUREX EDITOR</h1>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-300">Language:</label>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-300">Theme:</label>
        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Chat dropdown trigger */}
      <div className="relative">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Chat
        </button>
      </div>

      {/* Settings trigger next to Chat */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="ml-2 p-2 rounded bg-slate-700 hover:bg-slate-600 text-white"
        title="Settings"
        aria-label="Open settings"
      >
        <Settings size={16} />
      </button>

      {/* User info and logout */}
      <div className="ml-auto flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-300">Welcome, {user.displayName || user.email}!</span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm transition"
        >
          Logout
        </button>
      </div>

      {/* Fixed-position dropdown panel under navbar */}
      {chatOpen && (
        <div className="fixed right-4 top-12 z-50 w-[420px] h-[560px] bg-[#0d0d0f] text-white border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
          {!activeRoom && (
            <ChatTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
          <div className="flex-1 overflow-hidden">
            {activeRoom ? (
              <ChatRoom
                room={activeRoom}
                username={user?.displayName || user?.email || user?.name || 'Anonymous'}
                onBack={() => setActiveRoom(null)}
              />
            ) : activeTab === 'Rooms' ? (
              <ChatRoomList onJoinRoom={(room) => setActiveRoom(room)} />
            ) : (
              <ChatMedia />
            )}
          </div>
          <button
            onClick={() => setChatOpen(false)}
            className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-full w-8 h-8 text-base flex items-center justify-center shadow"
            title="Close"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>
      )}

      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}

      {/* Listen for global open chat event */}
      <EventListener onOpenChat={() => setChatOpen(true)} />
    </div>
  );
}

function EventListener({ onOpenChat }) {
  useEffect(() => {
    const handler = () => onOpenChat();
    window.addEventListener('APP_OPEN_CHAT', handler);
    return () => window.removeEventListener('APP_OPEN_CHAT', handler);
  }, [onOpenChat]);
  return null;
}
