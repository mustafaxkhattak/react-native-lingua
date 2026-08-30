const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const getVisionAgentBaseUrl = () => {
  return (
    process.env.VISION_AGENT_URL ||
    process.env.EXPO_PUBLIC_VISION_AGENT_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/$/, "");
};

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

async function handleStop(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    const callId = body.callId || url.searchParams.get("callId");
    const sessionId = body.sessionId || url.searchParams.get("sessionId");

    if (!callId || !sessionId) {
      return Response.json(
        { error: "callId and sessionId are required to stop an agent session." },
        { status: 400, headers: corsHeaders }
      );
    }

    const agentBaseUrl = getVisionAgentBaseUrl();
    const endpoint = `${agentBaseUrl}/calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}`;

    const agentRes = await fetch(endpoint, {
      method: "DELETE",
    });

    if (!agentRes.ok && agentRes.status !== 404) {
      const errorText = await agentRes.text().catch(() => "");
      console.warn(`Vision Agent close session responded with ${agentRes.status}: ${errorText}`);
    }

    return Response.json(
      {
        success: true,
        callId,
        sessionId,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error proxying stop agent request:", error?.message || error);
    return Response.json(
      {
        success: false,
        error: error?.message || "Failed to contact Vision Agent server",
      },
      { headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  return handleStop(request);
}

export async function DELETE(request: Request) {
  return handleStop(request);
}
