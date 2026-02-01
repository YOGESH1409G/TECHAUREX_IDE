import React, { useState, useEffect } from "react";
import { createRoom, getContacts, joinRoomByCode } from "../../services/roomService";

export default function CreateJoinModal({ type, onClose, onJoin }) {
  // Multi-step state for Create Room flow
  const [step, setStep] = useState(type === "create" ? 1 : 0); // 0 = join, 1 = select type, 2 = create form
  const [group, setGroup] = useState(null); // null = not selected, false = 1:1, true = group

  // Join Room state
  const [roomId, setRoomId] = useState("");

  // 1:1 Room state
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Group Room state
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  // General state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdRoom, setCreatedRoom] = useState(null); // Store created group room for room code display

  // Fetch contacts when step 2A (1:1) is reached
  useEffect(() => {
    if (step === 2 && group === false) {
      setLoadingContacts(true);
      getContacts()
        .then((data) => setContacts(data || []))
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to load contacts");
        })
        .finally(() => setLoadingContacts(false));
    }
  }, [step, group]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (type === "create") {
      setStep(1);
      setGroup(null);
    } else {
      setStep(0);
    }
    setError("");
    setCreatedRoom(null);
  }, [type]);

  const handleJoinSubmit = async () => {
    if (!roomId.trim()) {
      setError("Please enter a room code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Try to join room using API
      const room = await joinRoomByCode(roomId.trim());
      onJoin(room);
      onClose();
    } catch (err) {
      // If API fails, fallback to basic room object (for backward compatibility)
      if (err.response?.status === 404) {
        setError("Room not found. Please check the room code.");
      } else {
        setError(err.response?.data?.message || "Failed to join room");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNextFromTypeSelection = () => {
    if (group === null) return;
    setStep(2);
    setError("");
  };

  const handleCreate1on1 = async () => {
    if (!selectedContact) {
      setError("Please select a contact");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const room = await createRoom({
        group: false,
        participants: [selectedContact.id || selectedContact._id],
      });
      onJoin(room);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!roomName.trim()) {
      setError("Room name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const room = await createRoom({
        group: true,
        roomName: roomName.trim(),
        description: description.trim() || undefined,
        avatar: avatar.trim() || undefined,
        isPrivate,
      });

      setCreatedRoom(room);
      // Don't close modal yet - show room code
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToChat = () => {
    if (createdRoom) {
      onJoin(createdRoom);
      onClose();
    }
  };

  const copyRoomCode = () => {
    const roomCode = createdRoom?.roomCode || createdRoom?.code;
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      // You could show a toast here
      alert("Room code copied to clipboard!");
    }
  };

  // Render Join Room (simple flow)
  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#121212] rounded-xl p-6 w-[320px] border border-slate-700">
          <h2 className="text-xl font-semibold mb-3">Join Room</h2>
          <input
            type="text"
            placeholder="Room Code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full bg-slate-900 p-2 rounded mb-3 outline-none text-white"
            disabled={loading}
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleJoinSubmit}
              className="px-4 py-1 rounded bg-gradient-to-r from-indigo-500 to-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Step 1: Select Room Type
  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#121212] rounded-xl p-6 w-[400px] border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Create Room</h2>
          <p className="text-slate-400 text-sm mb-4">Select room type</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setGroup(false)}
              className={`p-6 rounded-xl border-2 transition-all ${
                group === false
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="text-3xl mb-2">1:1</div>
              <div className="text-sm font-medium">One-to-One</div>
            </button>

            <button
              onClick={() => setGroup(true)}
              className={`p-6 rounded-xl border-2 transition-all ${
                group === true
                  ? "border-indigo-500 bg-indigo-500/20"
                  : "border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="text-3xl mb-2">👥</div>
              <div className="text-sm font-medium">Group</div>
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleNextFromTypeSelection}
              className="px-4 py-1 rounded bg-gradient-to-r from-indigo-500 to-blue-500 disabled:opacity-50"
              disabled={group === null}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Step 2A: One-to-One Room (Contacts List)
  if (step === 2 && group === false) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#121212] rounded-xl p-6 w-[400px] max-h-[600px] border border-slate-700 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Select Contact</h2>

          {loadingContacts ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Loading contacts...
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              No contacts available
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {contacts.map((contact) => (
                <button
                  key={contact.id || contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedContact?.id === contact.id ||
                    selectedContact?._id === contact._id
                      ? "bg-indigo-500/20 border-2 border-indigo-500"
                      : "bg-slate-900 hover:bg-slate-800 border-2 border-transparent"
                  }`}
                >
                  <div className="font-medium text-white">
                    {contact.displayName ||
                      contact.name ||
                      contact.email ||
                      "Unknown"}
                  </div>
                  {contact.email && (
                    <div className="text-xs text-slate-400 mt-1">
                      {contact.email}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-slate-400 hover:text-white"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleCreate1on1}
              className="px-4 py-1 rounded bg-gradient-to-r from-indigo-500 to-blue-500 disabled:opacity-50"
              disabled={!selectedContact || loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Step 2B: Group Room (Form)
  if (step === 2 && group === true) {
    // If room created, show success with room code
    if (createdRoom) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-xl p-6 w-[400px] border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Room Created!</h2>
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">Room Code:</p>
              <div className="flex items-center gap-2 bg-slate-900 p-3 rounded">
                <code className="flex-1 text-lg font-mono text-white">
                  {createdRoom.roomCode || createdRoom.code || "N/A"}
                </code>
                <button
                  onClick={copyRoomCode}
                  className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleGoToChat}
                className="px-4 py-1 rounded bg-gradient-to-r from-indigo-500 to-blue-500"
              >
                Go to Chat
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Show form
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#121212] rounded-xl p-6 w-[400px] border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Create Group Room</h2>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Room Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-slate-900 p-2 rounded outline-none text-white"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Description (Optional)
              </label>
              <textarea
                placeholder="Enter room description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 p-2 rounded outline-none text-white resize-none"
                rows="3"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Avatar URL (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter avatar URL"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-slate-900 p-2 rounded outline-none text-white"
                disabled={loading}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 rounded"
                disabled={loading}
              />
              <span className="text-sm text-slate-400">Private Room</span>
            </label>
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-slate-400 hover:text-white"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleCreateGroup}
              className="px-4 py-1 rounded bg-gradient-to-r from-indigo-500 to-blue-500 disabled:opacity-50"
              disabled={!roomName.trim() || loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
