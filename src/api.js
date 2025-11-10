import axios from "axios";
import { loginRequest } from "./msal-config";

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
      const response = await msalInstance.acquireTokenSilent(loginRequest);
      // Use the access token from response.accessToken
      config.headers.Authorization = `Bearer ${response.accessToken}`;

    } catch (error) {
      if (error instanceof msal.InteractionRequiredAuthError) {
        // Silent acquisition failed, fall back to interactive method
        msalInstance.loginPopup(loginRequest)
          .then(response => {
            config.headers.Authorization = `Bearer ${response.accessToken}`;
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        console.error(error);
      }
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
