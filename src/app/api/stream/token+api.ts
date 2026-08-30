import { StreamClient } from "@stream-io/node-sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
    const userId = body.userId || "anonymous_user";
    const name = body.name || "Learner";
    const image = body.image || undefined;

    const serverClient = new StreamClient(apiKey, apiSecret);

    // Upsert user details in Stream
    await serverClient
      .upsertUsers([
        {
          id: userId,
          name,
          image,
          role: "user",
        },
      ])
      .catch((err) => {
        if (err?.message?.includes("signature") || err?.code === 5) {
          console.warn(
            "[Stream API] Warning: Token signature invalid. Please ensure STREAM_API_KEY and STREAM_API_SECRET in your .env match your app credentials from https://dashboard.getstream.io"
          );
        } else {
          console.warn("Failed to upsert user in Stream:", err?.message || err);
        }
      });

    // Generate token valid for 4 hours
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60 * 4,
    });

    return Response.json(
      {
        apiKey,
        token,
        userId,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error generating Stream token:", error);
    return Response.json(
      { error: error?.message || "Failed to generate Stream token" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId") || url.searchParams.get("user_id") || "anonymous_user";

    const apiKey = process.env.STREAM_API_KEY || process.env.EXPO_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return Response.json(
        { error: "Stream API credentials are not configured on the server." },
        { status: 500, headers: corsHeaders }
      );
    }

    const serverClient = new StreamClient(apiKey, apiSecret);
    const token = serverClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60 * 4,
    });

    return Response.json(
      {
        apiKey,
        token,
        userId,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error generating Stream token (GET):", error);
    return Response.json(
      { error: error?.message || "Failed to generate Stream token" },
      { status: 500, headers: corsHeaders }
    );
  }
}
