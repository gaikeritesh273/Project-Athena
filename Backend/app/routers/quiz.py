from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.quiz_service import get_questions, check_answer
from app.models.schemas import QuizQuestion, QuizSubmission, QuizResult
from app.utils.supabase_client import get_supabase_admin

router = APIRouter(prefix="/quiz", tags=["quiz"])

class QuizRequest(BaseModel):
    category: str = None
    difficulty: str = None
    limit: int = 5

class AnswerRequest(BaseModel):
    answers: List[QuizSubmission]
    user_id: str = None  # Optional: for tracking

@router.post("/questions")
async def get_quiz_questions(req: QuizRequest):
    """Get quiz questions filtered by category and difficulty."""
    questions = get_questions(req.category, req.difficulty, req.limit)
    return {"questions": questions, "total_available": 8}

@router.post("/submit")
async def submit_quiz(req: AnswerRequest):
    """Submit quiz answers and get results with badge awards."""
    correct = 0
    correct_answers = []
    explanations = []

    for answer in req.answers:
        result = check_answer(answer.question_id, answer.selected_index)
        if result["correct"]:
            correct += 1
            correct_answers.append(answer.question_id)
        explanations.append(result["explanation"])

    total = len(req.answers)
    score = int((correct / total) * 100) if total > 0 else 0

    # Determine badge
    badge = None
    if score == 100:
        badge = "Master Investigator"
    elif score >= 80:
        badge = "Sharp Reader"
    elif score >= 60:
        badge = "Critical Thinker"
    elif score >= 40:
        badge = "Curious Mind"

    # Save to Supabase if user_id provided
    if req.user_id:
        try:
            admin = get_supabase_admin()
            admin.table("quiz_results").insert({
                "user_id": req.user_id,
                "score": score,
                "total": total,
                "badge_earned": badge,
                "answers": [{"qid": a.question_id, "selected": a.selected_index, "time": a.time_taken_seconds} for a in req.answers]
            }).execute()
        except Exception as e:
            print(f"Quiz save warning: {e}")

    return QuizResult(
        score=score,
        total=total,
        correct_answers=correct_answers,
        explanations=explanations,
        badge_earned=badge
    )

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 20):
    """Get leaderboard from Supabase view."""
    try:
        admin = get_supabase_admin()
        result = admin.table("leaderboard").select("*").limit(limit).execute()
        return {
            "leaderboard": result.data or [],
            "note": "Ranked by literacy score, then best quiz score"
        }
    except Exception as e:
        # Return demo leaderboard if DB not available
        return {
            "leaderboard": [
                {"full_name": "Demo User 1", "literacy_score": 850, "claims_checked": 42, "quizzes_taken": 15, "best_quiz_score": 100},
                {"full_name": "Demo User 2", "literacy_score": 720, "claims_checked": 35, "quizzes_taken": 12, "best_quiz_score": 80},
                {"full_name": "Demo User 3", "literacy_score": 640, "claims_checked": 28, "quizzes_taken": 10, "best_quiz_score": 60},
            ],
            "note": "Demo leaderboard — connect Supabase for live data",
            "error": str(e)
        }

@router.get("/categories")
async def get_categories():
    """Get all quiz categories and difficulties."""
    return {
        "categories": [
            "Headline Analysis",
            "Image Verification",
            "Source Verification",
            "Bias Detection",
            "Deepfake & Forensics"
        ],
        "difficulties": ["easy", "medium", "hard"]
    }
