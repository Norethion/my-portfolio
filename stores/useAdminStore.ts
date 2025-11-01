import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Admin store using Zustand
 * Manages admin authentication state with localStorage persistence
 */
interface AdminState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "admin-storage",
    }
  )
);
