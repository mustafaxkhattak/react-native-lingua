import PostHog from "posthog-react-native";
import Constants from "expo-constants";

// PostHog configuration loaded from app.config.js extras via expo-constants.
// Environment variables are read at build time in app.config.js.
const projectToken = Constants.expoConfig?.extra?.posthogProjectToken as string | undefined;
const host = (Constants.expoConfig?.extra?.posthogHost as string) || "https://us.i.posthog.com";
const isPostHogConfigured = Boolean(projectToken);

if (__DEV__ && !isPostHogConfigured) {
  console.error(
    "POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, " +
      "this causes events to be silently missed. " +
      "This error stops appearing once POSTHOG_PROJECT_TOKEN is configured",
  );
}

/**
 * PostHog client instance for Expo / React Native.
 *
 * Required peer dependency: react-native-svg (installed alongside posthog-react-native).
 * Reads POSTHOG_PROJECT_TOKEN and POSTHOG_HOST from app.config.js extras,
 * which are populated from .env at build time.
 *
 * @see https://posthog.com/docs/libraries/react-native
 */
export const posthog = new PostHog(projectToken || "placeholder_disabled_key", {
  host,

  // Disable PostHog entirely when the project token is not configured.
  disabled: !isPostHogConfigured,

  // Capture app lifecycle events (Installed, Updated, Opened, Backgrounded, etc.)
  captureAppLifecycleEvents: true,

  // Batching for battery efficiency
  flushAt: 20,
  flushInterval: 10000,
  maxBatchSize: 100,
  maxQueueSize: 1000,

  // Feature flags
  preloadFeatureFlags: true,
  sendFeatureFlagEvent: true,
  featureFlagsRequestTimeoutMs: 10000,

  // Network
  requestTimeout: 10000,
  fetchRetryCount: 3,
  fetchRetryDelay: 3000,
});

export const isPostHogEnabled = isPostHogConfigured;
