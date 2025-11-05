// src/api.js
import axios from "axios";

// Replace with your backend URL
const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Store MSAL instance for token refresh
let msalInstance = null;

export function setMsalInstance(instance) {
  msalInstance = instance;
}

// Interceptor to attach MSAL token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Get token from sessionStorage (set by MSAL)
      let token = sessionStorage.getItem("msal_access_token");

      // If no token or expired, try to refresh it
      if (!token && msalInstance) {
        try {
          const response = await msalInstance.acquireTokenSilent({
            scopes: ["api://badcff2b-632b-4a5b-ae01-af2c9243a164/access_as_user"],
          });
          token = response.accessToken;
          sessionStorage.setItem("msal_access_token", token);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error adding token to request:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Token may have expired");
      // You can trigger a re-login here if needed
    }
    return Promise.reject(error);
  }
);

export default api;
