import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  MicControlIcon,
  MicOffControlIcon,
  PhoneHangupIcon,
  SubtitlesControlIcon,
  VideoCameraIcon,
} from "@/components/ui/icons";

interface AudioLessonControlsProps {
  isCameraOn?: boolean;
  isMicOn?: boolean;
  isSubtitlesActive?: boolean;
  onToggleCamera?: () => void;
  onToggleMic?: () => void;
  onToggleSubtitles?: () => void;
  onEndCall?: () => void;
}

export function AudioLessonControls({
  isCameraOn = true,
  isMicOn = true,
  isSubtitlesActive = false,
  onToggleCamera,
  onToggleMic,
  onToggleSubtitles,
  onEndCall,
}: AudioLessonControlsProps) {
  return (
    <View style={styles.controlsContainer} className="w-full flex-row items-center justify-around px-4 pt-2">
      {/* 1. Camera Toggle Button */}
      <View style={styles.buttonWrapper}>
        <Pressable
          onPress={onToggleCamera}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel={isCameraOn ? "Turn camera off" : "Turn camera on"}
          style={[styles.circularButton, !isCameraOn && styles.buttonInactive]}
          className="active:opacity-75"
        >
          <VideoCameraIcon size={22} color={isCameraOn ? "#1c2136" : "#8a92a6"} />
        </Pressable>
        <Text style={styles.buttonLabel}>Camera</Text>
      </View>

      {/* 2. Mic Toggle Button */}
      <View style={styles.buttonWrapper}>
        <Pressable
          onPress={onToggleMic}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel={isMicOn ? "Mute microphone" : "Unmute microphone"}
          style={[styles.circularButton, !isMicOn && styles.buttonInactive]}
          className="active:opacity-75"
        >
          {isMicOn ? (
            <MicControlIcon size={22} color="#1c2136" />
          ) : (
            <MicOffControlIcon size={22} color="#ef4444" />
          )}
        </Pressable>
        <Text style={styles.buttonLabel}>{isMicOn ? "Mic" : "Muted"}</Text>
      </View>

      {/* 3. Subtitles Toggle Button */}
      <View style={styles.buttonWrapper}>
        <Pressable
          onPress={onToggleSubtitles}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel="Toggle lesson phrases and subtitles"
          style={[
            styles.circularButton,
            isSubtitlesActive && styles.subtitlesButtonActive,
          ]}
          className="active:opacity-75"
        >
          <SubtitlesControlIcon
            size={22}
            color={isSubtitlesActive ? "#5e54eb" : "#1c2136"}
          />
        </Pressable>
        <Text style={styles.buttonLabel}>Subtitles</Text>
      </View>

      {/* 4. End Call Button (Red Circle) */}
      <View style={styles.buttonWrapper}>
        <Pressable
          onPress={onEndCall}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel="End audio lesson call"
          style={styles.endCallButton}
          className="active:opacity-85"
        >
          <PhoneHangupIcon size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.buttonLabel}>End Call</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    paddingVertical: 10,
  },
  buttonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  circularButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#edf0f7",
  },
  buttonInactive: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  subtitlesButtonActive: {
    backgroundColor: "#f5f3ff",
    borderColor: "#c4b5fd",
    borderWidth: 1.5,
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f04438",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f04438",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#5d6475",
    fontFamily: "Poppins",
  },
});
