import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ContinueLearningCard } from "@/components/home/continue-learning-card";
import { DailyGoalCard } from "@/components/home/daily-goal-card";
import { HomeHeader } from "@/components/home/home-header";
import { NextUpCard } from "@/components/home/next-up-card";
import { TodaysPlan } from "@/components/home/todays-plan";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header with greeting, flag, streak, and bell */}
        <HomeHeader />

        {/* Daily Goal Card with XP counter and Treasure */}
        <DailyGoalCard />

        {/* Continue Learning Featured Card */}
        <ContinueLearningCard />

        {/* Today's Plan Checklist */}
        <TodaysPlan />

        {/* Next Up: AI Video Call Banner */}
        <NextUpCard />

        {/* Bottom spacing helper */}
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
    paddingTop: 8,
    paddingBottom: 110,
  },
  bottomSpacer: {
    height: 20,
  },
});
