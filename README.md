# ATHENA — AI-Powered Media Literacy Platform

> **UNESCO Youth Hackathon 2026 Entry**  
> "Play Your Part: Youth Designing the Future of Media and Information Literacy."

**Tagline:** _"Don't just know what to believe. Learn how to evaluate."_

---

## Problem

The internet is flooded with viral misinformation, emotionally manipulative headlines, and out-of-context claims. Most people — especially young people — share content before verifying it, not because they are careless, but because they lack the practical skills to evaluate information critically.

Existing tools either:

- Give binary "TRUE / FALSE" verdicts (black-box fact-checking)
- Rely entirely on opaque AI models
- Treat users as passive consumers rather than active critical thinkers

---

## Solution: ATHENA

ATHENA is an **AI-assisted Media & Information Literacy platform** that helps users:

1. **Investigate** suspicious digital content through a multi-dimensional Trust Passport
2. **Compare** multiple perspectives across scientific, fact-checking, media and community sources
3. **Trace** how narratives mutate and amplify across time in Narrative Memory
4. **Learn** through an AI Media Literacy Tutor and interactive verification challenges
5. **Track** personal growth through a Media Literacy Profile

ATHENA never says "this is definitely true" or "this is definitely fake." Instead, it uses transparent, epistemologically grounded language:

- _"Evidence is currently insufficient to support this claim."_
- _"Conflicting credible evidence exists — requires verification."_
- _"Context is missing — the original source has not been established."_

---

## ATHENA Philosophy

- **Teach, don't tell.** ATHENA builds critical thinking skills, not dependency on automated verdicts.
- **Transparency over authority.** Every analysis step is explained. No black boxes.
- **Uncertainty is honest.** ATHENA explicitly communicates confidence levels and what remains unknown.
- **Ethical AI.** No fabricated citations, no invented statistics, no fake fact-check results.
- **Demo-ready.** Built with a reliable, deterministic pitch demo for the UNESCO presentation.

---

## Architecture

```
User Browser (Next.js 14)
        │
        ├── Landing Page (/)
        ├── Investigation Workspace (/investigate)
        │     ├── Trust Passport Tab
        │     ├── Perspective Explorer Tab
        │     ├── Narrative Memory Tab
        │     ├── AI Tutor & Quiz Tab
        │     └── Media Literacy Profile Tab
        │
FastAPI 2.0 Backend (Python)
        │
        ├── /investigate/full   → Full end-to-end investigation
        ├── /investigate/demo   → Deterministic pitch demo payload
        ├── /claims/analyze     → Claim cross-reference engine
        ├── /bias/detect        → Emotional framing detector
        ├── /source/score       → Source credibility scorer
        ├── /quiz/questions     → Media literacy challenges
        └── /forensics/analyze  → Image forensics
        │
AI Layer (Hybrid)
        ├── Live: Gemini / OpenAI API (if GEMINI_API_KEY set)
        └── Fallback: Deterministic Demo Engine (always available)
        │
Supabase Postgres (Auth + Profiles + Quiz Results)
Upstash Redis (Caching, Rate Limiting)
```

---

## Key Features

| Feature                     | Description                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trust Passport**          | Multi-section report: Claim, Source, Evidence Matrix, Context, Language/Emotional Framing, AI Indicators, Assessment, Uncertainty, Suggested Actions |
| **Perspective Explorer**    | Interactive comparison of Scientific, Fact-Check, International Media, and Community perspectives on the same claim                                  |
| **Narrative Memory**        | Visual clickable timeline tracing how a claim evolves from original publication to viral amplification to fact-check correction                      |
| **AI Media Literacy Tutor** | Educational explanation of WHY content may be misleading, followed by a 1-3 question interactive challenge                                           |
| **Media Literacy Profile**  | Skill bar tracking across 5 MIL dimensions (Source Evaluation, Context Checking, Evidence Evaluation, Emotional Framing Awareness, Media Forensics)  |
| **Demo Mode**               | One-click 60-90 second pitch demo with deterministic results, independent of external APIs                                                           |
| **Multilingual Foundation** | English + Hindi architecture, extensible to more UNESCO-priority languages                                                                           |

---

## AI Architecture

ATHENA uses a **Hybrid AI Service Abstraction Layer**:

```python
# Provider Factory Pattern
def get_ai_provider() -> BaseAIProvider:
    if GEMINI_API_KEY:
        return LiveAIProvider(GEMINI_API_KEY)
    return DeterministicDemoProvider()
```

- **LiveAIProvider**: Connects to external AI APIs when keys are configured
- **DeterministicDemoProvider**: Returns curated, stable demo payloads for the UNESCO pitch
- **Graceful Fallback**: System never crashes if API is unavailable; always serves the pitch demo

---

## Tech Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Frontend   | Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons |
| Backend    | FastAPI 2.0, Python 3.13, Pydantic v2                             |
| Database   | Supabase (PostgreSQL + Auth)                                      |
| Cache      | Upstash Redis (REST API)                                          |
| Fonts      | Plus Jakarta Sans, Playfair Display, JetBrains Mono               |
| APIs       | NewsAPI, GNews, BBC/Reuters/AP/NPR RSS, Reddit API                |
| AI         | Gemini / OpenAI (with deterministic fallback)                     |
| Deployment | Vercel (Frontend) + Render (Backend)                              |

---

## Demo Instructions (UNESCO Pitch)

**60-90 Second Demo Flow:**

1. Open `http://localhost:3000` (Landing Page)
2. Click **"Try Demo Investigation"**
3. Watch 5-step analysis progression animation
4. **Trust Passport** tab: Explore Claim, Evidence Matrix, Language Framing, Assessment
5. Click **"Perspective Explorer"** tab: Compare 4 source perspectives
6. Click **"Narrative Memory"** tab: Explore 4-step claim evolution timeline
7. Click **"AI Tutor & Quiz"** tab: Read explanation, complete 2-question challenge
8. Click **"Media Literacy Profile"** tab: View updated skills and badges
9. Return to Landing Page — ATHENA pitch complete

> All steps work **100% offline** with no external API dependencies in demo mode.

---

## Environment Variables

### Backend (`Backend/.env`)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
UPSTASH_REDIS_REST_URL=https://your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
NEWSAPI_KEY=your-newsapi-key (optional)
GNEWS_KEY=your-gnews-key (optional)
GEMINI_API_KEY=your-gemini-key (optional, enables live AI)
JWT_SECRET=change-me-in-production
CORS_ORIGINS=http://localhost:3000
```

### Frontend (`Frontend/.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## Local Setup

### Backend

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\activate    # Windows
pip install -r requirements.txt
# Copy .env.example → .env and fill values
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Test backend: `curl http://127.0.0.1:8000/health`

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:3000`

---

## Limitations

- Live AI analysis requires valid GEMINI_API_KEY or OPENAI_API_KEY environment variables
- NewsAPI/GNews rate limits apply (100 requests/day on free tier)
- Narrative Memory uses demonstration data for the prototype; real-time historical data requires news archival API integration
- Multilingual: English fully implemented, Hindi translation strings complete, RTL languages need additional CSS

---

## Ethical Considerations

- ATHENA **never fabricates** citations, statistics, or URLs
- All demonstration data is **clearly labeled** as "Demonstration Data" or "Prototype Simulation"
- ATHENA explicitly communicates **uncertainty** and **confidence levels**
- No user data is sold or used for advertising
- The platform teaches **critical thinking** — not blind trust in AI outputs

---

## Future Roadmap

- Real-time Narrative Memory via news archival APIs (GDELT, Internet Archive)
- Live AI analysis via Gemini 2.0 Flash
- Browser extension for in-context investigation
- Classroom module for UNESCO-aligned MIL curricula
- Community fact-check validation layer
- 10+ UNESCO-priority language support

---

_Built for UNESCO Youth Hackathon 2026 — "Play Your Part: Youth Designing the Future of Media and Information Literacy."_

Making the update for the repo combination
