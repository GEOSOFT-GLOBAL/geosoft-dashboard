import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export interface User {
  id: string;
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      signin: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data: res } = await axios.post(`${API_BASE}/auth/signin`, {
            email,
            password,
          });

          if (!res.success) {
            throw new Error(res.message || "Sign in failed");
          }

          if (res.data.user.role !== "admin") {
            throw new Error("Access denied. Admin only.");
          }

          set({
            user: res.data.user,
            token: res.data.accessToken,
            isLoading: false,
          });
        } catch (err: unknown) {
          const message = axios.isAxiosError(err)
            ? (err.response?.data?.message as string) || err.message
            : err instanceof Error
              ? err.message
              : "Sign in failed";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "geosoft-admin-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
