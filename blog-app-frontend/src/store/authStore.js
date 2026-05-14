import { create } from "zustand";
import api from "../api/axiosInstance";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,
  isCheckingAuth: false,
  login: async (userCred) => {
    try {
      //set loading true
      set({ loading: true, currentUser: null, isAuthenticated: false, error: null });
      //make api call
      let res = await api.post("/auth/login", userCred);
      //update state
      if (res.status === 200) {
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Login failed",
      });
    }
  },
  logout: async () => {
    try {
      //make logout api req
      let res = await api.get("/auth/logout");
      //update state
      if (res.status === 200) {
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      }
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Logout failed",
      });
    }
  },
  // restore login
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await api.get("/auth/check-auth");

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (err) {
      // If user is not logged in or has invalid/old role → clear session
      if (err.response?.status === 401 || err.response?.status === 403) {
        set({
          currentUser: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
        return;
      }

      // other errors
      console.error("Auth check failed:", err);
      set({ isCheckingAuth: false });
    }
  },
}));