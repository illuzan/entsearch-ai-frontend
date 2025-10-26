// src/api.js
import axios from "axios";

// Replace with your backend URL
const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Call search API
export const searchQuery = async (query) => {
  const response = await api.post("/sec-query", { query });
  // const response = await api.post(`/sec-query?query=${query}`);
  return response.data; // Adjust based on your API response
};

export default api;
