import { useClerk, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

import { images } from "@/constants/images";
import { getLanguageFlag, languages } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import { useLearningStore } from "@/store/learning-store";

export default function ProfileScreen() {
  const posthog = usePostHog();
  const { user } = useUser();
  const { signOut } = useClerk();

  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguage) ?? "spanish";
  const streak = useLearningStore((state) => state.streak);
  const xp = useLearningStore((state) => state.xp);
  const currentLevel = useLearningStore((state) => state.currentLevel);

  const selectedLangObj = languages.find((l) => l.id === selectedLanguageId);
  const flagEmoji = getLanguageFlag(selectedLanguageId) || "🇪🇸";
  const displayName = user?.fullName || user?.firstName || "Learner";
  const emailAddress = user?.primaryEmailAddress?.emailAddress || "user@lingua.app";

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            posthog.capture("user_signed_out");
            await signOut();
            router.replace("/onboarding");
          } catch {
            Alert.alert("Error", "Could not sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical={false}
      >
        {/* Profile Header */}
        <View className="items-center pt-4 pb-6">
          <View className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-brand-purple/10 items-center justify-center shadow-md">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.avatarImage}
                contentFit="cover"
                accessibilityLabel="Profile photo"
              />
            ) : (
              <Text className="font-sans text-[36px] font-bold text-brand-purple">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <Text className="mt-3 font-sans text-[22px] font-bold text-text-primary">
            {displayName}
          </Text>
          <Text className="mt-0.5 font-sans text-[14px] text-text-secondary">
            {emailAddress}
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-3">
          {/* Streak Card */}
          <View className="flex-1 rounded-[22px] border border-[#f0f0f4] bg-[#fafafc] p-4 items-center">
            <View className="flex-row items-center gap-1.5">
              <Image
                source={images.streakFire}
                style={{ width: 22, height: 26 }}
                contentFit="contain"
                accessibilityLabel="Streak flame"
              />
              <Text className="font-sans text-[22px] font-bold text-text-primary">
                {streak}
              </Text>
            </View>
            <Text className="mt-1 font-sans text-[13px] text-text-secondary font-medium">
              Day Streak
            </Text>
          </View>

          {/* XP Card */}
          <View className="flex-1 rounded-[22px] border border-[#f0f0f4] bg-[#fafafc] p-4 items-center">
            <Text className="font-sans text-[22px] font-bold text-[#5844eb]">
              ⚡ {xp}
            </Text>
            <Text className="mt-1 font-sans text-[13px] text-text-secondary font-medium">
              Total XP
            </Text>
          </View>

          {/* Level Card */}
          <View className="flex-1 rounded-[22px] border border-[#f0f0f4] bg-[#fafafc] p-4 items-center">
            <Text className="font-sans text-[22px] font-bold text-[#10b981]">
              {currentLevel}
            </Text>
            <Text className="mt-1 font-sans text-[13px] text-text-secondary font-medium">
              Level
            </Text>
          </View>
        </View>

        {/* Navigation Section */}
        <View className="mt-6 gap-2.5">
          <Text className="font-sans text-[17px] font-semibold text-text-primary px-1">
            Learning & Navigation
          </Text>

          {/* Language Selection Route */}
          <Pressable
            onPress={() => router.push("/language-selection")}
            className="flex-row items-center justify-between rounded-[20px] border border-[#eef0f4] bg-white p-4 active:bg-slate-50"
            accessibilityRole="button"
            accessibilityLabel="Change learning language"
          >
            <View className="flex-row items-center gap-3.5">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                <Text className="text-[24px]">{flagEmoji}</Text>
              </View>
              <View>
                <Text className="font-sans text-[16px] font-bold text-text-primary">
                  Learning Language
                </Text>
                <Text className="font-sans text-[13px] text-text-secondary">
                  {selectedLangObj?.name ?? "Spanish"}
                </Text>
              </View>
            </View>
            <Text className="font-sans text-[22px] text-[#9ca3af]">›</Text>
          </Pressable>

          {/* Onboarding Tour Preview */}
          <Pressable
            onPress={() => router.push("/onboarding")}
            className="flex-row items-center justify-between rounded-[20px] border border-[#eef0f4] bg-white p-4 active:bg-slate-50"
            accessibilityRole="button"
            accessibilityLabel="View Onboarding"
          >
            <View className="flex-row items-center gap-3.5">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff]">
                <Text className="text-[20px]">✨</Text>
              </View>
              <View>
                <Text className="font-sans text-[16px] font-bold text-text-primary">
                  Onboarding Tour
                </Text>
                <Text className="font-sans text-[13px] text-text-secondary">
                  Preview welcome and intro flow
                </Text>
              </View>
            </View>
            <Text className="font-sans text-[22px] text-[#9ca3af]">›</Text>
          </Pressable>
        </View>

        {/* Account & Sign Out */}
        <View className="mt-8">
          <Pressable
            onPress={handleSignOut}
            className="h-14 flex-row items-center justify-center rounded-[20px] bg-red-50 border border-red-200 active:bg-red-100"
            accessibilityRole="button"
            accessibilityLabel="Sign out of account"
          >
            <Text className="font-sans text-[16px] font-semibold text-red-600">
              Sign Out
            </Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  bottomSpacer: {
    height: 30,
  },
});
