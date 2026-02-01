import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    // Handle error
    if (error) {
      console.error('OAuth Error:', error);
      navigate(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    // Handle success
    if (token && refreshToken && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store tokens
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Update auth context
        login(user, token);
        
        // Redirect to editor
        navigate('/editor');
      } catch (err) {
        console.error('Failed to parse OAuth response:', err);
        navigate('/login?error=Invalid authentication response');
      }
    } else {
      // Missing parameters
      navigate('/login?error=Missing authentication data');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}
