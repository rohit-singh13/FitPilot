import os
import re
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

load_dotenv()

app = FastAPI(title="FitPilot AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000", "https://fit-pilot-three.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    api_key=os.getenv("GOOGLE_API_KEY"),
)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FitPilot AI service is running"}


class SetInput(BaseModel):
    exerciseName: str
    reps: int
    weightKg: float


class WorkoutInput(BaseModel):
    name: str
    workoutDate: str
    sets: list[SetInput]


class CoachingRequest(BaseModel):
    userName: str
    fitnessGoal: str
    recentWorkouts: list[WorkoutInput]

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]


SYSTEM_PROMPT = """You are FitPilot's AI assistant — a knowledgeable, friendly fitness and nutrition coach.
You help users with questions about exercises, workout form, nutrition, supplements, recovery, and general fitness advice.
Keep answers concise, practical, and encouraging. If a question is completely unrelated to fitness, nutrition, or health,
politely redirect the user back to fitness-related topics."""


@app.post("/chat")
def chat(payload: ChatRequest):
    if not payload.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in payload.messages:
        api_messages.append({"role": m.role, "content": m.content})

    try:
        completion = client.chat.completions.create(
            model="gemma-4-31b-it",
            messages=api_messages,
            max_tokens=1000,
        )
        raw_reply = completion.choices[0].message.content
        cleaned_reply = re.sub(r'<thought>.*?</thought>', '', raw_reply, flags=re.DOTALL).strip()
        return {"reply": cleaned_reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/coach/analyze")
def analyze_workouts(payload: CoachingRequest):
    if not payload.recentWorkouts:
        raise HTTPException(status_code=400, detail="No workout data provided")

    workout_summary = ""
    for w in payload.recentWorkouts:
        workout_summary += f"\n{w.name} ({w.workoutDate}):\n"
        for s in w.sets:
            workout_summary += f"  - {s.exerciseName}: {s.reps} reps @ {s.weightKg}kg\n"

    prompt = f"""You are a knowledgeable, encouraging fitness coach. A user named {payload.userName} has the goal: {payload.fitnessGoal}.

Here is their recent workout history:
{workout_summary}

Give them 3 short, specific, actionable coaching tips based on this data (e.g. progressive overload suggestions, muscle groups being neglected, recovery advice). Keep it concise and friendly. Format as a simple numbered list."""

    try:
        completion = client.chat.completions.create(
            model="gemma-4-31b-it",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
        )
        raw_advice = completion.choices[0].message.content
        cleaned_advice = re.sub(r'<thought>.*?</thought>', '', raw_advice, flags=re.DOTALL).strip()
        return {"advice": cleaned_advice}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
