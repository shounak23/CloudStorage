import axios from "axios";
import store from "../store/store";
import { setCredentials, logout } from "../store/slices/authSlice";

const BASE_URL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ---------- Request: attach access token ----------
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---------- Response: refresh on 401 ----------
let refreshPromise = null; // shared, so only ONE refresh runs at a time

const refreshAccessToken = async () => {
  // plain axios (not axiosInstance) so interceptors don't loop
  const res = await axios.post(`${BASE_URL}/auth/refresh`, null, {
    withCredentials: true,
  });
  const accessToken = res.data.data.accessToken;
  const user = store.getState().auth.user;
  store.dispatch(setCredentials({ user, accessToken }));
  return accessToken;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // network error or no config: just reject
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    const isAuthUrl =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh");

    // 401 on a normal request that has not been retried yet
    if (status === 401 && !originalRequest._retry && !isAuthUrl) {
      originalRequest._retry = true; // mark: second failure will not refresh again

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // retry once
      } catch (refreshError) {
        store.dispatch(logout()); // refresh failed: session is dead
        return Promise.reject(refreshError);
      }
    }

    // 401 again after retry: session invalid
    if (status === 401 && originalRequest._retry) {
      store.dispatch(logout());
    }

    // 403 and everything else: no refresh, let the component show the message
    return Promise.reject(error);
  },
);

export default axiosInstance;