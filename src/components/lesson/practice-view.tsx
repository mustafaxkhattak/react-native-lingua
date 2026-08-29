import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BookIcon, HeadphonesIcon, VideoCameraIcon, WordsIcon } from "@/components/ui/icons";

interface PracticeViewProps {
  languageName: string;
  onStartPractice?: (type: string) => void;
}

const practiceModes = [
  {
    id: "vocab-drill",
    title: "Vocabulary Sprint",
    subtitle: "Rapid-fire word cards & translations",
    xp: "+15 XP",
    icon: (color: string) => <WordsIcon size={24} color={color} />,
    iconBg: "bg-amber-500",
  },
  {
    id: "listening-lab",
    title: "Listening Lab",
    subtitle: "Train your ear with native speaker audio",
    xp: "+20 XP",
    icon: (color: string) => <HeadphonesIcon size={22} color={color} />,
    iconBg: "bg-indigo-500",
  },
  {
    id: "speech-coach",
    title: "AI Pronunciation Coach",
    subtitle: "Practice speaking full sentences out loud",
    xp: "+25 XP",
    icon: (color: string) => <VideoCameraIcon size={22} color={color} />,
    iconBg: "bg-emerald-500",
  },
  {
    id: "grammar-boost",
    title: "Grammar & Patterns",
    subtitle: "Master sentence structures intuitively",
    xp: "+15 XP",
    icon: (color: string) => <BookIcon size={22} color={color} />,
    iconBg: "bg-sky-500",
  },
];

export function PracticeView({ languageName, onStartPractice }: PracticeViewProps) {
  return (
    <View className="w-full px-5 py-2">
      <Text className="font-sans text-[18px] font-bold text-[#1c2136] mb-3">
        {languageName} Practice Hub
      </Text>

      <View className="gap-3">
        {practiceModes.map((mode) => (
          <Pressable
            key={mode.id}
            onPress={() => onStartPractice?.(mode.id)}
            unstable_pressDelay={0}
            accessibilityRole="button"
            accessibilityLabel={`${mode.title}: ${mode.subtitle}`}
            style={styles.practiceCard}
            className="w-full p-4 rounded-2xl bg-white border border-[#edf0f7] flex-row items-center justify-between active:scale-[0.99]"
          >
            {/* Left: Icon & Text */}
            <View className="flex-row items-center gap-3.5 flex-1 pr-2">
              <View
                className={`w-12 h-12 rounded-2xl items-center justify-center ${mode.iconBg} shadow-sm`}
              >
                {mode.icon("#ffffff")}
              </View>

              <View className="flex-1">
                <Text className="font-sans text-[15px] font-bold text-[#1c2136]">
                  {mode.title}
                </Text>
                <Text className="font-sans text-[12px] font-medium text-[#8a92a6] mt-0.5" numberOfLines={1}>
                  {mode.subtitle}
                </Text>
              </View>
            </View>

            {/* Right: XP Tag */}
            <View className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <Text className="font-sans text-[12px] font-bold text-emerald-600">
                {mode.xp}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  practiceCard: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
});
