import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { ChevronLeftIcon } from "@/components/ui/icons";

interface LessonHeaderProps {
  title: string;
  subtitle: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onBack?: () => void;
}

export function LessonHeader({
  title,
  subtitle,
  onBack,
}: LessonHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/(tabs)/home");
    }
  };

  return (
    <View className="flex-row items-center justify-between px-5 py-2.5 bg-white">
      {/* Left: Back Button and Title Info */}
      <View className="flex-row items-center gap-3 flex-1">
        <Pressable
          onPress={handleBack}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="h-10 w-10 -ml-2 items-center justify-center rounded-full active:bg-slate-100"
        >
          <ChevronLeftIcon size={24} color="#1c2136" />
        </Pressable>

        <View className="flex-1">
          <Text
            className="font-sans text-[20px] font-bold text-[#1c2136] tracking-tight"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="font-sans text-[13px] font-medium text-[#8a92a6] mt-0.5">
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

