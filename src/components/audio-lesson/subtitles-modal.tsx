import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { VolumeSpeakerIcon } from "@/components/ui/icons";
import type { Lesson, Phrase } from "@/types/learning";

interface SubtitlesModalProps {
  visible: boolean;
  onClose: () => void;
  lesson: Lesson;
  activePhraseIndex: number;
  onSelectPhrase: (phrase: Phrase, index: number) => void;
}

export function SubtitlesModal({
  visible,
  onClose,
  lesson,
  activePhraseIndex,
  onSelectPhrase,
}: SubtitlesModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheetContainer} className="bg-white rounded-t-[32px] pt-3 pb-8 px-5">
          {/* Sheet Handle */}
          <View className="items-center py-1">
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 pt-1 border-b border-[#edf0f7]">
            <View className="flex-1 pr-2">
              <Text className="font-sans text-[12px] font-semibold uppercase tracking-wider text-[#5e54eb]">
                {lesson.languageId} • Lesson {lesson.number}
              </Text>
              <Text className="font-sans text-[18px] font-bold text-[#1c2136] mt-0.5">
                {lesson.title} Subtitles & Phrases
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              unstable_pressDelay={0}
              className="w-8 h-8 rounded-full bg-[#f1f3f9] items-center justify-center active:opacity-70"
            >
              <Text className="font-sans text-[16px] font-bold text-[#5d6475]">✕</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            className="mt-3"
          >
            {/* AI Teacher Coaching Context */}
            {lesson.aiTeacherPrompt && (
              <View className="rounded-2xl bg-[#f5f3ff] p-3.5 mb-4 border border-[#e0e7ff]">
                <Text className="font-sans text-[12px] font-bold text-[#5e54eb] uppercase tracking-wider">
                  Teacher Coaching Focus
                </Text>
                <Text className="font-sans text-[13px] font-medium text-[#374151] mt-1">
                  {lesson.aiTeacherPrompt.coachingFocus}
                </Text>
              </View>
            )}

            {/* Lesson Phrases Section */}
            <Text className="font-sans text-[14px] font-bold text-[#1c2136] mb-2">
              Practice Phrases
            </Text>

            {lesson.phrases.map((phrase, index) => {
              const isCurrent = index === activePhraseIndex;
              return (
                <Pressable
                  key={phrase.id}
                  onPress={() => onSelectPhrase(phrase, index)}
                  unstable_pressDelay={0}
                  style={[
                    styles.phraseItem,
                    isCurrent ? styles.phraseItemActive : styles.phraseItemInactive,
                  ]}
                  className="p-3.5 rounded-2xl mb-2.5 flex-row items-center justify-between"
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className={`font-sans text-[15px] font-bold ${
                        isCurrent ? "text-[#5e54eb]" : "text-[#1c2136]"
                      }`}
                    >
                      {phrase.text}
                    </Text>
                    {phrase.pronunciation && (
                      <Text className="font-sans text-[12px] text-[#718096] italic mt-0.5">
                        [{phrase.pronunciation}]
                      </Text>
                    )}
                    <Text className="font-sans text-[13px] font-medium text-[#4b5563] mt-0.5">
                      {phrase.translation}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.speakerBadge,
                      isCurrent && styles.speakerBadgeActive,
                    ]}
                  >
                    <VolumeSpeakerIcon
                      size={18}
                      color={isCurrent ? "#ffffff" : "#5e54eb"}
                    />
                  </View>
                </Pressable>
              );
            })}

            {/* Key Vocabulary preview */}
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <View className="mt-2">
                <Text className="font-sans text-[14px] font-bold text-[#1c2136] mb-2">
                  Lesson Vocabulary
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {lesson.vocabulary.map((vocab) => (
                    <View
                      key={vocab.id}
                      className="rounded-xl bg-[#f8fafc] px-3 py-2 border border-[#edf0f7]"
                    >
                      <Text className="font-sans text-[13px] font-bold text-[#1c2136]">
                        {vocab.word}
                      </Text>
                      <Text className="font-sans text-[11px] text-[#64748b]">
                        {vocab.translation}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    maxHeight: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginBottom: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  phraseItem: {
    borderWidth: 1.5,
  },
  phraseItemInactive: {
    backgroundColor: "#fcfdfe",
    borderColor: "#edf0f7",
  },
  phraseItemActive: {
    backgroundColor: "#f5f3ff",
    borderColor: "#7c71f6",
  },
  speakerBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f4f3ff",
    alignItems: "center",
    justifyContent: "center",
  },
  speakerBadgeActive: {
    backgroundColor: "#5e54eb",
  },
});
