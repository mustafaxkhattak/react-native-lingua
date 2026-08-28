import type { Lesson, LessonGoal } from "@/types/learning";

export const lessonGoals: LessonGoal[] = [
  { id: "greetings", text: "Greet someone naturally" },
  { id: "introductions", text: "Introduce yourself" },
  { id: "politeness", text: "Use a polite expression" },
];

export const lessons: Lesson[] = [
  {
    id: "spanish-hello",
    unitId: "spanish-foundations",
    languageId: "spanish",
    number: 1,
    title: "Hello in Spanish",
    description: "Meet someone new and make a friendly first impression.",
    level: "beginner",
    estimatedMinutes: 5,
    xp: 20,
    goalIds: ["greetings", "introductions", "politeness"],
    vocabulary: [
      { id: "es-hola", word: "Hola", translation: "Hello", example: "Hola, Ana." },
      { id: "es-gracias", word: "Gracias", translation: "Thank you" },
      { id: "es-nombre", word: "nombre", translation: "name", partOfSpeech: "noun" },
    ],
    phrases: [
      { id: "es-me-llamo", text: "Me llamo Alex.", translation: "My name is Alex." },
      { id: "es-mucho-gusto", text: "Mucho gusto.", translation: "Nice to meet you." },
    ],
    activities: [
      { id: "es-vocabulary", type: "vocabulary", vocabularyIds: ["es-hola", "es-gracias", "es-nombre"] },
      { id: "es-choice", type: "multiple-choice", prompt: "What does Hola mean?", options: ["Goodbye", "Hello", "Please"], answer: "Hello" },
      { id: "es-speaking", type: "speaking", prompt: "Say: My name is Alex.", expectedText: "Me llamo Alex." },
    ],
    aiTeacherPrompt: {
      system: "You are a warm Spanish teacher for a complete beginner.",
      opening: "Hola. Vamos a practicar una presentación amistosa.",
      coachingFocus: "Keep corrections short and encourage clear pronunciation of hola and llamo.",
    },
  },
  {
    id: "french-hello",
    unitId: "french-foundations",
    languageId: "french",
    number: 1,
    title: "Hello in French",
    description: "Practice a simple greeting and introduction.",
    level: "beginner",
    estimatedMinutes: 5,
    xp: 20,
    goalIds: ["greetings", "introductions", "politeness"],
    vocabulary: [
      { id: "fr-bonjour", word: "Bonjour", translation: "Hello" },
      { id: "fr-merci", word: "Merci", translation: "Thank you" },
      { id: "fr-nom", word: "nom", translation: "name", partOfSpeech: "noun" },
    ],
    phrases: [
      { id: "fr-je-mappelle", text: "Je m'appelle Alex.", translation: "My name is Alex." },
      { id: "fr-enchante", text: "Enchanté.", translation: "Nice to meet you." },
    ],
    activities: [
      { id: "fr-vocabulary", type: "vocabulary", vocabularyIds: ["fr-bonjour", "fr-merci", "fr-nom"] },
      { id: "fr-choice", type: "multiple-choice", prompt: "What does Merci mean?", options: ["Please", "Hello", "Thank you"], answer: "Thank you" },
      { id: "fr-speaking", type: "speaking", prompt: "Say: My name is Alex.", expectedText: "Je m'appelle Alex." },
    ],
    aiTeacherPrompt: {
      system: "You are a patient French teacher for a complete beginner.",
      opening: "Bonjour. Let's practice your first French introduction.",
      coachingFocus: "Model the soft pronunciation of bonjour and invite the learner to repeat each phrase.",
    },
  },
  {
    id: "japanese-hello",
    unitId: "japanese-foundations",
    languageId: "japanese",
    number: 1,
    title: "Hello in Japanese",
    description: "Use a polite greeting and share your name.",
    level: "beginner",
    estimatedMinutes: 5,
    xp: 20,
    goalIds: ["greetings", "introductions", "politeness"],
    vocabulary: [
      { id: "ja-konnichiwa", word: "こんにちは", translation: "Hello", pronunciation: "konnichiwa" },
      { id: "ja-arigatou", word: "ありがとう", translation: "Thank you", pronunciation: "arigatou" },
      { id: "ja-namae", word: "名前", translation: "name", pronunciation: "namae" },
    ],
    phrases: [
      { id: "ja-hajimemashite", text: "はじめまして。", translation: "Nice to meet you.", pronunciation: "hajimemashite" },
      { id: "ja-watashi", text: "私は Alex です。", translation: "I am Alex.", pronunciation: "watashi wa Alex desu" },
    ],
    activities: [
      { id: "ja-vocabulary", type: "vocabulary", vocabularyIds: ["ja-konnichiwa", "ja-arigatou", "ja-namae"] },
      { id: "ja-choice", type: "multiple-choice", prompt: "What does ありがとう mean?", options: ["Hello", "Thank you", "Goodbye"], answer: "Thank you" },
      { id: "ja-speaking", type: "speaking", prompt: "Say: Nice to meet you.", expectedText: "はじめまして。" },
    ],
    aiTeacherPrompt: {
      system: "You are a patient Japanese teacher for a complete beginner.",
      opening: "こんにちは. Let's practice a polite Japanese introduction.",
      coachingFocus: "Use romanization when helpful, then guide the learner toward the Japanese sounds.",
    },
  },
];