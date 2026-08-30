import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { VolumeSpeakerIcon } from "@/components/ui/icons";
import { images } from "@/constants/images";

interface AiTeacherStageProps {
  primaryPhrase?: string;
  secondaryPhrase?: string;
  isCameraActive?: boolean;
  isPlayingAudio?: boolean;
  learnerName?: string;
  learnerAvatarUrl?: string;
  isMuted?: boolean;
  isConnecting?: boolean;
  errorMessage?: string | null;
  onPlayAudio?: () => void;
  onRetry?: () => void;
}

export function AiTeacherStage({
  primaryPhrase = "¡Muy bien!",
  secondaryPhrase = "That was great! 👏",
  isCameraActive = true,
  isPlayingAudio = false,
  learnerName = "You",
  learnerAvatarUrl,
  isMuted = false,
  isConnecting = false,
  errorMessage,
  onPlayAudio,
  onRetry,
}: AiTeacherStageProps) {
  const [isPressingSpeaker, setIsPressingSpeaker] = useState(false);

  return (
    <View style={styles.stageCard} className="mx-4 overflow-hidden rounded-[28px] bg-[#e6e8ee]">
      {/* Background Teacher Scene (Fox Mascot in Cozy Room) */}
      <Image
        source={images.aiTeacherFoxScene}
        style={styles.stageImage}
        contentFit="cover"
        accessibilityLabel="AI Teacher Mascot in Cozy Room"
      />

      {/* Top Right: Learner Video / Audio Preview (Picture in Picture) */}
      {isCameraActive && (
        <View style={styles.pipContainer}>
          <Image
            source={learnerAvatarUrl ? { uri: learnerAvatarUrl } : images.learnerPipAvatar}
            style={styles.pipImage}
            contentFit="cover"
            accessibilityLabel={`${learnerName} camera preview`}
          />
          {/* User Badge / Mute Badge */}
          <View style={styles.pipBadge}>
            <Text style={styles.pipBadgeText} numberOfLines={1}>
              {isMuted ? "🔇 Muted" : learnerName}
            </Text>
          </View>
        </View>
      )}

      {/* Error / Connection Overlay */}
      {errorMessage ? (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorTitle}>Connection Issue</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          {onRetry && (
            <Pressable
              onPress={onRetry}
              style={styles.retryButton}
              className="active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="Retry Stream connection"
            >
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </Pressable>
          )}
        </View>
      ) : null}

      {/* Speech Bubble (AI Teacher Response) */}
      <View style={styles.bubbleWrapper}>
        <View style={styles.speechBubble}>
          {/* Text Content */}
          <View className="flex-1 pr-3 justify-center">
            <Text className="font-sans text-[16px] font-bold text-[#1c2136] tracking-tight">
              {isConnecting ? "Connecting to audio..." : primaryPhrase}
            </Text>
            <Text className="font-sans text-[14px] font-medium text-[#4b5563] mt-0.5">
              {isConnecting ? "Setting up your lesson session 🎙️" : secondaryPhrase}
            </Text>
          </View>

          {/* Right: Speaker Audio Button */}
          <Pressable
            onPress={onPlayAudio}
            onPressIn={() => setIsPressingSpeaker(true)}
            onPressOut={() => setIsPressingSpeaker(false)}
            unstable_pressDelay={0}
            accessibilityRole="button"
            accessibilityLabel="Play teacher pronunciation audio"
            style={[
              styles.speakerButton,
              (isPressingSpeaker || isPlayingAudio) && styles.speakerButtonActive,
            ]}
          >
            <VolumeSpeakerIcon size={22} color={isPlayingAudio ? "#ffffff" : "#5e54eb"} />
          </Pressable>
        </View>

        {/* Speech Bubble Pointer Tail (pointing downward right) */}
        <View style={styles.bubbleTail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stageCard: {
    height: 380,
    position: "relative",
    shadowColor: "#1c2136",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  stageImage: {
    width: "100%",
    height: "100%",
  },
  pipContainer: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 86,
    height: 112,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: "#2e384d",
  },
  pipImage: {
    width: "100%",
    height: "100%",
  },
  pipBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  pipBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  errorOverlay: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 106,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ef4444",
    fontFamily: "Poppins",
  },
  errorMessage: {
    fontSize: 11,
    color: "#475569",
    marginTop: 2,
    fontFamily: "Poppins",
  },
  retryButton: {
    marginTop: 6,
    backgroundColor: "#5e54eb",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  bubbleWrapper: {
    position: "absolute",
    left: 18,
    right: 32,
    bottom: 24,
    alignItems: "flex-start",
  },
  speechBubble: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#1c2136",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ffffff",
    marginLeft: 40,
    marginTop: -1,
  },
  speakerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f4f3ff",
    alignItems: "center",
    justifyContent: "center",
  },
  speakerButtonActive: {
    backgroundColor: "#5e54eb",
  },
});
