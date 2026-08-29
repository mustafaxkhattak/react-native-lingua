import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LearningState {
  xp: number;
  dailyGoalXp: number;
  streak: number;
  completedPlanItemIds: string[];
  completedLessonIds: string[];
  activeLessonId: string | null;
  bookmarkedLessonIds: string[];
  currentLevel: string;
  currentUnitNumber: number;
  togglePlanItem: (id: string, xpReward?: number) => void;
  toggleLessonCompleted: (id: string, xpReward?: number) => void;
  setActiveLessonId: (id: string | null) => void;
  toggleBookmark: (id: string) => void;
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

const DEFAULT_COMPLETED_LESSONS = [
  "spanish-greetings",
  "spanish-daily-life",
  "french-greetings",
  "french-daily-life",
  "japanese-greetings",
  "japanese-daily-life",
];

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      xp: 15,
      dailyGoalXp: 20,
      streak: 12,
      completedPlanItemIds: DEFAULT_COMPLETED_ITEMS,
      completedLessonIds: DEFAULT_COMPLETED_LESSONS,
      activeLessonId: null,
      bookmarkedLessonIds: ["spanish-cafe", "french-cafe", "japanese-cafe"],
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

      toggleLessonCompleted: (id: string, xpReward = 20) =>
        set((state) => {
          const isCompleted = state.completedLessonIds.includes(id);
          const updatedIds = isCompleted
            ? state.completedLessonIds.filter((lessonId) => lessonId !== id)
            : [...state.completedLessonIds, id];

          const xpDelta = isCompleted ? -xpReward : xpReward;
          const newXp = Math.max(0, state.xp + xpDelta);

          return {
            completedLessonIds: updatedIds,
            xp: newXp,
          };
        }),

      setActiveLessonId: (id: string | null) => set({ activeLessonId: id }),

      toggleBookmark: (id: string) =>
        set((state) => {
          const isBookmarked = state.bookmarkedLessonIds.includes(id);
          const updatedBookmarks = isBookmarked
            ? state.bookmarkedLessonIds.filter((item) => item !== id)
            : [...state.bookmarkedLessonIds, id];
          return { bookmarkedLessonIds: updatedBookmarks };
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
          completedLessonIds: DEFAULT_COMPLETED_LESSONS,
          activeLessonId: null,
          bookmarkedLessonIds: ["spanish-cafe", "french-cafe", "japanese-cafe"],
        }),
    }),
    {
      name: "lingua-learning-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
