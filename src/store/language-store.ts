import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LanguageId } from "@/types/learning";

interface LanguageState {
  selectedLanguage: LanguageId | null;
  setSelectedLanguage: (language: LanguageId) => void;
  clearSelectedLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: null,
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      clearSelectedLanguage: () => set({ selectedLanguage: null }),
    }),
    {
      name: "lingua-language-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useLanguageStoreHydrated = () => {
  return useSyncExternalStore(
    (onStoreChange) => useLanguageStore.persist.onFinishHydration(onStoreChange),
    () => useLanguageStore.persist.hasHydrated(),
    () => false,
  );
};

