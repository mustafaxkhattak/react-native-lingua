FROM python:3.11-slim

# Install system dependencies for audio and WebRTC
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    libasound2-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv for fast Python package management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy dependency files first
COPY pyproject.toml .

# Install dependencies into virtual environment
RUN uv sync --frozen --no-install-project || uv sync --no-install-project

# Copy application source code
COPY . .

# Expose HTTP server port
EXPOSE 8000

ENV HOST=0.0.0.0
ENV PORT=8000

# Start HTTP server
CMD ["uv", "run", "agent.py", "serve", "--host", "0.0.0.0", "--port", "8000"]
