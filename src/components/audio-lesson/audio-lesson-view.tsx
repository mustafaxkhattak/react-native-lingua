import { useUser } from "@clerk/expo";
import type { Call, StreamVideoClient } from "@stream-io/video-react-native-sdk";
import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AiTeacherHeader } from "@/components/audio-lesson/ai-teacher-header";
import { AiTeacherStage } from "@/components/audio-lesson/ai-teacher-stage";
import { AudioLessonControls } from "@/components/audio-lesson/audio-lesson-controls";
import { LessonFeedbackCard } from "@/components/audio-lesson/lesson-feedback-card";
import { SubtitlesModal } from "@/components/audio-lesson/subtitles-modal";
import { lessons } from "@/data/lessons";
import {
  fetchStreamSession,
  fetchStreamUserToken,
  getOrCreateStreamClient,
  getStreamVideoSDK,
  startAgentSession,
  stopAgentSession,
} from "@/lib/stream";
import { useLanguageStore } from "@/store/language-store";
import { useLearningStore } from "@/store/learning-store";
import type { Phrase } from "@/types/learning";

interface AudioLessonViewProps {
  lessonId?: string;
  onBack?: () => void;
}

type CallConnectionStatus =
  | "connecting"
  | "connected"
  | "muted"
  | "reconnecting"
  | "error"
  | "ended";

type AgentConnectionStatus = "idle" | "connecting" | "connected" | "failed";

export function AudioLessonView({ lessonId, onBack }: AudioLessonViewProps) {
  const posthog = usePostHog();
  const { user: clerkUser } = useUser();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage) ?? "spanish";
  const activeLessonIdFromStore = useLearningStore((state) => state.activeLessonId);
  const toggleLessonCompleted = useLearningStore((state) => state.toggleLessonCompleted);
  const completedLessonIds = useLearningStore((state) => state.completedLessonIds);

  // User details from Clerk
  const learnerId = clerkUser?.id || "guest_learner";
  const learnerName = clerkUser?.fullName || clerkUser?.firstName || "Learner";
  const learnerAvatarUrl = clerkUser?.imageUrl;

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

  // Stream Client & Call State
  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(null);
  const [callInstance, setCallInstance] = useState<Call | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<CallConnectionStatus>("connecting");
  const [agentStatus, setAgentStatus] = useState<AgentConnectionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reference for session tracking & teardown
  const agentSessionIdRef = useRef<string | null>(null);
  const callIdRef = useRef<string | null>(null);
  const callRef = useRef<Call | null>(null);

  useEffect(() => {
    callRef.current = callInstance;
  }, [callInstance]);

  // Call timer: increments when connected
  const [callSeconds, setCallSeconds] = useState(0);

  useEffect(() => {
    let timer: any;
    if (connectionStatus === "connected" || connectionStatus === "muted") {
      timer = setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [connectionStatus]);

  // UI Interactive States
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isSubtitlesOpen, setIsSubtitlesOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);

  // Speech bubble text
  const [speechPrimary, setSpeechPrimary] = useState(
    resolvedLesson.aiTeacherPrompt?.opening || "¡Hola! Bienvenido."
  );
  const [speechSecondary, setSpeechSecondary] = useState(
    `Lesson: ${resolvedLesson.title}`
  );

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
      learner_id: learnerId,
    });
  }, [resolvedLesson, learnerId, posthog]);

  // Helper to cleanly stop the Vision Agent session
  const stopAgent = useCallback(async () => {
    const currentCallId = callIdRef.current;
    const currentSessionId = agentSessionIdRef.current;
    if (currentCallId && currentSessionId) {
      agentSessionIdRef.current = null;
      await stopAgentSession(currentCallId, currentSessionId).catch((err) => {
        console.warn("Agent session stop notice:", err);
      });
    }
  }, []);

  // Initialize and join Stream Audio Call, then connect Vision Agent
  const startStreamAudioCall = useCallback(async () => {
    setConnectionStatus("connecting");
    setAgentStatus("connecting");
    setErrorMessage(null);

    try {
      // 1. Fetch token & call session from Expo API route with full lesson metadata
      const session = await fetchStreamSession({
        userId: learnerId,
        userName: learnerName,
        userImage: learnerAvatarUrl,
        lessonId: resolvedLesson.id,
        languageId: selectedLanguage,
        lessonTitle: resolvedLesson.title,
        lessonGoal: resolvedLesson.goalIds?.join(", "),
        vocabulary: resolvedLesson.vocabulary?.map((v) => ({
          id: v.id,
          word: v.word,
          translation: v.translation,
          pronunciation: v.pronunciation,
          example: v.example,
        })),
        phrases: resolvedLesson.phrases.map((p) => ({
          text: p.text,
          translation: p.translation,
          pronunciation: p.pronunciation,
        })),
        aiTeacherPrompt: resolvedLesson.aiTeacherPrompt,
      });

      callIdRef.current = session.callId;

      // 2. Check if native Stream SDK is supported in this runtime
      const sdk = getStreamVideoSDK();
      if (sdk) {
        // Initialize StreamVideoClient singleton
        const client = getOrCreateStreamClient(
          session.apiKey,
          {
            id: learnerId,
            name: learnerName,
            image: learnerAvatarUrl,
          },
          () => fetchStreamUserToken(learnerId)
        );

        if (client) {
          setStreamClient(client);

          // Create audio_room call instance
          const call = client.call(session.callType || "audio_room", session.callId, {
            reuseInstance: true,
          });
          setCallInstance(call);
          callRef.current = call;

          // Join call and configure audio-only settings
          await call.join({ create: true });

          try {
            await call.camera.disable();
            await call.microphone.enable();
          } catch (deviceErr) {
            console.warn("Audio/camera setup notice:", deviceErr);
          }
        }
      }

      setConnectionStatus("connected");
      setIsMicActive(true);

      // 3. Connect Vision Agent to the call session via Expo API route proxy
      try {
        const agentRes = await startAgentSession(
          session.callId,
          session.callType || "audio_room"
        );
        if (agentRes?.sessionId) {
          agentSessionIdRef.current = agentRes.sessionId;
          setAgentStatus("connected");
        } else {
          setAgentStatus("connected");
        }
      } catch (agentErr: any) {
        console.warn("Vision agent connection notice:", agentErr?.message || agentErr);
        setAgentStatus("failed");
        setErrorMessage("AI Teacher server offline. Ensure 'uv run agent.py serve' is running on port 8000.");
      }
    } catch (err: any) {
      console.error("Stream call connection notice:", err);
      // Keep audio lesson interactive even if local network restricts SFU
      setConnectionStatus("connected");
      setAgentStatus("failed");
      setIsMicActive(true);
    }
  }, [
    learnerId,
    learnerName,
    learnerAvatarUrl,
    resolvedLesson,
    selectedLanguage,
  ]);

  // Start call on mount and clean up both call and agent session on unmount
  useEffect(() => {
    const timer = setTimeout(() => {
      startStreamAudioCall();
    }, 0);

    return () => {
      clearTimeout(timer);
      const currentCall = callRef.current;
      if (currentCall) {
        try {
          currentCall.leave().catch((err: any) => {
            console.warn("Call cleanup notice:", err);
          });
        } catch {
          // ignore
        }
      }
      stopAgent();
    };
  }, [startStreamAudioCall, stopAgent]);

  // Handle speaker audio playback
  const handlePlayAudio = () => {
    setIsPlayingAudio(true);

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

  // Handle mic toggle (mute/unmute Stream call)
  const handleToggleMic = async () => {
    const nextMicState = !isMicActive;
    setIsMicActive(nextMicState);

    if (callInstance) {
      try {
        await callInstance.microphone.toggle();
      } catch (err) {
        console.warn("Microphone toggle notice:", err);
      }
    }

    if (!nextMicState) {
      setSpeechPrimary("Microphone Muted");
      setSpeechSecondary("Unmute anytime to continue speaking 🎙️");
    } else {
      setSpeechPrimary("Listening...");
      setSpeechSecondary("Speak clearly into the microphone 🎙️");

      setTimeout(() => {
        const phrase =
          resolvedLesson.phrases[activePhraseIndex] || resolvedLesson.phrases[0];
        setSpeechPrimary("¡Muy bien!");
        setSpeechSecondary(
          phrase ? `"${phrase.text}" sounded great! 👏` : "That was great! 👏"
        );
        setScores({
          speaking: "Excellent",
          pronunciation: "Great",
          grammar: "Good",
        });
      }, 1500);
    }
  };

  // Handle ending call & completing lesson
  const handleEndCall = async () => {
    setConnectionStatus("ended");
    setAgentStatus("idle");

    if (callInstance) {
      try {
        await callInstance.leave().catch((err: any) => {
          console.warn("Leave call notice:", err);
        });
      } catch {
        // ignore
      }
    }

    await stopAgent();

    posthog.capture("ai_teacher_lesson_completed", {
      lesson_id: resolvedLesson.id,
      duration_seconds: callSeconds,
      xp_awarded: resolvedLesson.xp || 20,
      learner_id: learnerId,
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

  // Header status text & color state
  const headerStatusText = useMemo(() => {
    if (agentStatus === "connecting" || connectionStatus === "connecting") return "Connecting...";
    if (agentStatus === "failed") return "Teacher Offline";
    if (connectionStatus === "error") return "Offline";
    if (connectionStatus === "reconnecting") return "Reconnecting...";
    if (!isMicActive) return "Muted";
    return "Online";
  }, [agentStatus, connectionStatus, isMicActive]);

  const headerStatusState = useMemo(() => {
    if (agentStatus === "connecting" || connectionStatus === "connecting") return "connecting";
    if (agentStatus === "failed") return "failed";
    if (connectionStatus === "error") return "error";
    if (!isMicActive) return "muted";
    return "online";
  }, [agentStatus, connectionStatus, isMicActive]);

  // Main UI content
  const content = (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Top Header */}
      <AiTeacherHeader
        statusText={headerStatusText}
        statusState={headerStatusState}
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
          learnerName={learnerName}
          learnerAvatarUrl={learnerAvatarUrl}
          isMuted={!isMicActive}
          isConnecting={connectionStatus === "connecting" || agentStatus === "connecting"}
          errorMessage={errorMessage}
          onPlayAudio={handlePlayAudio}
          onRetry={startStreamAudioCall}
        />

        {/* Audio Lesson Control Buttons (Camera, Mic, Subtitles, End Call) */}
        <AudioLessonControls
          isCameraOn={isCameraActive}
          isMicOn={isMicActive}
          isSubtitlesActive={isSubtitlesOpen}
          isLoading={connectionStatus === "connecting" || agentStatus === "connecting"}
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

  // If running in a native build with StreamVideo SDK active, wrap in providers
  const sdk = getStreamVideoSDK();
  if (sdk && streamClient && callInstance) {
    const { StreamVideo, StreamCall } = sdk;
    return (
      <StreamVideo client={streamClient}>
        <StreamCall call={callInstance}>{content}</StreamCall>
      </StreamVideo>
    );
  }

  return content;
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
