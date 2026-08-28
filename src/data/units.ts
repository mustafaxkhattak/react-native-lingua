import type { Unit } from "@/types/learning";

export const units: Unit[] = [
  {
    id: "spanish-foundations",
    languageId: "spanish",
    number: 1,
    title: "Spanish foundations",
    description: "Say hello, introduce yourself, and be polite.",
    lessonIds: ["spanish-hello"],
  },
  {
    id: "french-foundations",
    languageId: "french",
    number: 1,
    title: "French foundations",
    description: "Learn your first greetings and introductions.",
    lessonIds: ["french-hello"],
  },
  {
    id: "japanese-foundations",
    languageId: "japanese",
    number: 1,
    title: "Japanese foundations",
    description: "Greet people and introduce yourself simply.",
    lessonIds: ["japanese-hello"],
  },
];