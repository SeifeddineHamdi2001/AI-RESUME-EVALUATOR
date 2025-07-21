import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://ai-resume-evaluator-j4px.onrender.com/api',
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
          throw new Error('No token available');
        }

        const refreshResponse = await axios.post('https://ai-resume-evaluator-j4px.onrender.com/api/auth/refresh-token', {}, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });

        const newToken = refreshResponse.data.token;
        localStorage.setItem('token', newToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 