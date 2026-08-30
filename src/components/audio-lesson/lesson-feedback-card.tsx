import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface LessonFeedbackCardProps {
  speakingScore?: string;
  pronunciationScore?: string;
  grammarScore?: string;
}

export function LessonFeedbackCard({
  speakingScore = "Excellent",
  pronunciationScore = "Great",
  grammarScore = "Good",
}: LessonFeedbackCardProps) {
  return (
    <View style={styles.cardContainer} className="mx-4 my-2 rounded-[22px] bg-white px-3 py-4">
      <View className="flex-row items-center justify-between">
        {/* 1. Speaking Metric */}
        <View className="flex-1 items-start pl-2">
          <Text className="font-sans text-[13px] font-bold text-[#1c2136]">
            Speaking
          </Text>
          <Text className="font-sans text-[14px] font-semibold text-[#22c55e] mt-1">
            {speakingScore}
          </Text>
        </View>

        {/* Divider 1 */}
        <View style={styles.verticalDivider} />

        {/* 2. Pronunciation Metric */}
        <View className="flex-1 items-start pl-4">
          <Text className="font-sans text-[13px] font-bold text-[#1c2136]">
            Pronunciation
          </Text>
          <Text className="font-sans text-[14px] font-semibold text-[#3b82f6] mt-1">
            {pronunciationScore}
          </Text>
        </View>

        {/* Divider 2 */}
        <View style={styles.verticalDivider} />

        {/* 3. Grammar Metric */}
        <View className="flex-1 items-start pl-4">
          <Text className="font-sans text-[13px] font-bold text-[#1c2136]">
            Grammar
          </Text>
          <Text className="font-sans text-[14px] font-semibold text-[#7c3aed] mt-1">
            {grammarScore}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1.2,
    borderColor: "#edf0f7",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#edf0f7",
  },
});
