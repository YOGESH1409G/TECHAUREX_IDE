import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { joinRoomByCode } from '../services/roomService';

export default function JoinRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [invitedEmail, setInvitedEmail] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const email = searchParams.get('email');

    if (!code) {
      setStatus('error');
      setError('Invalid invitation link. Room code is missing.');
      return;
    }

    setRoomCode(code);
    setInvitedEmail(email || '');

    // If user is not logged in, redirect to signup/login
    if (!user) {
      const redirectUrl = `/join-room?code=${code}${email ? `&email=${email}` : ''}`;
      navigate(`/signup?redirect=${encodeURIComponent(redirectUrl)}&email=${email || ''}`, { replace: true });
      return;
    }

    // User is logged in - attempt to join room automatically
    joinRoom(code);
  }, [searchParams, user, navigate]);

  const joinRoom = async (code) => {
    try {
      setStatus('loading');
      const room = await joinRoomByCode(code);
      setStatus('success');
      
      // Wait a moment to show success message, then navigate
      setTimeout(() => {
        navigate('/editor', { replace: true, state: { room } });
      }, 1500);
    } catch (err) {
      setStatus('error');
      const errorMessage = err.response?.data?.message || err.message || 'Failed to join room';
      setError(errorMessage);
    }
  };

  const handleRetry = () => {
    if (roomCode) {
      joinRoom(roomCode);
    }
  };

  const handleManualJoin = () => {
    navigate('/editor', { state: { openJoinModal: true, roomCode } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-700">
        {status === 'loading' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Joining Room...</h2>
            <p className="text-slate-400">Please wait while we add you to the room.</p>
            {roomCode && (
              <div className="mt-4 bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Room Code:</p>
                <code className="text-indigo-400 font-mono text-lg">{roomCode}</code>
              </div>
            )}
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Successfully Joined! 🎉</h2>
            <p className="text-slate-400">Redirecting you to the editor...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Failed to Join Room</h2>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>

            {roomCode && (
              <div className="mb-6 bg-slate-900/50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Room Code:</p>
                <code className="text-indigo-400 font-mono text-lg">{roomCode}</code>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
              >
                Try Again
              </button>
              <button
                onClick={handleManualJoin}
                className="w-full px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-all"
              >
                Enter Code Manually
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 text-slate-400 hover:text-white transition-all"
              >
                Go to Home
              </button>
            </div>

            {error.includes('expired') && (
              <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-xs">
                  💡 This invitation may have expired. Please ask the room creator to send you a new invitation.
                </p>
              </div>
            )}

            {error.includes('private') && (
              <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-xs">
                  🔒 This is a private room. You need a valid invitation to join.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
