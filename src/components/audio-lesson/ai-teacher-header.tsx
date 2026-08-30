import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import {
  AiBotOutlineIcon,
  ChevronLeftIcon,
  VideoCameraIcon,
} from "@/components/ui/icons";

interface AiTeacherHeaderProps {
  onBack?: () => void;
  statusText?: string;
  statusState?: "idle" | "online" | "connecting" | "muted" | "error" | "offline" | "failed";
  counterValue?: string | number;
  onCameraToggle?: () => void;
  onProfilePress?: () => void;
}

export function AiTeacherHeader({
  onBack,
  statusText = "Online",
  statusState = "online",
  counterValue = "12",
  onCameraToggle,
  onProfilePress,
}: AiTeacherHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const getStatusDotColor = () => {
    switch (statusState) {
      case "online":
        return "#22c55e"; // green
      case "connecting":
        return "#f59e0b"; // amber
      case "muted":
        return "#ef4444"; // red
      case "failed":
      case "error":
        return "#ef4444"; // red
      case "idle":
      case "offline":
        return "#94a3b8"; // gray
      default:
        return "#22c55e";
    }
  };

  return (
    <View style={styles.container} className="w-full flex-row items-center justify-between px-4 py-2 bg-white">
      {/* Left: Back Arrow and Title with Online Status */}
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={handleBack}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="w-10 h-10 items-center justify-center -ml-1 active:opacity-60"
        >
          <ChevronLeftIcon size={24} color="#1c2136" />
        </Pressable>

        <View className="justify-center">
          <Text className="font-sans text-[18px] font-bold text-[#1c2136] tracking-tight">
            AI Teacher
          </Text>
          <View className="flex-row items-center gap-1.5 mt-0.5">
            <View style={[styles.onlineDot, { backgroundColor: getStatusDotColor() }]} />
            <Text className="font-sans text-[12px] font-medium text-[#718096]">
              {statusText}
            </Text>
          </View>
        </View>
      </View>

      {/* Right Actions: Video Toggle, Number Pill, AI Bot Profile */}
      <View className="flex-row items-center gap-2">
        {/* Camera Toggle Button */}
        <Pressable
          onPress={onCameraToggle}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel="Toggle Camera"
          style={styles.actionButton}
          className="active:opacity-70"
        >
          <VideoCameraIcon size={18} color="#1c2136" />
        </Pressable>

        {/* Counter Pill */}
        <View style={styles.counterPill}>
          <Text className="font-sans text-[14px] font-bold text-[#1c2136]">
            {counterValue}
          </Text>
        </View>

        {/* AI Profile Button */}
        <Pressable
          onPress={onProfilePress}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel="Teacher Profile Info"
          style={styles.actionButton}
          className="active:opacity-70"
        >
          <AiBotOutlineIcon size={18} color="#1c2136" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#22c55e",
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  counterPill: {
    minWidth: 38,
    height: 38,
    paddingHorizontal: 8,
    borderRadius: 19,
    borderWidth: 1.2,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
