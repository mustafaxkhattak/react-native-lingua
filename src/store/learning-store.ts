import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LearningState {
  xp: number;
  dailyGoalXp: number;
  streak: number;
  completedPlanItemIds: string[];
  currentLevel: string;
  currentUnitNumber: number;
  togglePlanItem: (id: string, xpReward?: number) => void;
  setXp: (xp: number) => void;
  setDailyGoalXp: (goal: number) => void;
  setStreak: (streak: number) => void;
  resetProgress: () => void;
}

const DEFAULT_COMPLETED_ITEMS = [
  "spanish-plan-lesson",
  "french-plan-lesson",
  "japanese-plan-lesson",
  "korean-plan-lesson",
  "german-plan-lesson",
  "chinese-plan-lesson",
];

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      xp: 15,
      dailyGoalXp: 20,
      streak: 12,
      completedPlanItemIds: DEFAULT_COMPLETED_ITEMS,
      currentLevel: "A1",
      currentUnitNumber: 3,

      togglePlanItem: (id: string, xpReward = 5) =>
        set((state) => {
          const isCompleted = state.completedPlanItemIds.includes(id);
          const updatedIds = isCompleted
            ? state.completedPlanItemIds.filter((itemId) => itemId !== id)
            : [...state.completedPlanItemIds, id];

          const xpDelta = isCompleted ? -xpReward : xpReward;
          const newXp = Math.max(0, state.xp + xpDelta);

          return {
            completedPlanItemIds: updatedIds,
            xp: newXp,
          };
        }),

      setXp: (xp: number) => set({ xp: Math.max(0, xp) }),
      setDailyGoalXp: (dailyGoalXp: number) => set({ dailyGoalXp }),
      setStreak: (streak: number) => set({ streak }),
      resetProgress: () =>
        set({
          xp: 15,
          dailyGoalXp: 20,
          streak: 12,
          completedPlanItemIds: DEFAULT_COMPLETED_ITEMS,
        }),
    }),
    {
      name: "lingua-learning-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
