import asyncio
import json
import logging
import os
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

from vision_agents.core import Agent, AgentLauncher, Runner, ServeOptions, User
from vision_agents.plugins import getstream, openai

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("vision_agent.ai_teacher")

DEFAULT_TEACHER_INSTRUCTIONS = """\
You are an expert, encouraging, and friendly AI Language Teacher in a real-time voice lesson with a student.

Core Persona & Rules:
1. Primary Language: You speak in clear, natural, friendly English to explain concepts, give instructions, and guide the student.
2. Target Language Teaching: You teach the student's selected language using English as the medium of instruction.
3. Interactive Pedagogy:
   - Introduce target language words, vocabulary, and practical conversational phrases step-by-step.
   - Say the target word or phrase with clear pronunciation, followed immediately by its English meaning.
   - Prompt the student to repeat and practice speaking the word or phrase.
   - Listen attentively to their response. Provide warm encouragement, gentle pronunciation tips, and constructive feedback.
   - Introduce brief roleplays relevant to the lesson topic.
4. Spoken Voice Formatting:
   - This is an audio-only call. Keep all responses concise and conversational (1 to 3 short sentences per turn).
   - Never output markdown formatting, bullet points, asterisks, hashtags, or emojis, as they disrupt speech synthesis.
   - Keep the flow interactive with natural turn-taking. Do not monologue.
"""


def build_teacher_instructions(
    language_id: str,
    lesson_title: str,
    lesson_goal: str,
    vocabulary: List[Dict[str, Any]],
    phrases: List[Dict[str, Any]],
    ai_teacher_prompt: Dict[str, Any],
) -> str:
    """Builds customized, prompt-engineered instructions for the AI Teacher based on lesson metadata."""
    target_lang = language_id.capitalize() if language_id else "the target language"

    vocab_lines = []
    for item in vocabulary[:8]:
        word = item.get("word", "")
        trans = item.get("translation", "")
        pron = item.get("pronunciation", "")
        if word:
            vocab_lines.append(f"- {word} ({trans})" + (f" [Pronunciation: {pron}]" if pron else ""))

    phrases_lines = []
    for p in phrases[:6]:
        text = p.get("text", "")
        trans = p.get("translation", "")
        if text:
            phrases_lines.append(f"- {text} -> {trans}")

    coaching_focus = ""
    system_custom = ""
    if isinstance(ai_teacher_prompt, dict):
        coaching_focus = ai_teacher_prompt.get("coachingFocus", "")
        system_custom = ai_teacher_prompt.get("system", "")

    instructions = f"""You are an expert, encouraging, and friendly AI Language Teacher in a real-time voice lesson with a student.

Language & Lesson Context:
- Target Language to Teach: {target_lang}
- Current Lesson: {lesson_title}
- Lesson Goal: {lesson_goal}
{f"- Special System Focus: {system_custom}" if system_custom else ""}
{f"- Coaching Priority: {coaching_focus}" if coaching_focus else ""}

Key Vocabulary to Teach and Practice:
{chr(10).join(vocab_lines) if vocab_lines else "- Conversational basics for " + lesson_title}

Key Conversational Phrases:
{chr(10).join(phrases_lines) if phrases_lines else "- Useful everyday expressions"}

Pedagogy & Interaction Rules:
1. Speak in English as the medium of instruction, teaching {target_lang} words and phrases.
2. Say words and phrases clearly, explain what they mean, and prompt the learner to repeat them aloud.
3. Keep each turn short and natural (1 to 3 short sentences). Always wait for the learner to speak.
4. Provide positive, constructive feedback on their pronunciation and effort.
5. NEVER use markdown characters, asterisks (*), bullet points, hashtags (#), or emojis in your speech output.
"""
    return instructions


async def create_agent(**kwargs) -> Agent:
    """Factory function that creates and returns a new AI Teacher Agent instance.

    A new Agent instance is created for each call session.
    """
    stream_api_key = os.getenv("STREAM_API_KEY")
    stream_api_secret = os.getenv("STREAM_API_SECRET")
    openai_api_key = os.getenv("OPENAI_API_KEY")

    if not stream_api_key or not stream_api_secret:
        logger.warning(
            "STREAM_API_KEY or STREAM_API_SECRET is missing. Ensure they are configured in vision-agent/.env"
        )

    if not openai_api_key:
        logger.warning(
            "OPENAI_API_KEY is not set. OpenAI Realtime connection will require this key."
        )

    agent_user = User(
        id="ai-teacher",
        name="Lingua AI Teacher",
    )

    # Configure OpenAI Realtime LLM (Voice-only speech-to-speech)
    llm = openai.Realtime(
        model=os.getenv("OPENAI_REALTIME_MODEL", "gpt-realtime-2"),
        voice=os.getenv("OPENAI_VOICE", "alloy"),
        api_key=openai_api_key,
        send_video=False,
    )

    # Configure Stream Edge Transport for WebRTC real-time audio
    edge = getstream.Edge()

    # Create the Agent
    agent = Agent(
        edge=edge,
        agent_user=agent_user,
        instructions=DEFAULT_TEACHER_INSTRUCTIONS,
        llm=llm,
    )

    return agent


async def join_call(agent: Agent, call_type: str, call_id: str):
    """Lifecycle handler executed when the AI Teacher joins a Stream call."""
    logger.info(f"🎙️ AI Teacher connecting to call: {call_type}/{call_id}")

    # Create/retrieve the call on the Stream edge network
    call = agent.edge.client.video.call(call_type, call_id)

    # Ensure the call is live for audio broadcasting in audio_room
    try:
        await call.go_live()
        logger.info(f"📡 Call go_live confirmed for {call_id}")
    except Exception as e:
        logger.info(f"Notice during call go_live (may already be live): {e}")

    # Fetch custom lesson and language metadata packed by the app
    language_id = "Spanish"
    lesson_title = "Language Practice"
    lesson_goal = "Conversational practice"
    vocabulary: List[Dict[str, Any]] = []
    phrases: List[Dict[str, Any]] = []
    ai_teacher_prompt: Dict[str, Any] = {}
    opening_greeting = None

    try:
        call_details = await call.get()
        call_data = getattr(call_details, "data", None)
        call_obj = getattr(call_data, "call", None) if call_data else None
        custom = getattr(call_obj, "custom", {}) if call_obj else {}
        if isinstance(custom, dict) and custom:
            language_id = custom.get("languageId", language_id)
            lesson_title = custom.get("lessonTitle", lesson_title)
            lesson_goal = custom.get("lessonGoal", lesson_goal)

            raw_vocab = custom.get("vocabulary")
            if isinstance(raw_vocab, str):
                try:
                    vocabulary = json.loads(raw_vocab)
                except Exception:
                    vocabulary = []
            elif isinstance(raw_vocab, list):
                vocabulary = raw_vocab

            raw_phrases = custom.get("phrases")
            if isinstance(raw_phrases, str):
                try:
                    phrases = json.loads(raw_phrases)
                except Exception:
                    phrases = []
            elif isinstance(raw_phrases, list):
                phrases = raw_phrases

            raw_prompt = custom.get("aiTeacherPrompt")
            if isinstance(raw_prompt, str):
                try:
                    ai_teacher_prompt = json.loads(raw_prompt)
                except Exception:
                    ai_teacher_prompt = {}
            elif isinstance(raw_prompt, dict):
                ai_teacher_prompt = raw_prompt

            if isinstance(ai_teacher_prompt, dict):
                opening_greeting = ai_teacher_prompt.get("opening")

            # Update LLM instructions dynamically for this specific lesson
            tailored_instructions = build_teacher_instructions(
                language_id=language_id,
                lesson_title=lesson_title,
                lesson_goal=lesson_goal,
                vocabulary=vocabulary,
                phrases=phrases,
                ai_teacher_prompt=ai_teacher_prompt,
            )
            agent.llm.set_instructions(tailored_instructions)
            logger.info(f"📚 Loaded custom lesson prompt for '{lesson_title}' ({language_id})")
    except Exception as e:
        logger.warning(f"Could not load custom call metadata, using defaults: {e}")

    # Join the call session using the async context manager
    try:
        async with agent.join(call):
            logger.info(f"✅ AI Teacher successfully joined call: {call_id}")

            # Greet the learner and open the conversational lesson
            if opening_greeting:
                greeting_prompt = (
                    f"Warmly greet the student in English and introduce the {language_id} lesson '{lesson_title}'. "
                    f"Say something like: '{opening_greeting}'. Then invite them to begin practicing."
                )
            else:
                greeting_prompt = (
                    f"Warmly greet the student in English, introduce yourself as their AI language teacher for '{lesson_title}', "
                    f"and ask if they are ready to practice {language_id} today."
                )

            await agent.simple_response(
                greeting_prompt,
                interrupt=True,
            )

            # Keep agent active until the call concludes
            await agent.finish()

        logger.info(f"👋 AI Teacher session completed for call: {call_id}")
    except Exception as e:
        if "insufficient_quota" in str(e) or "credit_balance_exhausted" in str(e) or "429" in str(e):
            logger.error(
                "❌ OpenAI API Quota Exhausted: You have no credits remaining on your OpenAI account. "
                "Please add credits at https://platform.openai.com/settings/organization/billing/ or update OPENAI_API_KEY in vision-agent/.env"
            )
        else:
            logger.error(f"❌ Error during AI Teacher call session ({call_id}): {e}", exc_info=True)


# Create the launcher with session and idle timeouts
launcher = AgentLauncher(
    create_agent=create_agent,
    join_call=join_call,
    agent_idle_timeout=float(os.getenv("AGENT_IDLE_TIMEOUT", "60.0")),
)

# Runner manages CLI commands ('run' for single agent console mode, 'serve' for HTTP server)
runner = Runner(
    launcher=launcher,
    serve_options=ServeOptions(
        cors_allow_origins=["*"],
    ),
)


if __name__ == "__main__":
    runner.cli()
