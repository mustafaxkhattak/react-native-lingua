import React from "react";
import type { DimensionValue } from "react-native";
import { StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";
import { useLearningStore } from "@/store/learning-store";
import { Image } from "expo-image";

export function DailyGoalCard() {
  const xp = useLearningStore((state) => state.xp);
  const dailyGoalXp = useLearningStore((state) => state.dailyGoalXp);

  const progressRatio = Math.min(Math.max(xp / (dailyGoalXp || 1), 0), 1);
  const progressPercent: DimensionValue = `${Math.round(progressRatio * 100)}%`;


  return (
    <View className="mt-3 flex-row items-center justify-between rounded-[26px] bg-[#fff9f2] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#faeade]/60">
      {/* Left Column: Progress Info */}
      <View className="flex-1 pr-3">
        <Text className="font-sans text-[15px] font-medium text-[#5d6475]">
          Daily goal
        </Text>

        {/* XP Counter */}
        <View className="mt-1 flex-row items-baseline">
          <Text className="font-sans text-[30px] font-bold text-[#1c2136]">
            {xp}
          </Text>
          <Text className="ml-1.5 font-sans text-[16px] font-medium text-[#8a92a6]">
            / {dailyGoalXp} XP
          </Text>
        </View>

        {/* Progress Bar Container */}
        <View className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#feddc4]">
          <View
            style={[styles.progressBarFill, { width: progressPercent }]}
          />
        </View>
      </View>

      {/* Right: 3D Treasure Chest */}
      <View className="h-[85px] w-[88px] items-center justify-center">
        <Image
          source={images.treasure}
          style={{ width: 88, height: 85 }}
          contentFit="contain"
          accessibilityLabel="Treasure chest"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ff8a00",
    borderRadius: 9999,
  },
});
