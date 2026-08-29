import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type LessonTabType = "lessons" | "practice";

interface LessonTabSelectorProps {
  activeTab: LessonTabType;
  onSelectTab: (tab: LessonTabType) => void;
}

export function LessonTabSelector({ activeTab, onSelectTab }: LessonTabSelectorProps) {
  const isLessonsActive = activeTab === "lessons";
  const isPracticeActive = activeTab === "practice";

  return (
    <View className="px-5 py-2">
      <View
        style={styles.container}
        className="w-full flex-row items-center justify-between p-1.5 rounded-2xl bg-[#f1f2f8]"
      >
        {/* Lessons Tab */}
        <Pressable
          onPress={() => onSelectTab("lessons")}
          unstable_pressDelay={0}
          accessibilityRole="tab"
          accessibilityState={{ selected: isLessonsActive }}
          style={[styles.tabButton, isLessonsActive && styles.activeTabShadow]}
          className={`flex-1 py-3 items-center justify-center rounded-xl ${
            isLessonsActive ? "bg-white" : "bg-transparent"
          }`}
        >
          <View className="items-center justify-center">
            <Text
              className={`font-sans text-[15px] ${
                isLessonsActive
                  ? "font-bold text-[#5e54eb]"
                  : "font-semibold text-[#8a92a6]"
              }`}
            >
              Lessons
            </Text>

            {/* Bottom active pill indicator */}
            {isLessonsActive && (
              <View className="w-10 h-[3.5px] bg-[#5e54eb] rounded-full mt-1" />
            )}
          </View>
        </Pressable>

        {/* Practice Tab */}
        <Pressable
          onPress={() => onSelectTab("practice")}
          unstable_pressDelay={0}
          accessibilityRole="tab"
          accessibilityState={{ selected: isPracticeActive }}
          style={[styles.tabButton, isPracticeActive && styles.activeTabShadow]}
          className={`flex-1 py-3 items-center justify-center rounded-xl ${
            isPracticeActive ? "bg-white" : "bg-transparent"
          }`}
        >
          <View className="items-center justify-center">
            <Text
              className={`font-sans text-[15px] ${
                isPracticeActive
                  ? "font-bold text-[#5e54eb]"
                  : "font-semibold text-[#8a92a6]"
              }`}
            >
              Practice
            </Text>

            {/* Bottom active pill indicator */}
            {isPracticeActive && (
              <View className="w-10 h-[3.5px] bg-[#5e54eb] rounded-full mt-1" />
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#e8ebf3",
  },
  tabButton: {
    minHeight: 44,
  },
  activeTabShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
