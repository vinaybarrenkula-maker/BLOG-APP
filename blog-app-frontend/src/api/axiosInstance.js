import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? "" : "http://localhost:5000"),
  withCredentials: true,
});

export default api;
