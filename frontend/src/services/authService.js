import api from './api';

// Manual Authentication - Backend wraps all responses in ApiResponse
// Structure: { statusCode, data: { user, accessToken, refreshToken }, message, success }

export const loginUser = async ({ email, password }) => {
  const { data: response } = await api.post('/api/v1/auth/login', { email, password });
  
  // Backend wraps in ApiResponse, access via response.data
  const { user, accessToken, refreshToken } = response.data;
  
  if (accessToken) localStorage.setItem('auth_token', accessToken);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
  
  return { user, accessToken, token: accessToken }; // Return for AuthContext compatibility
};

export const signupUser = async ({ displayName, email, phoneNumber, password }) => {
  // Backend expects 'name' not 'displayName'
  const payload = { name: displayName, email, phone: phoneNumber, password };
  
  const { data: response } = await api.post('/api/v1/auth/register', payload);
  
  // Backend wraps in ApiResponse
  const { user, accessToken, refreshToken } = response.data;
  
  if (accessToken) localStorage.setItem('auth_token', accessToken);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
  
  return { user, accessToken, token: accessToken }; // Return for AuthContext compatibility
};

export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      // Backend expects refreshToken in body
      await api.post('/api/v1/auth/logout', { refreshToken });
    }
  } catch (error) {
    console.error("Logout failed on backend:", error);
  } finally {
    // Remove both tokens
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
};

export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem('refresh_token');
  if (!refreshTokenValue) throw new Error('No refresh token available');

  // Backend uses /refresh (not /refresh-token as in docs)
  const { data: response } = await api.post('/api/v1/auth/refresh', { 
    refreshToken: refreshTokenValue 
  });
  
  // Backend returns { newAccessToken, newRefreshToken }
  const { newAccessToken, newRefreshToken } = response.data;
  
  if (newAccessToken) localStorage.setItem('auth_token', newAccessToken);
  if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
  
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// OAuth Authentication - OAuth returns nested tokens object
export const startGoogleOAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/oauth/google`;
};

export const startGitHubOAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/oauth/github`;
};

export const verifyOAuthPhone = async ({ phone }) => {
  // Requires Authorization header (handled by api interceptor)
  const { data: response } = await api.post('/api/v1/oauth/verify-phone', { phone });
  
  // OAuth returns nested tokens: { user, tokens: { accessToken, refreshToken } }
  const { user, tokens } = response.data;
  const { accessToken, refreshToken } = tokens;
  
  if (accessToken) localStorage.setItem('auth_token', accessToken);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
  
  return { user, accessToken, token: accessToken };
};
