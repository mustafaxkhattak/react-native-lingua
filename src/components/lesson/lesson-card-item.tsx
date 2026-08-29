import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CheckCircleBadge, PlayCircleBadge } from "@/components/ui/icons";
import { images } from "@/constants/images";
import type { Lesson } from "@/types/learning";

interface LessonCardItemProps {
  lesson: Lesson;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  onPress: (lesson: Lesson) => void;
}

export function LessonCardItem({
  lesson,
  index,
  isCompleted,
  isActive,
  onPress,
}: LessonCardItemProps) {
  const lessonNumber = lesson.number ?? index + 1;
  const isAvailable = !isActive && !isCompleted;

  // Resolve icon for active card
  const getActiveIllustration = () => {
    if (
      lesson.id.includes("cafe") ||
      lesson.title.toLowerCase().includes("café") ||
      lesson.title.toLowerCase().includes("cafe")
    ) {
      return images.cafeTableIcon;
    }
    if (lesson.imageAssetKey && images[lesson.imageAssetKey as keyof typeof images]) {
      return images[lesson.imageAssetKey as keyof typeof images];
    }
    if (lesson.imageUrl) {
      return { uri: lesson.imageUrl };
    }
    return images.cafeTableIcon;
  };

  return (
    <Pressable
      onPress={() => onPress(lesson)}
      unstable_pressDelay={0}
      accessibilityRole="button"
      accessibilityLabel={`Lesson ${lessonNumber}: ${lesson.title}. Status: ${
        isActive ? "In progress" : isCompleted ? "Completed" : "Available"
      }`}
      style={[
        styles.cardContainer,
        isActive ? styles.activeCard : styles.inactiveCard,
      ]}
      className={`w-full rounded-2xl p-4 my-1.5 flex-row items-center justify-between transition-all ${
        isActive ? "bg-[#fbfbfe]" : "bg-white"
      }`}
    >
      {/* Left Details */}
      <View className="flex-1 pr-3 justify-center">
        {/* Lesson number label */}
        <Text
          className={`font-sans text-[13px] ${
            isActive
              ? "font-bold text-[#5e54eb]"
              : "font-semibold text-[#8a92a6]"
          }`}
        >
          Lesson {lessonNumber}
        </Text>

        {/* Lesson title */}
        <Text
          className="font-sans text-[16px] font-bold text-[#1c2136] mt-0.5 tracking-tight"
          numberOfLines={1}
        >
          {lesson.title}
        </Text>

        {/* Sub-label for Active / Completed / Available status */}
        {isActive && (
          <Text className="font-sans text-[13px] font-semibold text-[#5e54eb] mt-1">
            In progress
          </Text>
        )}

        {isCompleted && (
          <Text className="font-sans text-[13px] font-medium text-[#48bb78] mt-1">
            {lesson.sublabel || "Completed"}
          </Text>
        )}

        {isAvailable && (
          <Text className="font-sans text-[13px] font-medium text-[#8a92a6] mt-1">
            {lesson.sublabel || `${lesson.estimatedMinutes || 5} min • ${lesson.xp || 20} XP`}
          </Text>
        )}
      </View>

      {/* Right Indicator: Completed Badge, Active Cafe Sticker, or Play Start Badge */}
      <View className="items-center justify-center min-w-[36px]">
        {isCompleted && <CheckCircleBadge size={26} />}

        {isActive && (
          <View style={styles.activeIconWrapper}>
            <Image
              source={getActiveIllustration()}
              style={styles.activeIconImage}
              contentFit="contain"
              accessibilityLabel={`${lesson.title} illustration`}
            />
          </View>
        )}

        {isAvailable && <PlayCircleBadge size={28} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    minHeight: 82,
    borderWidth: 1.5,
  },
  inactiveCard: {
    borderColor: "#edf0f7",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  activeCard: {
    borderColor: "#7c71f6",
    shadowColor: "#5e54eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  activeIconWrapper: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconImage: {
    width: 46,
    height: 46,
  },
});
