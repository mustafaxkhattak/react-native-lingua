import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCardItem } from "@/components/lesson/lesson-card-item";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonHeroBanner } from "@/components/lesson/lesson-hero-banner";
import { LessonTabSelector, type LessonTabType } from "@/components/lesson/lesson-tab-selector";
import { PracticeView } from "@/components/lesson/practice-view";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/language-store";
import { useLearningStore } from "@/store/learning-store";
import type { Lesson } from "@/types/learning";

export default function LearnScreen() {
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage) ?? "spanish";
  const completedLessonIds = useLearningStore((state) => state.completedLessonIds);
  const activeLessonId = useLearningStore((state) => state.activeLessonId);
  const setActiveLessonId = useLearningStore((state) => state.setActiveLessonId);

  const [currentTab, setCurrentTab] = useState<LessonTabType>("lessons");

  // Get matching language info
  const currentLanguage = useMemo(() => {
    return languages.find((l) => l.id === selectedLanguage) || languages[0];
  }, [selectedLanguage]);

  // Get all lessons for current language
  const languageLessons = useMemo(() => {
    const list = lessons.filter((l) => l.languageId === selectedLanguage);
    if (list.length > 0) return list;
    // Fallback to spanish lessons if language has no custom set
    return lessons.filter((l) => l.languageId === "spanish");
  }, [selectedLanguage]);

  // Get active unit
  const activeUnit = useMemo(() => {
    const unit = units.find((u) => u.languageId === selectedLanguage);
    return unit || units[0];
  }, [selectedLanguage]);

  // Resolve current active lesson (defaulting to Lesson 3 "At the Café" or first in-progress/selected lesson)
  const currentActiveLesson = useMemo(() => {
    if (activeLessonId) {
      const found = languageLessons.find((l) => l.id === activeLessonId);
      if (found) return found;
    }
    // Default to the 3rd lesson (At the Café) matching the design mock
    return languageLessons[2] || languageLessons[0];
  }, [activeLessonId, languageLessons]);

  // Header texts
  const headerTitle = currentActiveLesson.title || "At the Café";
  const completedCount = languageLessons.filter((l) =>
    completedLessonIds.includes(l.id),
  ).length;
  const totalCount = languageLessons.length;
  const headerSubtitle = `Unit ${activeUnit.number || 3} • ${completedCount + 1} / ${totalCount} lessons`;

  // Resolve hero banner image
  const heroImageSource = useMemo(() => {
    if (currentActiveLesson.imageAssetKey && images[currentActiveLesson.imageAssetKey as keyof typeof images]) {
      return images[currentActiveLesson.imageAssetKey as keyof typeof images];
    }
    if (currentActiveLesson.id.includes("cafe") || currentActiveLesson.title.toLowerCase().includes("café")) {
      return images.mascotCafeBanner;
    }
    return images.mascotCafeBanner;
  }, [currentActiveLesson]);

  // Handle lesson selection (no locking restriction)
  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Top Header Bar */}
      <LessonHeader
        title={headerTitle}
        subtitle={headerSubtitle}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mascot Hero Illustration Banner */}
        <LessonHeroBanner
          imageSource={heroImageSource}
          imageUrl={currentActiveLesson.imageUrl}
          accessibilityLabel={`${headerTitle} illustration banner`}
        />

        {/* Segmented Pill Selector: Lessons vs Practice */}
        <LessonTabSelector
          activeTab={currentTab}
          onSelectTab={setCurrentTab}
        />

        {/* Tab Content: Lessons List */}
        {currentTab === "lessons" ? (
          <View className="px-5 pt-2">
            {languageLessons.map((lesson, index) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              const isActive = lesson.id === currentActiveLesson.id;

              return (
                <LessonCardItem
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  onPress={handleSelectLesson}
                />
              );
            })}
          </View>
        ) : (
          /* Tab Content: Practice Mode View */
          <PracticeView languageName={currentLanguage.name} />
        )}

        {/* Bottom spacer for tab bar clearance */}
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
    paddingBottom: 110,
  },
  bottomSpacer: {
    height: 30,
  },
});
