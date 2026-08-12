# ATHENA Backend

FastAPI backend for the ATHENA Media Literacy Platform.

## Quick Start

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env from .env.example
cp .env.example .env
# Edit .env with your keys

# Run dev server
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### Health
- `GET /` — API info
- `GET /health` — Health check

### Auth
- `POST /auth/signup` — Email signup with profile (full_name, phone, DOB)
- `POST /auth/login` — Login with JWT
- `POST /auth/refresh` — Refresh token
- `POST /auth/logout` — Logout
- `GET /auth/me?user_id=xxx` — Get profile

### Claims
- `POST /claims/analyze` — Analyze claims (text/URL)
- `GET /claims/demo` — Demo claims for testing
- `GET /claims/sources` — List data sources
- `POST /claims/clear-cache` — Clear claim cache

### Bias
- `POST /bias/detect` — Detect bias in text
- `GET /bias/flags-reference` — Bias flag reference

### Source
- `POST /source/score` — Score source credibility
- `GET /source/dataset` — View credibility dataset
- `GET /source/categories` — Bias categories reference

### Quiz
- `POST /quiz/questions` — Get quiz questions
- `POST /quiz/submit` — Submit answers
- `GET /quiz/leaderboard` — Leaderboard
- `GET /quiz/categories` — Quiz categories

### Forensics
- `POST /forensics/analyze` — Analyze image (multipart/form-data)
- `GET /forensics/health` — Forensics service health

## Data Sources

| Source | Type | Free Tier | Auth |
|--------|------|-----------|------|
| NewsAPI.org | News API | 100 req/day | API Key |
| GNews | News API | 100 req/day | API Key |
| BBC News RSS | RSS | Unlimited | None |
| Reuters RSS | RSS | Unlimited | None |
| AP News RSS | RSS | Unlimited | None |
| NPR RSS | RSS | Unlimited | None |
| Reddit API | Social | Read-only | None |

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/claims/analyze` | 10 | 60s |
| `/bias/detect` | 15 | 60s |
| `/forensics/analyze` | 5 | 60s |
| All others | 100 | 60s |

## Environment Variables

See `.env.example` for all required variables.
