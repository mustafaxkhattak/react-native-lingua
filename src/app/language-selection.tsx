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

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import type { LanguageId } from "@/types/learning";

export default function LanguageSelection() {
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>("spanish");
  const { width } = useWindowDimensions();

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return languages;
    }

    return languages.filter((language) =>
      `${language.name} ${language.nativeName}`.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const selected = languages.find((language) => language.id === selectedLanguage);
  const earthSize = Math.max(width + 32, 352);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View className="flex-row items-center justify-center">
          <Pressable
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="absolute left-0 h-11 w-11 items-center justify-center"
          >
            <Text className="font-sans text-[38px] leading-[38px] text-text-primary">‹</Text>
          </Pressable>
          <Text className="font-sans text-[25px] font-semibold text-text-primary">
            Choose a language
          </Text>
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
            const isSelected = language.id === selectedLanguage;

            return (
              <Pressable
                key={language.id}
                onPress={() => setSelectedLanguage(language.id)}
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
          onPress={() => router.replace("/")}
          className="mt-6 h-[68px] flex-row items-center justify-center rounded-[22px] bg-brand-purple active:bg-brand-deep-purple disabled:opacity-50"
          accessibilityRole="button"
        >
          <Text className="font-sans text-[18px] font-semibold text-white">
            Continue with {selected?.name ?? "language"}
          </Text>
          <Text className="ml-3 font-sans text-[27px] leading-[27px] text-white">›</Text>
        </Pressable>

        <View style={[styles.earthFrame, { width, height: Math.min(250, width * 0.48) }]}>
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
