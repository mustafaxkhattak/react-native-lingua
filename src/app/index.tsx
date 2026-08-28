import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <View className="mb-5 w-full flex-row items-center justify-center gap-3">
        <Image
          source={images.mascotLogo}
          contentFit="contain"
          style={styles.logo}
          accessibilityLabel="Lingua mascot"
        />
        <Text className="type__h2 text-text-primary">Lingua</Text>
      </View>
      <Link href="/onboarding" asChild>
        <Pressable className="w-full max-w-[320px] items-center rounded-control bg-brand-purple px-8 py-4">
          <Text className="font-sans text-base font-semibold text-white">
            Open Onboarding
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 64,
    height: 64,
    flexShrink: 0,
  },
});
