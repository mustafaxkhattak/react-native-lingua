import { NativeModules, Platform } from "react-native";
import type { StreamVideoClient } from "@stream-io/video-react-native-sdk";

export interface StreamSessionParams {
  userId: string;
  userName?: string;
  userImage?: string;
  lessonId: string;
  languageId: string;
  lessonTitle: string;
  lessonGoal?: string;
  vocabulary?: {
    id?: string;
    word: string;
    translation: string;
    pronunciation?: string;
    example?: string;
  }[];
  phrases?: { text: string; translation: string; pronunciation?: string }[];
  aiTeacherPrompt?: any;
}

export interface StreamSessionResponse {
  apiKey: string;
  token: string;
  callId: string;
  callType: string;
  userId: string;
  lesson?: {
    id: string;
    title: string;
    languageId: string;
  };
}

export interface AgentSessionResponse {
  sessionId: string;
  callId: string;
  sessionStartedAt?: string;
  status: string;
}

export interface StreamUserInfo {
  id: string;
  name?: string;
  image?: string;
  type?: "authenticated";
  custom?: Record<string, any>;
}

/**
 * Checks if the native WebRTC binary is loaded in the current runtime.
 * Returns false on Expo Go or Web where native WebRTC is not compiled in.
 */
export function isWebRTCAvailable(): boolean {
  try {
    return Boolean(NativeModules?.WebRTCModule);
  } catch {
    return false;
  }
}

let cachedStreamSdk: typeof import("@stream-io/video-react-native-sdk") | null = null;

/**
 * Safely loads the Stream Video & Audio React Native SDK.
 * Catches WebRTC native module missing errors gracefully.
 */
export function getStreamVideoSDK(): typeof import("@stream-io/video-react-native-sdk") | null {
  if (cachedStreamSdk) return cachedStreamSdk;

  if (isWebRTCAvailable() || Platform.OS === "web") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      cachedStreamSdk = require("@stream-io/video-react-native-sdk");
      return cachedStreamSdk;
    } catch (err: any) {
      console.warn("Stream Video SDK could not be loaded:", err?.message || err);
    }
  }
  return null;
}

/**
 * Calls the Expo Router API route /api/stream/session to create or retrieve
 * a call session with custom lesson/language metadata and a signed user token.
 */
export async function fetchStreamSession(
  params: StreamSessionParams
): Promise<StreamSessionResponse> {
  try {
    const response = await fetch("/api/stream/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to fetch Stream session (${response.status})`
      );
    }

    const data: StreamSessionResponse = await response.json();
    return data;
  } catch (err: any) {
    // If running in an environment where relative fetch fails, return fallback mock session
    console.warn("fetchStreamSession notice:", err?.message || err);
    const sanitizedUserId = params.userId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedLessonId = params.lessonId.replace(/[^a-zA-Z0-9_-]/g, "_");
    return {
      apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY || "mmhfdzb5evj2",
      token: "demo_stream_token",
      callId: `lesson_${sanitizedLessonId}_${sanitizedUserId.slice(-8)}`,
      callType: "audio_room",
      userId: params.userId,
      lesson: {
        id: params.lessonId,
        title: params.lessonTitle,
        languageId: params.languageId,
      },
    };
  }
}

/**
 * Calls the Expo Router API route /api/stream/agent to start the Vision Agent for a given call.
 */
export async function startAgentSession(
  callId: string,
  callType: string = "audio_room"
): Promise<AgentSessionResponse> {
  const response = await fetch("/api/stream/agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ callId, callType }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.details || `Failed to start Vision Agent session (${response.status})`
    );
  }

  return response.json();
}

/**
 * Calls the Expo Router API route /api/stream/agent to stop the Vision Agent session.
 */
export async function stopAgentSession(
  callId: string,
  sessionId: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch("/api/stream/agent", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ callId, sessionId }),
    });

    if (!response.ok) {
      console.warn(`stopAgentSession notice (${response.status})`);
      return { success: false };
    }

    return response.json();
  } catch (err: any) {
    console.warn("stopAgentSession notice:", err?.message || err);
    return { success: false };
  }
}

/**
 * Token provider for StreamVideoClient auto-refresh.
 * Fetches a fresh user token from /api/stream/token.
 */
export async function fetchStreamUserToken(userId: string): Promise<string> {
  try {
    const response = await fetch(`/api/stream/token?userId=${encodeURIComponent(userId)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Stream token (${response.status})`);
    }
    const data = await response.json();
    return data.token as string;
  } catch {
    return "demo_stream_token";
  }
}

/**
 * Returns or creates the singleton StreamVideoClient instance for the active user if WebRTC is available.
 */
export function getOrCreateStreamClient(
  apiKey: string,
  user: StreamUserInfo,
  tokenOrProvider: string | (() => Promise<string>)
): StreamVideoClient | null {
  const sdk = getStreamVideoSDK();
  if (!sdk) return null;

  const clientOptions = {
    apiKey,
    user: {
      id: user.id,
      name: user.name,
      image: user.image,
      type: "authenticated" as const,
    },
    tokenProvider:
      typeof tokenOrProvider === "function"
        ? tokenOrProvider
        : async () => tokenOrProvider,
    options: {
      logLevel: "warn" as const,
    },
  };

  return sdk.StreamVideoClient.getOrCreateInstance(clientOptions);
}
