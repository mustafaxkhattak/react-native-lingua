import type { DailyPlanItem, LanguageId, NextUpActivity } from "@/types/learning";

export const dailyPlans: Record<LanguageId, DailyPlanItem[]> = {
  spanish: [
    {
      id: "spanish-plan-lesson",
      type: "lesson",
      title: "Lesson",
      subtitle: "At the café",
      icon: "book",
      badgeBgColor: "#5844eb",
      xp: 15,
      languageId: "spanish",
    },
    {
      id: "spanish-plan-conversation",
      type: "conversation",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      icon: "headphones",
      badgeBgColor: "#5844eb",
      xp: 10,
      languageId: "spanish",
    },
    {
      id: "spanish-plan-words",
      type: "vocabulary",
      title: "New words",
      subtitle: "10 words",
      icon: "words",
      badgeBgColor: "#f87171",
      xp: 10,
      languageId: "spanish",
    },
  ],
  french: [
    {
      id: "french-plan-lesson",
      type: "lesson",
      title: "Lesson",
      subtitle: "Au café",
      icon: "book",
      badgeBgColor: "#5844eb",
      xp: 15,
      languageId: "french",
    },
    {
      id: "french-plan-conversation",
      type: "conversation",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      icon: "headphones",
      badgeBgColor: "#5844eb",
      xp: 10,
      languageId: "french",
    },
    {
      id: "french-plan-words",
      type: "vocabulary",
      title: "New words",
      subtitle: "10 words",
      icon: "words",
      badgeBgColor: "#f87171",
      xp: 10,
      languageId: "french",
    },
  ],
  japanese: [
    {
      id: "japanese-plan-lesson",
      type: "lesson",
      title: "Lesson",
      subtitle: "At the café",
      icon: "book",
      badgeBgColor: "#5844eb",
      xp: 15,
      languageId: "japanese",
    },
    {
      id: "japanese-plan-conversation",
      type: "conversation",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      icon: "headphones",
      badgeBgColor: "#5844eb",
      xp: 10,
      languageId: "japanese",
    },
    {
      id: "japanese-plan-words",
      type: "vocabulary",
      title: "New words",
      subtitle: "10 words",
      icon: "words",
      badgeBgColor: "#f87171",
      xp: 10,
      languageId: "japanese",
    },
  ],
  korean: [
    {
      id: "korean-plan-lesson",
      type: "lesson",
      title: "Lesson",
      subtitle: "At the café",
      icon: "book",
      badgeBgColor: "#5844eb",
      xp: 15,
      languageId: "korean",
    },
    {
      id: "korean-plan-conversation",
      type: "conversation",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      icon: "headphones",
      badgeBgColor: "#5844eb",
      xp: 10,
      languageId: "korean",
    },
    {
      id: "korean-plan-words",
      type: "vocabulary",
      title: "New words",
      subtitle: "10 words",
      icon: "words",
      badgeBgColor: "#f87171",
      xp: 10,
      languageId: "korean",
    },
  ],
  german: [
    {
      id: "german-plan-lesson",
      type: "lesson",
      title: "Lesson",
      subtitle: "Im Café",
      icon: "book",
      badgeBgColor: "#5844eb",
      xp: 15,
      languageId: "german",
    },
    {
      id: "german-plan-conversation",
      type: "conversation",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      icon: "headphones",
      badgeBgColor: "#5844eb",
      xp: 10,
      languageId: "german",
    },
    {
      id: "german-plan-words",
      type: "vocabulary",
      title: "New words",
      subtitle: "10 words",
      icon: "words",
      badgeBgColor: "#f87171",
      xp: 10,
      languageId: "german",
    },
  ],
  chinese: [
    {
      id: "chinese-plan-lesson",
      type: "lesson",
      title: "Lesson",
      subtitle: "At the café",
      icon: "book",
      badgeBgColor: "#5844eb",
      xp: 15,
      languageId: "chinese",
    },
    {
      id: "chinese-plan-conversation",
      type: "conversation",
      title: "AI Conversation",
      subtitle: "Talk about your day",
      icon: "headphones",
      badgeBgColor: "#5844eb",
      xp: 10,
      languageId: "chinese",
    },
    {
      id: "chinese-plan-words",
      type: "vocabulary",
      title: "New words",
      subtitle: "10 words",
      icon: "words",
      badgeBgColor: "#f87171",
      xp: 10,
      languageId: "chinese",
    },
  ],
};

export const nextUpActivities: Record<LanguageId, NextUpActivity> = {
  spanish: {
    id: "spanish-next-up",
    tag: "Next up",
    title: "AI Video Call",
    subtitle: "Practice speaking",
    actionType: "video-call",
  },
  french: {
    id: "french-next-up",
    tag: "Next up",
    title: "AI Video Call",
    subtitle: "Practice speaking",
    actionType: "video-call",
  },
  japanese: {
    id: "japanese-next-up",
    tag: "Next up",
    title: "AI Video Call",
    subtitle: "Practice speaking",
    actionType: "video-call",
  },
  korean: {
    id: "korean-next-up",
    tag: "Next up",
    title: "AI Video Call",
    subtitle: "Practice speaking",
    actionType: "video-call",
  },
  german: {
    id: "german-next-up",
    tag: "Next up",
    title: "AI Video Call",
    subtitle: "Practice speaking",
    actionType: "video-call",
  },
  chinese: {
    id: "chinese-next-up",
    tag: "Next up",
    title: "AI Video Call",
    subtitle: "Practice speaking",
    actionType: "video-call",
  },
};

export const languageGreetings: Record<LanguageId, string> = {
  spanish: "Hola",
  french: "Bonjour",
  japanese: "こんにちは",
  korean: "안녕하세요",
  german: "Hallo",
  chinese: "你好",
};

export function getDailyPlan(languageId: LanguageId): DailyPlanItem[] {
  return dailyPlans[languageId] ?? dailyPlans.spanish;
}

export function getNextUpActivity(languageId: LanguageId): NextUpActivity {
  return nextUpActivities[languageId] ?? nextUpActivities.spanish;
}

export function getLanguageGreeting(languageId: LanguageId): string {
  return languageGreetings[languageId] ?? "Hola";
}
