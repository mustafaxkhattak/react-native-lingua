import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AiTeacherHeader } from "@/components/audio-lesson/ai-teacher-header";
import { AiTeacherStage } from "@/components/audio-lesson/ai-teacher-stage";
import { AudioLessonControls } from "@/components/audio-lesson/audio-lesson-controls";
import { LessonFeedbackCard } from "@/components/audio-lesson/lesson-feedback-card";
import { SubtitlesModal } from "@/components/audio-lesson/subtitles-modal";
import { lessons } from "@/data/lessons";
import { useLanguageStore } from "@/store/language-store";
import { useLearningStore } from "@/store/learning-store";
import type { Phrase } from "@/types/learning";

interface AudioLessonViewProps {
  lessonId?: string;
  onBack?: () => void;
}

export function AudioLessonView({ lessonId, onBack }: AudioLessonViewProps) {
  const posthog = usePostHog();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage) ?? "spanish";
  const activeLessonIdFromStore = useLearningStore((state) => state.activeLessonId);
  const toggleLessonCompleted = useLearningStore((state) => state.toggleLessonCompleted);
  const completedLessonIds = useLearningStore((state) => state.completedLessonIds);

  // Resolve target lesson
  const resolvedLesson = useMemo(() => {
    const targetId = lessonId || activeLessonIdFromStore;
    if (targetId) {
      const found = lessons.find((l) => l.id === targetId);
      if (found) return found;
    }
    // Fallback to current language's 3rd lesson ("At the Café") or first
    const langLessons = lessons.filter((l) => l.languageId === selectedLanguage);
    return langLessons[2] || langLessons[0] || lessons[0];
  }, [lessonId, activeLessonIdFromStore, selectedLanguage]);

  // Call timer simulation
  const [callSeconds, setCallSeconds] = useState(12);
  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // UI Interactive States
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isSubtitlesOpen, setIsSubtitlesOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  // Speech bubble text
  const [speechPrimary, setSpeechPrimary] = useState("¡Muy bien!");
  const [speechSecondary, setSpeechSecondary] = useState("That was great! 👏");

  // Feedback scores
  const [scores, setScores] = useState({
    speaking: "Excellent",
    pronunciation: "Great",
    grammar: "Good",
  });

  // Track session start
  useEffect(() => {
    posthog.capture("ai_teacher_lesson_viewed", {
      lesson_id: resolvedLesson.id,
      lesson_title: resolvedLesson.title,
      language_id: resolvedLesson.languageId,
    });
  }, [resolvedLesson, posthog]);

  // Handle speaker audio playback simulation
  const handlePlayAudio = () => {
    setIsPlayingAudio(true);

    // Pick current or next phrase from the lesson
    const currentPhrase = resolvedLesson.phrases[activePhraseIndex];
    if (currentPhrase) {
      setSpeechPrimary(currentPhrase.text);
      setSpeechSecondary(`${currentPhrase.translation} 👏`);
    }

    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  // Handle selecting a phrase from subtitles sheet
  const handleSelectPhrase = (phrase: Phrase, index: number) => {
    setActivePhraseIndex(index);
    setSpeechPrimary(phrase.text);
    setSpeechSecondary(phrase.translation);
    setIsSubtitlesOpen(false);
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 1000);
  };

  // Handle mic toggle (practice speaking simulation)
  const handleToggleMic = () => {
    const nextState = !isMicActive;
    setIsMicActive(nextState);

    if (nextState) {
      // User turned on mic -> simulate listening and recognition
      setSpeechPrimary("Listening...");
      setSpeechSecondary("Speak clearly into the microphone 🎙️");

      setTimeout(() => {
        const phrase = resolvedLesson.phrases[activePhraseIndex] || resolvedLesson.phrases[0];
        setSpeechPrimary("¡Muy bien!");
        setSpeechSecondary(phrase ? `"${phrase.text}" sounded great! 👏` : "That was great! 👏");
        setScores({
          speaking: "Excellent",
          pronunciation: "Great",
          grammar: "Good",
        });
      }, 1500);
    }
  };

  // Handle ending call & completing lesson
  const handleEndCall = () => {
    posthog.capture("ai_teacher_lesson_completed", {
      lesson_id: resolvedLesson.id,
      duration_seconds: callSeconds,
      xp_awarded: resolvedLesson.xp || 20,
    });

    // Mark completed if not yet
    if (!completedLessonIds.includes(resolvedLesson.id)) {
      toggleLessonCompleted(resolvedLesson.id, resolvedLesson.xp || 20);
    }

    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Top Header */}
      <AiTeacherHeader
        statusText="Online"
        counterValue={callSeconds}
        onBack={onBack}
        onCameraToggle={() => setIsCameraActive((prev) => !prev)}
        onProfilePress={() => setIsSubtitlesOpen(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical={false}
      >
        {/* Main Teacher & Mascot Stage with Picture in Picture and Speech Bubble */}
        <AiTeacherStage
          primaryPhrase={speechPrimary}
          secondaryPhrase={speechSecondary}
          isCameraActive={isCameraActive}
          isPlayingAudio={isPlayingAudio}
          onPlayAudio={handlePlayAudio}
        />

        {/* Audio Lesson Control Buttons (Camera, Mic, Subtitles, End Call) */}
        <AudioLessonControls
          isCameraOn={isCameraActive}
          isMicOn={isMicActive}
          isSubtitlesActive={isSubtitlesOpen}
          onToggleCamera={() => setIsCameraActive((prev) => !prev)}
          onToggleMic={handleToggleMic}
          onToggleSubtitles={() => setIsSubtitlesOpen((prev) => !prev)}
          onEndCall={handleEndCall}
        />

        {/* 3-Column Feedback Scorecard (Speaking, Pronunciation, Grammar) */}
        <LessonFeedbackCard
          speakingScore={scores.speaking}
          pronunciationScore={scores.pronunciation}
          grammarScore={scores.grammar}
        />

        {/* Bottom spacer for tab bar clearance */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Subtitles & Phrases Drawer Modal */}
      <SubtitlesModal
        visible={isSubtitlesOpen}
        onClose={() => setIsSubtitlesOpen(false)}
        lesson={resolvedLesson}
        activePhraseIndex={activePhraseIndex}
        onSelectPhrase={handleSelectPhrase}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  bottomSpacer: {
    height: 20,
  },
});
