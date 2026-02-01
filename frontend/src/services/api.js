import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://techaurex.onrender.com',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original?._retry) {
      original._retry = true;
      if (refreshing) {
        await new Promise((r) => queue.push(r));
        const token = localStorage.getItem('auth_token');
        if (token) original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
      try {
        refreshing = true;
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('Refresh token missing');

        // Backend uses /refresh (not /refresh-token)
        const resp = await api.post('/api/v1/auth/refresh', { refreshToken });
        
        // Backend wraps in ApiResponse: { statusCode, data, message, success }
        // Access actual payload via resp.data.data
        const { newAccessToken, newRefreshToken } = resp.data.data;

        if (newAccessToken) localStorage.setItem('auth_token', newAccessToken);
        if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
      } catch (refreshErr) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw refreshErr;
      } finally {
        refreshing = false;
        queue.forEach((r) => r());
        queue = [];
      }
      const token = localStorage.getItem('auth_token');
      if (token) original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    }
    throw err;
  }
);

export default api;


