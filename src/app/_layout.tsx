import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, usePathname, useGlobalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { PostHogProvider } from "posthog-react-native";
import "../global.css";

import { posthog } from "../config/posthog";

/**
 * Identifies the current Clerk user in PostHog as soon as they sign in.
 * Must render inside ClerkProvider so the useAuth() hook works.
 */
function ClerkAuthIdentify() {
  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn && userId) {
      // Identify returning sessions with the stable Clerk user ID
      posthog.identify(userId);
    } else if (!isSignedIn) {
      // Reset to anonymous tracking when signed out
      posthog.reset();
    }
  }, [isSignedIn, userId]);

  return null;
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk publishable key to the .env file");
}

const clerkPublishableKey: string = publishableKey;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  // Manual screen tracking for Expo Router
  // @see https://posthog.com/docs/libraries/react-native
  useEffect(() => {
    if (!fontsLoaded) return;
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false, // Manual screen tracking with Expo Router above
        captureTouches: true,
        propsToCapture: ["testID"],
      }}
    >
      <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
        <ClerkAuthIdentify />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        />
      </ClerkProvider>
    </PostHogProvider>
  );
}
