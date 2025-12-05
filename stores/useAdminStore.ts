import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Admin store using Zustand
 * Manages admin authentication state with localStorage persistence
 */
interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      login: (token) => set({ isAuthenticated: true, token }),
      logout: () => set({ isAuthenticated: false, token: null }),
    }),
    {
      name: "admin-storage",
    }
  )
);
