import { router, useLocalSearchParams } from "expo-router";
import React from "react";

import { AudioLessonView } from "@/components/audio-lesson/audio-lesson-view";

export default function AiTeacherScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();

  const handleBack = () => {
    // Navigate back to learn tab
    router.navigate("/(tabs)/learn");
  };

  return <AudioLessonView lessonId={lessonId} onBack={handleBack} />;
}
