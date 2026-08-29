import type { LanguageId, SupportedLanguage } from "@/types/learning";

const languageFlags: Record<LanguageId, string> = {
  spanish: "🇪🇸",
  french: "🇫🇷",
  japanese: "🇯🇵",
  korean: "🇰🇷",
  german: "🇩🇪",
  chinese: "🇨🇳",
};

export function getLanguageFlag(languageId: LanguageId): string {
  return languageFlags[languageId];
}

export const languages: SupportedLanguage[] = [
  {
    id: "spanish",
    name: "Spanish",
    nativeName: "Español",
    flag: getLanguageFlag("spanish"),
    learnerCount: "28.4M learners",
    description: "Build confidence with everyday Spanish.",
  },
  {
    id: "french",
    name: "French",
    nativeName: "Français",
    flag: getLanguageFlag("french"),
    learnerCount: "19.4M learners",
    description: "Start speaking useful French from day one.",
  },
  {
    id: "japanese",
    name: "Japanese",
    nativeName: "日本語",
    flag: getLanguageFlag("japanese"),
    learnerCount: "12.7M learners",
    description: "Learn friendly Japanese for simple conversations.",
  },
  // {
  //   id: "korean",
  //   name: "Korean",
  //   nativeName: "한국어",
  //   flag: getLanguageFlag("korean"),
  //   learnerCount: "9.3M learners",
  //   description: "Explore Korean through everyday conversations.",
  // },
  // {
  //   id: "german",
  //   name: "German",
  //   nativeName: "Deutsch",
  //   flag: getLanguageFlag("german"),
  //   learnerCount: "8.1M learners",
  //   description: "Make steady progress with practical German.",
  // },
  // {
  //   id: "chinese",
  //   name: "Chinese",
  //   nativeName: "中文",
  //   flag: getLanguageFlag("chinese"),
  //   learnerCount: "7.4M learners",
  //   description: "Build a foundation for real-world Chinese.",
  // },
];