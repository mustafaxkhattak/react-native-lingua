// app.config.js — dynamic Expo config
// Extends app.json and exposes PostHog keys as Expo extras, read from .env at build time.
// Access in app code via: Constants.expoConfig?.extra?.posthogProjectToken

export default {
  expo: {
    name: "APP",
    slug: "APP",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "app",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.APP",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      ],
      "@clerk/expo",
      "expo-secure-store",
      "expo-web-browser",
      "@stream-io/video-react-native-sdk",
      [
        "@config-plugins/react-native-webrtc",
        {
          cameraPermission: "$(PRODUCT_NAME) requires camera access for video lessons",
          microphonePermission: "$(PRODUCT_NAME) requires microphone access for audio lessons",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 24,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
      streamApiKey: process.env.STREAM_API_KEY || process.env.EXPO_PUBLIC_STREAM_API_KEY,
    },
  },
};
