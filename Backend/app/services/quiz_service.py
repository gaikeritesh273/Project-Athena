import json
from typing import List, Dict, Any
from app.models.schemas import QuizQuestion

QUIZ_QUESTIONS = [
    {
        "id": "q1",
        "question": "A headline reads: 'SHOCKING: Doctors HIDE This One Secret About Vaccines!' What is the most likely bias indicator here?",
        "options": [
            "It cites peer-reviewed research",
            "It uses emotional trigger words and implies a conspiracy",
            "It presents balanced viewpoints",
            "It includes specific medical data"
        ],
        "correct_index": 1,
        "explanation": """Words like 'SHOCKING' and 'HIDE' are fear/urgency triggers. The phrase 'one secret' implies a conspiracy without evidence. This is classic clickbait manipulation.""",
        "category": "Headline Analysis",
        "difficulty": "easy"
    },
    {
        "id": "q2",
        "question": "You see an image of a politician at a rally with a crowd. The caption says 'Record-breaking attendance!' but the image is a tight crop. What should you check first?",
        "options": [
            "The politician's speech transcript",
            "The full, uncropped image to see actual crowd size",
            "The photographer's political affiliation",
            "The weather on that day"
        ],
        "correct_index": 1,
        "explanation": """Cropped images can create false impressions. Always look for the original, uncropped version and other angles before trusting a narrative about crowd size.""",
        "category": "Image Verification",
        "difficulty": "easy"
    },
    {
        "id": "q3",
        "question": "An article states: 'Studies show that X causes Y.' But no specific study is named. What type of bias flag is this?",
        "options": [
            "Emotional trigger",
            "Missing context / vague authority",
            "One-sided framing",
            "No bias — this is standard reporting"
        ],
        "correct_index": 1,
        "explanation": """Citing unnamed 'studies' without specific attribution is a Missing Context flag. Credible reporting names the study, institution, and date.""",
        "category": "Source Verification",
        "difficulty": "medium"
    },
    {
        "id": "q4",
        "question": "A news site has HTTPS, named authors, a corrections policy, and is rated 'Center' by media bias monitors. What is its likely credibility score range?",
        "options": [
            "0–30 (Very Low)",
            "30–60 (Mixed)",
            "60–85 (Good)",
            "85–100 (High)"
        ],
        "correct_index": 3,
        "explanation": """HTTPS, author transparency, corrections policy, and center bias rating are all strong credibility indicators. Such sources typically score 85+.""",
        "category": "Source Credibility",
        "difficulty": "easy"
    },
    {
        "id": "q5",
        "question": "You find the same breaking news story on Twitter/X and on Reuters. Both published within minutes. Which source should you trust more initially?",
        "options": [
            "Twitter/X — it broke first",
            "Reuters — established news agency with editorial standards",
            "Both equally — news is news",
            "Neither — wait 24 hours"
        ],
        "correct_index": 1,
        "explanation": """Established news agencies like Reuters have editorial standards, fact-checking processes, and accountability. Social media lacks these safeguards, especially in the first minutes of breaking news.""",
        "category": "Source Verification",
        "difficulty": "easy"
    },
    {
        "id": "q6",
        "question": "A video claims to show a recent event, but the shadows in the footage suggest a different time of day than claimed. What technique are you using?",
        "options": [
            "Reverse image search",
            "Geolocation verification",
            "Chronolocation (shadow/time analysis)",
            "Metadata extraction"
        ],
        "correct_index": 2,
        "explanation": """Analyzing shadows and lighting to verify time/date is called chronolocation. It's a key open-source intelligence (OSINT) technique for verifying visual media.""",
        "category": "Deepfake & Forensics",
        "difficulty": "hard"
    },
    {
        "id": "q7",
        "question": "An article uses the phrase 'Everyone knows that...' before making a claim. What bias flag does this trigger?",
        "options": [
            "Emotional trigger",
            "One-sided framing",
            "Missing context",
            "No bias"
        ],
        "correct_index": 1,
        "explanation": """'Everyone knows' is a one-sided framing technique that presents a viewpoint as settled fact, shutting down critical thinking and alternative perspectives.""",
        "category": "Bias Detection",
        "difficulty": "medium"
    },
    {
        "id": "q8",
        "question": "You see a photo of a protest with a dramatic filter applied (high contrast, desaturated). What should you consider?",
        "options": [
            "The filter makes it more trustworthy",
            "The filter is just artistic choice, ignore it",
            "The filter may manipulate emotional response — look for the unedited version",
            "The filter proves the photo is AI-generated"
        ],
        "correct_index": 2,
        "explanation": """Dramatic filters can heighten emotional impact and bias perception. Always seek the unedited original and compare with other sources from the same event.""",
        "category": "Image Verification",
        "difficulty": "medium"
    }
]


def get_questions(category: str = None, difficulty: str = None, limit: int = 5) -> List[Dict[str, Any]]:
    """Get filtered quiz questions."""
    questions = QUIZ_QUESTIONS
    if category:
        questions = [q for q in questions if q["category"] == category]
    if difficulty:
        questions = [q for q in questions if q["difficulty"] == difficulty]
    return questions[:limit]


def check_answer(question_id: str, selected_index: int) -> Dict[str, Any]:
    """Check if answer is correct."""
    question = next((q for q in QUIZ_QUESTIONS if q["id"] == question_id), None)
    if not question:
        return {"correct": False, "explanation": "Question not found."}

    correct = selected_index == question["correct_index"]
    return {
        "correct": correct,
        "explanation": question["explanation"],
        "correct_index": question["correct_index"]
    }
