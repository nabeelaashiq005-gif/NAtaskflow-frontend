import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// This axios instance is shared across the whole app.
// withCredentials: true is required so the browser sends/receives
// the httpOnly refreshToken cookie on every request.
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// In-memory access token. NOT localStorage — that would be readable by
// any injected script (XSS risk). Living in memory means it's cleared
// on a full page refresh, which is why we call /auth/refresh-token on
// app load to silently get a new one (see AuthContext).
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// Attach the access token to every outgoing request automatically.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// If a request fails with 401 (expired access token), try refreshing
// it ONCE, then retry the original request. If refresh also fails,
// give up and let the error propagate (the app will redirect to /login).
let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Another request already triggered a refresh — wait for it.
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject, originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh-token");
        setAccessToken(data.data.accessToken);

        pendingRequests.forEach(({ resolve, originalRequest: req }) => {
          req.headers.Authorization = `Bearer ${data.data.accessToken}`;
          resolve(api(req));
        });
        pendingRequests = [];

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        pendingRequests.forEach(({ reject }) => reject(refreshError));
        pendingRequests = [];
        setAccessToken(null);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
