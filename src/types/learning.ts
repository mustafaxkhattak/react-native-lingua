export type LanguageId =
  | "spanish"
  | "french"
  | "japanese"
  | "korean"
  | "german"
  | "chinese";

export type ActivityType =
  | "vocabulary"
  | "multiple-choice"
  | "translation"
  | "speaking"
  | "listening"
  | "conversation";

export interface SupportedLanguage {
  id: LanguageId;
  name: string;
  nativeName: string;
  flag: string;
  learnerCount: string;
  description: string;
}

export interface Unit {
  id: string;
  languageId: LanguageId;
  number: number;
  title: string;
  description: string;
  lessonIds: string[];
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  partOfSpeech?: string;
  pronunciation?: string;
  example?: string;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  pronunciation?: string;
}

export interface MultipleChoiceActivity {
  id: string;
  type: "multiple-choice";
  prompt: string;
  options: string[];
  answer: string;
}

export interface TranslationActivity {
  id: string;
  type: "translation";
  prompt: string;
  answer: string;
}

export interface SpeakingActivity {
  id: string;
  type: "speaking";
  prompt: string;
  expectedText: string;
}

export interface ListeningActivity {
  id: string;
  type: "listening";
  prompt: string;
  transcript: string;
}

export interface ConversationActivity {
  id: string;
  type: "conversation";
  prompt: string;
  suggestedReply: string;
}

export interface VocabularyActivity {
  id: string;
  type: "vocabulary";
  vocabularyIds: string[];
}

export type LessonActivity =
  | VocabularyActivity
  | MultipleChoiceActivity
  | TranslationActivity
  | SpeakingActivity
  | ListeningActivity
  | ConversationActivity;

export interface LessonGoal {
  id: string;
  text: string;
}

export interface AITeacherPrompt {
  system: string;
  opening: string;
  coachingFocus: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  languageId: LanguageId;
  number: number;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  xp: number;
  goalIds: string[];
  activities: LessonActivity[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  aiTeacherPrompt: AITeacherPrompt;
}