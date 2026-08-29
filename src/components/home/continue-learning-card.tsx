import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePostHog } from "posthog-react-native";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import { useLearningStore } from "@/store/learning-store";
import { Image } from "expo-image";

export function ContinueLearningCard() {
  const posthog = usePostHog();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguage) ?? "spanish";
  const currentLevel = useLearningStore((state) => state.currentLevel);
  const currentUnitNumber = useLearningStore((state) => state.currentUnitNumber);

  const language = languages.find((l) => l.id === selectedLanguageId) ?? languages[0];
  const languageName = language?.name ?? "Spanish";

  const handleContinue = () => {
    posthog.capture("continue_learning_pressed", {
      language_id: selectedLanguageId,
      language_name: languageName,
      current_level: currentLevel,
      current_unit: currentUnitNumber,
    });
    // Navigate to learn tab or active lesson
    router.push("/(tabs)/learn");
  };

  return (
    <View className="relative mt-4 overflow-hidden rounded-[28px] bg-[#5844eb] p-6 shadow-sm">
      {/* Right Background Landmark Illustration */}
      <View style={styles.palaceWrapper} pointerEvents="none">
        <Image
          source={images.palace}
          style={styles.palaceImage}
          contentFit="contain"
          accessibilityLabel="Learning landmark illustration"
        />
      </View>

      {/* Left Content */}
      <View className="z-10 max-w-[65%]">
        <Text className="font-sans text-[14px] text-white/80">
          Continue learning
        </Text>

        <Text className="mt-1 font-sans text-[26px] font-bold text-white">
          {languageName}
        </Text>

        <Text className="mb-4 mt-1 font-sans text-[15px] font-medium text-white/90">
          {currentLevel} • Unit {currentUnitNumber}
        </Text>

        {/* Continue Button */}
        <Pressable
          onPress={handleContinue}
          unstable_pressDelay={0}
          accessibilityRole="button"
          accessibilityLabel={`Continue learning ${languageName}`}
          className="self-start rounded-full bg-white px-6 py-2.5 active:bg-slate-100"
        >
          <Text className="font-sans text-[15px] font-semibold text-[#5844eb]">
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  palaceWrapper: {
    position: "absolute",
    right: -10,
    bottom: -8,
    width: 155,
    height: 155,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  palaceImage: {
    width: 155,
    height: 155,
  },
});
