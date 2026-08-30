import { useUser } from "@clerk/expo";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { BellIcon } from "@/components/ui/icons";
import { images } from "@/constants/images";
import { getLanguageFlag } from "@/data/languages";
import { getLanguageGreeting } from "@/data/plans";
import { useLanguageStore } from "@/store/language-store";
import { useLearningStore } from "@/store/learning-store";
import { Image } from "expo-image";

import { router } from "expo-router";

export function HomeHeader() {
  const { user } = useUser();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage) ?? "spanish";
  const streak = useLearningStore((state) => state.streak);

  const flagEmoji = getLanguageFlag(selectedLanguage) || "🇪🇸";
  const greetingWord = getLanguageGreeting(selectedLanguage);
  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Alex";

  return (
    <View className="flex-row items-center justify-between py-2">
      {/* Left: Flag and Greeting */}
      <View className="flex-row items-center gap-2.5">
        <Pressable
          onPress={() => router.push("/language-selection")}
          accessibilityRole="button"
          accessibilityLabel="Change language"
          className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200 shadow-sm"
        >
          <Text className="text-[24px] leading-[26px]">{flagEmoji}</Text>
        </Pressable>
        <Text className="font-sans text-[20px] font-bold text-[#1c2136]">
          {greetingWord}, {firstName}! 👋
        </Text>
      </View>

      {/* Right: Streak and Notification */}
      <View className="flex-row items-center gap-3.5">
        {/* Streak Counter */}
        <View className="flex-row items-center gap-1.5">
          <Image
            source={images.streakFire}
            style={{ width: 22, height: 26 }}
            contentFit="contain"
            accessibilityLabel="Streak flame"
          />
          <Text className="font-sans text-[17px] font-bold text-[#5d6475]">
            {streak}
          </Text>
        </View>

        {/* Bell Button */}
        <Pressable
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <BellIcon size={23} color="#1c2136" />
        </Pressable>
      </View>
    </View>
  );
}
