import { useAuth } from "@clerk/expo";
import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

export default function Onboarding() {
  const { isLoaded, isSignedIn } = useAuth();
  const { width, height } = useWindowDimensions();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }
  const artworkSize =
    height < 650
      ? Math.max(160, Math.min(240, height - 350))
      : Math.min(340, Math.max(220, height * 0.32));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View className="flex-1 px-10" style={styles.screenContent}>
        <View className="items-center pt-12">
          <View className="flex-row items-center gap-3">
            <Image
              source={images.mascotLogo}
              contentFit="contain"
              style={styles.logo}
              accessibilityLabel="Lingua mascot"
            />
            <Text className="font-sans text-[36px] text-text-primary" style={styles.boldText}>
              Lingua
            </Text>
          </View>
        </View>

        <View className="pt-7">
          <Text className="font-sans text-[34px] leading-[41px] text-text-primary" style={styles.boldText}>
            Your AI language
          </Text>
          <Text className="font-sans text-[34px] leading-[41px] text-brand-purple" style={styles.boldText}>
            teacher.
          </Text>
          <Text className="mt-3 font-sans text-[17px] leading-[27px] text-text-secondary">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        <View
          className="relative mt-2 items-center justify-end"
          style={{ height: artworkSize }}
        >
          <View className="absolute left-0 top-8 rounded-[22px] bg-[#edf7ff] px-5 py-3">
            <Text className="font-sans text-[21px] font-medium text-text-primary">
              Hello!
            </Text>
          </View>
          <View className="absolute right-0 top-0 rotate-[9deg] rounded-[22px] bg-[#f5f5ff] px-5 py-3">
            <Text className="font-sans text-[21px] font-medium text-brand-purple">
              ¡Hola!
            </Text>
          </View>
          <View className="absolute right-0 top-28 -rotate-[7deg] rounded-[22px] bg-[#fff4ed] px-5 py-3">
            <Text className="font-sans text-[21px] font-medium text-[#f15d4a]">
              你好!
            </Text>
          </View>
          <Image
            source={images.mascotWelcome}
            contentFit="contain"
            style={{
              width: height < 650 ? Math.min(780, width * 1.4) : Math.min(520, width * 1.3),
              height: artworkSize * 1.25,
              flexShrink: 0,
              transform: [{ translateY: 145 }],
            }}
            accessibilityLabel="Smiling fox language teacher"
          />
        </View>

        <Pressable
          onPress={() => router.replace("/sign-up")}
          className="absolute bottom-6 left-14 right-14 h-16 flex-row items-center justify-center rounded-[20px] bg-brand-purple active:bg-brand-deep-purple"
          style={styles.button}
        >
          <Text className="font-sans text-[20px] font-semibold text-white">
            Get Started
          </Text>
          <View style={styles.arrow} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 56,
    height: 56,
  },
  boldText: {
    fontFamily: "Poppins-Bold",
  },
  screenContent: {
    paddingBottom: 88,
  },
  button: {
    bottom: 24,
  },
  arrow: {
    marginLeft: 12,
    width: 13,
    height: 13,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: "#ffffff",
    transform: [{ rotate: "-45deg" }],
  },
});