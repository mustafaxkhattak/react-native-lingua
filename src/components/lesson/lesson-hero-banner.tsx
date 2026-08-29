import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

import { images } from "@/constants/images";

interface LessonHeroBannerProps {
  imageSource?: any;
  imageUrl?: string;
  accessibilityLabel?: string;
}

export function LessonHeroBanner({
  imageSource,
  imageUrl,
  accessibilityLabel = "Lesson illustration banner",
}: LessonHeroBannerProps) {
  // Determine final image source: provided source, or image URL, or mascotCafeBanner default
  const resolvedSource =
    imageSource ??
    (imageUrl ? { uri: imageUrl } : images.mascotCafeBanner);

  return (
    <View className="w-full px-5 pt-1 pb-3">
      <View
        style={styles.bannerContainer}
        className="w-full h-[220px] rounded-3xl overflow-hidden bg-slate-100"
      >
        <Image
          source={resolvedSource}
          style={styles.image}
          contentFit="cover"
          transition={300}
          accessibilityLabel={accessibilityLabel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
