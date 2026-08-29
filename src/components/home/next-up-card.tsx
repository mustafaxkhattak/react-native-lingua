import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { VideoCameraIcon } from "@/components/ui/icons";
import { images } from "@/constants/images";
import { getNextUpActivity } from "@/data/plans";
import { useLanguageStore } from "@/store/language-store";
import { Image } from "expo-image";

export function NextUpCard() {
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguage) ?? "spanish";
  const activity = getNextUpActivity(selectedLanguageId);

  const handleStartCall = () => {
    // Navigate to AI Teacher tab
    router.push("/(tabs)/ai-teacher");
  };

  return (
    <Pressable
      onPress={handleStartCall}
      unstable_pressDelay={0}
      accessibilityRole="button"
      accessibilityLabel={`${activity.tag}: ${activity.title}, ${activity.subtitle}`}
      className="mt-5 flex-row items-center justify-between rounded-[26px] bg-[#f2f7ef] p-4.5 border border-[#e2ece0]/70 shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:opacity-95"
    >
      {/* Left Text */}
      <View className="flex-1 pr-2">
        <Text className="font-sans text-[13px] font-medium text-[#5d6475]">
          {activity.tag}
        </Text>
        <Text className="mt-0.5 font-sans text-[18px] font-bold text-[#1c2136]">
          {activity.title}
        </Text>
        <Text className="mt-0.5 font-sans text-[14px] text-[#718096]">
          {activity.subtitle}
        </Text>
      </View>

      {/* Right: Teacher Avatar & Call Button */}
      <View className="flex-row items-center gap-3">
        {/* Circular Avatar */}
        <View className="h-[62px] w-[62px] overflow-hidden rounded-full border-2 border-white shadow-sm">
          <Image
            source={images.aiTeacherAvatar}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            accessibilityLabel="AI Teacher portrait"
          />
        </View>

        {/* Video Call Button */}
        <View className="h-[48px] w-[48px] items-center justify-center rounded-full bg-[#68c338] shadow-sm">
          <VideoCameraIcon size={22} color="#ffffff" />
        </View>
      </View>
    </Pressable>
  );
}
