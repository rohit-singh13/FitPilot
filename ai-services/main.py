import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

load_dotenv()

app = FastAPI(title="FitPilot AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
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
            model="poolside/laguna-xs-2.1:free",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
        )
        return {"advice": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))