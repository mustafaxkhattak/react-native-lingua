const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

/**
 * POST /api/stream/agent/start
 * Proxies request to start the Vision Agent on a Stream call.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { callId, callType = "audio_room" } = body;

    if (!callId) {
      return Response.json(
        { error: "callId is required to start an agent session." },
        { status: 400, headers: corsHeaders }
      );
    }

    const agentBaseUrl = getVisionAgentBaseUrl();
    const endpoint = `${agentBaseUrl}/calls/${encodeURIComponent(callId)}/sessions`;

    const agentRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        call_type: callType,
      }),
    });

    if (!agentRes.ok) {
      const errorText = await agentRes.text().catch(() => "");
      console.warn(`Vision Agent server responded with ${agentRes.status}: ${errorText}`);
      return Response.json(
        {
          error: `Vision Agent server returned ${agentRes.status}`,
          details: errorText,
        },
        { status: agentRes.status, headers: corsHeaders }
      );
    }

    const data = await agentRes.json();
    return Response.json(
      {
        sessionId: data.session_id || data.id,
        callId: data.call_id || callId,
        sessionStartedAt: data.session_started_at || data.started_at,
        status: "started",
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error proxying start agent request:", error?.message || error);
    return Response.json(
      {
        error: error?.message || "Failed to reach Vision Agent server",
        tip: "Ensure 'uv run agent.py serve --host 0.0.0.0 --port 8000' is running in vision-agent/",
      },
      { status: 502, headers: corsHeaders }
    );
  }
}
