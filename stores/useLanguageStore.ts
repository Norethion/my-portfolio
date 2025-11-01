import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Language store using Zustand
 * Manages TR/EN language state with persistence
 */
interface LanguageState {
  language: "tr" | "en";
  setLanguage: (language: "tr" | "en") => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "tr",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "language-storage",
    }
  )
);

