import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import type { LanguageId } from "@/types/learning";

export default function LanguageSelection() {
  const posthog = usePostHog();
  const [query, setQuery] = useState("");
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useLanguageStore((state) => state.setSelectedLanguage);
  const [draftLanguage, setDraftLanguage] = useState<LanguageId>(selectedLanguage ?? "spanish");
  const { width } = useWindowDimensions();
  const activeLanguage = draftLanguage;

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return languages;
    }

    return languages.filter((language) =>
      `${language.name} ${language.nativeName}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const selected = languages.find((language) => language.id === activeLanguage);
  const earthSize = Math.min(Math.max(width * 0.92, 260), 420);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerStyle={styles.content}
      >
        <View className="mb-2 h-11 flex-row items-center">
          <Pressable
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center"
          >
            <Text className="mt-[-1px] font-sans text-[28px] leading-[28px] text-text-primary">
              ‹
            </Text>
          </Pressable>

          <View className="flex-1 items-center">
            <Text className="font-sans text-[24px] font-semibold leading-[28px] text-text-primary">
              Choose a language
            </Text>
          </View>

          <View className="h-11 w-11" />
        </View>

        <View className="mt-8 h-[70px] flex-row items-center rounded-[35px] border border-[#e4e5eb] bg-[#fbfbfd] px-6">
          <Text className="mr-4 font-sans text-[32px] leading-[32px] text-[#61708c]">⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search languages"
            placeholderTextColor="#71809b"
            className="flex-1 font-sans text-[18px] text-text-primary"
            accessibilityLabel="Search languages"
            returnKeyType="search"
          />
        </View>

        <Text className="mb-4 mt-8 font-sans text-[20px] font-semibold text-text-primary">
          Popular
        </Text>

        <View className="gap-2">
          {filteredLanguages.map((language) => {
            const isSelected = language.id === activeLanguage;

            return (
              <Pressable
                key={language.id}
                onPress={() => setDraftLanguage(language.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                className={`h-[116px] flex-row items-center rounded-[24px] border px-5 ${
                  isSelected
                    ? "border-brand-purple bg-[#faf9ff]"
                    : "border-[#f0f0f3] bg-white"
                }`}
              >
                <Text className="w-[58px] text-center text-[38px]">{language.flag}</Text>
                <View className="ml-4 flex-1">
                  <Text className="font-sans text-[20px] text-text-primary">{language.name}</Text>
                  <Text className="mt-1 font-sans text-[16px] text-[#71809b]">
                    {language.learnerCount}
                  </Text>
                </View>
                {isSelected ? (
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-purple">
                    <Text className="font-sans text-[24px] font-semibold leading-[27px] text-white">
                      ✓
                    </Text>
                  </View>
                ) : (
                  <Text className="font-sans text-[34px] leading-[34px] text-[#61708c]">›</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {filteredLanguages.length === 0 ? (
          <Text className="py-8 text-center font-sans text-[16px] text-text-secondary">
            No languages found
          </Text>
        ) : null}

        <Pressable
          disabled={!selected}
          onPress={() => {
            setSelectedLanguage(activeLanguage);
            posthog.capture("language_selected", {
              language_id: activeLanguage,
              language_name: selected?.name ?? activeLanguage,
            });
            router.replace("/");
          }}
          className="mt-6 h-[68px] flex-row items-center justify-center rounded-[22px] bg-brand-purple active:bg-brand-deep-purple disabled:opacity-50"
          accessibilityRole="button"
        >
          <Text className="font-sans text-[18px] font-semibold text-white">
            Continue with {selected?.name ?? "language"}
          </Text>
          <Text style={styles.continueArrow}>›</Text>
        </Pressable>

        <View style={[styles.earthFrame, { width: Math.min(width - 32, 360), height: 175 }]}>
          <Image
            source={images.earth}
            contentFit="contain"
            style={[styles.earth, { width: earthSize, height: earthSize }]}
            accessibilityLabel="Illustration of landmarks from around the world"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 8,
  },
  continueArrow: {
    marginLeft: 10,
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 26,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  earth: {
    alignSelf: "center",
    marginTop: -96,
  },
  earthFrame: {
    alignSelf: "center",
    marginTop: 22,
    overflow: "hidden",
  },
});
