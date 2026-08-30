import { StreamClient } from "@stream-io/node-sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.STREAM_API_KEY || process.env.EXPO_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return Response.json(
        { error: "Stream API credentials are not configured on the server." },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      userId = "anonymous_learner",
      userName = "Learner",
      userImage,
      lessonId = "spanish-cafe",
      languageId = "spanish",
      lessonTitle = "At the Café",
      lessonGoal = "Order food and drinks at cafés",
      vocabulary = [],
      phrases = [],
      aiTeacherPrompt,
    } = body;

    // Sanitize user ID and call ID for Stream ID character rules (letters, numbers, hyphens, underscores)
    const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const sanitizedLessonId = lessonId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const callId = `lesson_${sanitizedLessonId}_${sanitizedUserId.slice(-8)}`;
    const callType = "audio_room";

    const serverClient = new StreamClient(apiKey, apiSecret);

    // 1. Upsert learner user and AI Teacher user in Stream
    await serverClient
      .upsertUsers([
        {
          id: userId,
          name: userName,
          image: userImage || undefined,
          role: "user",
        },
        {
          id: "ai-teacher",
          name: "Lingua AI Teacher",
          role: "admin",
        },
      ])
      .catch((err) => {
        if (err?.message?.includes("signature") || err?.code === 5) {
          console.warn(
            "[Stream API] Warning: Token signature invalid. Please ensure STREAM_API_KEY and STREAM_API_SECRET in your .env match your app credentials from https://dashboard.getstream.io"
          );
        } else {
          console.warn("User upsert warning:", err?.message || err);
        }
      });

    // 2. Generate user token (valid for 4 hours)
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60 * 4,
    });

    // 3. Create or get the audio room call with custom lesson/language metadata
    const call = serverClient.video.call(callType, callId);
    await call
      .getOrCreate({
        data: {
          created_by_id: userId,
          members: [
            { user_id: userId, role: "admin" },
            { user_id: "ai-teacher", role: "admin" },
          ],
          custom: {
            lessonId,
            languageId,
            lessonTitle,
            lessonGoal: typeof lessonGoal === "string" ? lessonGoal : JSON.stringify(lessonGoal || ""),
            vocabulary: JSON.stringify(vocabulary || []),
            phrases: JSON.stringify(phrases || []),
            aiTeacherPrompt: aiTeacherPrompt ? JSON.stringify(aiTeacherPrompt) : undefined,
          },
        },
      })
      .catch((err) => {
        if (!err?.message?.includes("signature")) {
          console.warn("Call getOrCreate warning:", err?.message || err);
        }
      });

    return Response.json(
      {
        apiKey,
        token,
        callId,
        callType,
        userId,
        lesson: {
          id: lessonId,
          title: lessonTitle,
          languageId,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error creating Stream audio session:", error);
    return Response.json(
      { error: error?.message || "Failed to create Stream audio session" },
      { status: 500, headers: corsHeaders }
    );
  }
}
