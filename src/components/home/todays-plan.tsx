import React from "react";
import { Pressable, Text, View } from "react-native";

import { BookIcon, CheckmarkIcon, HeadphonesIcon, WordsIcon } from "@/components/ui/icons";
import { getDailyPlan } from "@/data/plans";
import { useLanguageStore } from "@/store/language-store";
import { useLearningStore } from "@/store/learning-store";
import type { DailyPlanItem } from "@/types/learning";

export function TodaysPlan() {
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguage) ?? "spanish";
  const completedPlanItemIds = useLearningStore((state) => state.completedPlanItemIds);
  const togglePlanItem = useLearningStore((state) => state.togglePlanItem);

  const planItems = getDailyPlan(selectedLanguageId);

  const renderIcon = (icon: DailyPlanItem["icon"]) => {
    switch (icon) {
      case "book":
        return <BookIcon size={22} color="#ffffff" />;
      case "headphones":
        return <HeadphonesIcon size={22} color="#ffffff" />;
      case "words":
        return <WordsIcon size={24} color="#ffffff" />;
    }
  };

  return (
    <View className="mt-6">
      {/* Header Row */}
      <View className="flex-row items-center justify-between pb-2">
        <Text className="font-sans text-[20px] font-bold text-[#1c2136]">
          {"Today's plan"}
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="View all plan items">
          <Text className="font-sans text-[15px] font-semibold text-[#5844eb]">
            View all
          </Text>
        </Pressable>
      </View>

      {/* Plan Items List */}
      <View className="mt-1 gap-1">
        {planItems.map((item) => {
          const isCompleted = completedPlanItemIds.includes(item.id);

          return (
            <Pressable
              key={item.id}
              onPress={() => togglePlanItem(item.id, item.xp)}
              unstable_pressDelay={0}
              hitSlop={4}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isCompleted }}
              accessibilityLabel={`${item.title}, ${item.subtitle}`}
              className="flex-row items-center justify-between py-2.5 active:opacity-75"
            >
              {/* Left: Icon and Text */}
              <View className="flex-1 flex-row items-center gap-3.5">
                {/* Badge Icon */}
                <View
                  style={{ backgroundColor: item.badgeBgColor }}
                  className="h-[52px] w-[52px] items-center justify-center rounded-[18px]"
                >
                  {renderIcon(item.icon)}
                </View>

                {/* Title & Subtitle */}
                <View className="flex-1">
                  <Text className="font-sans text-[17px] font-bold text-[#1c2136]">
                    {item.title}
                  </Text>
                  <Text className="mt-0.5 font-sans text-[14px] text-[#718096]">
                    {item.subtitle}
                  </Text>
                </View>
              </View>

              {/* Right: Checkbox */}
              <View className="ml-3">
                {isCompleted ? (
                  <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-[#5844eb]">
                    <CheckmarkIcon size={14} color="#ffffff" />
                  </View>
                ) : (
                  <View className="h-[26px] w-[26px] rounded-full border-2 border-[#94a3b8]" />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
