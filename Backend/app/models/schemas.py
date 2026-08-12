from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ConfidenceLevel(str, Enum):
    STRONGLY_CORROBORATED = "Strongly corroborated by multiple independent sources"
    PARTIALLY_CORROBORATED = "Partially corroborated"
    INSUFFICIENT_EVIDENCE = "Insufficient verified evidence"
    CONTRADICTED = "Contradicted by credible sources"
    CANNOT_ANALYZE = "Cannot analyze"

class ClaimInput(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None

class ClaimResult(BaseModel):
    claim_text: str
    status: str  # corroborated / contradicted / unverified
    sources: List[Dict[str, Any]]
    confidence: str
    reasoning: str

class ClaimCheckerResponse(BaseModel):
    claims: List[ClaimResult]
    cached: bool = False
    sources_queried: int = 0

class BiasFlag(BaseModel):
    text: str
    flag_type: str
    explanation: str
    severity: str  # low / medium / high

class BiasDetectorResponse(BaseModel):
    flags: List[BiasFlag]
    overall_bias_score: float = Field(..., ge=0, le=100)
    summary: str
    emotional_language_score: float = Field(..., ge=0, le=100)
    missing_context_markers: List[str]

class SourceCredibilityInput(BaseModel):
    url: str

class SourceCredibilityScore(BaseModel):
    category: str
    score: int = Field(..., ge=0, le=100)
    explanation: str

class SourceCredibilityResponse(BaseModel):
    domain: str
    overall_score: int = Field(..., ge=0, le=100)
    breakdown: List[SourceCredibilityScore]
    bias_rating: Optional[str] = None
    factuality_rating: Optional[str] = None
    https: bool
    has_author_byline: Optional[bool] = None
    has_corrections_policy: Optional[bool] = None

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_index: int
    explanation: str
    category: str
    difficulty: str

class QuizSubmission(BaseModel):
    question_id: str
    selected_index: int
    time_taken_seconds: int

class QuizResult(BaseModel):
    score: int
    total: int
    correct_answers: List[str]
    explanations: List[str]
    badge_earned: Optional[str] = None

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    literacy_score: int = 0
    badges: List[str] = []
    investigations_count: int = 0
    created_at: Optional[datetime] = None

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str
    date_of_birth: str
