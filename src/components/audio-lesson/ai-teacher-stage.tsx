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
  onPlayAudio?: () => void;
}

export function AiTeacherStage({
  primaryPhrase = "¡Muy bien!",
  secondaryPhrase = "That was great! 👏",
  isCameraActive = true,
  isPlayingAudio = false,
  onPlayAudio,
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

      {/* Top Right: Learner Video Preview (Picture in Picture) */}
      {isCameraActive && (
        <View style={styles.pipContainer}>
          <Image
            source={images.learnerPipAvatar}
            style={styles.pipImage}
            contentFit="cover"
            accessibilityLabel="Learner video camera preview"
          />
        </View>
      )}

      {/* Speech Bubble (AI Teacher Response) */}
      <View style={styles.bubbleWrapper}>
        <View style={styles.speechBubble}>
          {/* Text Content */}
          <View className="flex-1 pr-3 justify-center">
            <Text className="font-sans text-[16px] font-bold text-[#1c2136] tracking-tight">
              {primaryPhrase}
            </Text>
            <Text className="font-sans text-[14px] font-medium text-[#4b5563] mt-0.5">
              {secondaryPhrase}
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
    width: 82,
    height: 108,
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
