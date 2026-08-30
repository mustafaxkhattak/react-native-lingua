# Vision Agent - AI Language Teacher

This service is a real-time, voice-only AI language teacher powered by [Vision Agents](https://visionagents.ai), OpenAI Realtime, and Stream Edge WebRTC transport.

## Architecture

- **Transport**: [GetStream Edge](https://getstream.io/video/) WebRTC audio network
- **LLM**: OpenAI Realtime API (`gpt-realtime-2` voice-only speech-to-speech)
- **Framework**: `vision-agents` with `vision-agents-plugins-getstream` and `vision-agents-plugins-openai`
- **Language Mode**: Teaches target languages using English as the primary medium of explanation and guidance.

## Prerequisites

- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Stream Video API credentials
- OpenAI API key (with Realtime API access)

## Setup

1. Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```

2. Required environment variables:
   ```env
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

## Running the Service

### 1. Console / Development Mode
To start a single agent session and test locally:
```bash
uv run agent.py run --call-type audio_room --call-id <CALL_ID>
```

### 2. HTTP Server Mode (Production / Mobile App Integration)
To start the HTTP server that accepts session requests from your backend/mobile app:
```bash
uv run agent.py serve --host 0.0.0.0 --port 8000
```

### HTTP Server Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/calls/{call_id}/sessions?call_type=audio_room` | Spawns and joins the AI Teacher to the call |
| `DELETE`| `/calls/{call_id}/sessions/{session_id}` | Disconnects the agent from the call |
| `GET`  | `/health` | Health check endpoint |
| `GET`  | `/ready` | Readiness check endpoint |

## Docker Deployment

Build and run using Docker:
```bash
docker build -t vision-agent .
docker run -p 8000:8000 --env-file .env vision-agent
```
