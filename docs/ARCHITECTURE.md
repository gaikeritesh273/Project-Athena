# ARCHITECTURE.md — ATHENA System Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                               │
│              Next.js 14 (TypeScript, Tailwind CSS)               │
│                                                                    │
│  ┌─────────────┐  ┌──────────────────────────────────────────┐   │
│  │ Landing Page │  │     Investigation Workspace (/investigate) │   │
│  │     (/)      │  │                                          │   │
│  └──────┬───────┘  │  ┌──────────┐ ┌─────────────┐          │   │
│         │           │  │  Trust   │ │ Perspective  │          │   │
│         │           │  │ Passport │ │  Explorer   │          │   │
│         │           │  └──────────┘ └─────────────┘          │   │
│         │           │  ┌──────────┐ ┌─────────────┐          │   │
│         │           │  │Narrative │ │  AI Tutor   │          │   │
│         │           │  │  Memory  │ │  & Quiz     │          │   │
│         │           │  └──────────┘ └─────────────┘          │   │
│         │           │  ┌────────────────────────────┐        │   │
│         │           │  │  Media Literacy Profile     │        │   │
│         │           │  └────────────────────────────┘        │   │
│         │           └──────────────────────────────────────────┘   │
└─────────┼──────────────────────────────────────────────────────────┘
          │ REST API calls
          ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FASTAPI 2.0 BACKEND                            │
│                    Python 3.13 / uvicorn                          │
│                                                                    │
│  ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │/investigate│ │ /claims  │ │  /bias   │ │     /source       │  │
│  │  /full     │ │/analyze  │ │ /detect  │ │     /score        │  │
│  │  /demo     │ │  /demo   │ │/flags-ref│ │     /dataset      │  │
│  └────┬───────┘ └──────────┘ └──────────┘ └───────────────────┘  │
│       │                                                            │
│  ┌────▼────────────────────────────────────────────────────────┐  │
│  │              AI SERVICE ABSTRACTION LAYER                    │  │
│  │                                                              │  │
│  │  get_ai_provider()                                          │  │
│  │       │                                                     │  │
│  │  ┌────┴──────────────┐   ┌──────────────────────────────┐  │  │
│  │  │  LiveAIProvider    │   │  DeterministicDemoProvider   │  │  │
│  │  │ (Gemini/OpenAI API)│   │  (Curated Pitch Demo Data)   │  │  │
│  │  │  if API key set    │   │  Always available, stable    │  │  │
│  │  └───────────────────┘   └──────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              SUPPORTING SERVICES                            │   │
│  │  newsapi_client.py │ gnews_api.py │ rss_fetcher.py         │   │
│  │  reddit_api.py │ bias_detector.py │ source_credibility.py  │   │
│  │  forensics.py │ quiz_service.py                            │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────┬───────────────────────────┘
                                        │
            ┌──────────────────────────┴────────────────────────┐
            │                                                     │
┌───────────▼──────────┐                          ┌──────────────▼──────────┐
│   SUPABASE POSTGRES   │                          │  UPSTASH REDIS (REST)   │
│                        │                          │                          │
│  Tables:               │                          │  Cache:                  │
│  • profiles            │                          │  • claim analysis cache  │
│  • quiz_results        │                          │  • API response cache    │
│                        │                          │  Rate limits:            │
│  Views:                │                          │  • /claims 10/min        │
│  • leaderboard         │                          │  • /bias   15/min        │
│                        │                          │  • /forensics 5/min      │
└────────────────────────┘                          └──────────────────────────┘
```

---

## Component Responsibilities

### Frontend Components

| Component | File | Responsibility |
|---|---|---|
| Landing Page | `app/page.tsx` | Hero, Four Pillars, Demo CTA |
| Investigation Workspace | `app/investigate/page.tsx` | Unified investigation hub |
| Trust Passport Card | `components/TrustPassportCard.tsx` | Multi-section evidence report |
| Perspective Explorer | `components/PerspectiveExplorer.tsx` | Multi-source comparison matrix |
| Narrative Memory Timeline | `components/NarrativeMemoryTimeline.tsx` | Interactive claim evolution |
| AI Tutor Quiz | `components/AITutorQuiz.tsx` | Educational challenge engine |
| Media Literacy Profile | `components/MediaLiteracyProfile.tsx` | Skill tracking visualization |
| Navbar | `components/Navbar.tsx` | Navigation + Language switcher |
| i18n Context | `lib/i18n.tsx` | EN/Hindi internationalization |

### Backend Services

| Service | File | Responsibility |
|---|---|---|
| AI Service | `services/ai_service.py` | AI Provider abstraction + Demo engine |
| Claim Checker | `services/claim_checker.py` | Multi-source cross-reference |
| Bias Detector | `services/bias_detector.py` | Emotional framing detection |
| Source Credibility | `services/source_credibility.py` | Domain credibility scoring |
| News API Client | `services/newsapi_client.py` | NewsAPI integration |
| GNews Client | `services/gnews_api.py` | GNews integration |
| RSS Fetcher | `services/rss_fetcher.py` | BBC/Reuters/AP/NPR RSS |
| Reddit API | `services/reddit_api.py` | Reddit signal aggregation |
| Quiz Service | `services/quiz_service.py` | MIL challenge engine |
| Forensics | `services/forensics.py` | Image forensic analysis |

---

## Data Flow: Demo Investigation

```
1. User clicks "Try Demo Investigation"
   │
2. Frontend sends POST /investigate/full { is_demo: true }
   │
3. Backend: run_investigation(is_demo_mode=True)
   │
4. DeterministicDemoProvider.analyze_content()
   │
5. Returns DEMO_INVESTIGATION_PAYLOAD (cached, deterministic)
   │
6. Frontend renders:
   ├── Trust Passport Card
   ├── Perspective Explorer
   ├── Narrative Memory Timeline
   ├── AI Tutor + Quiz
   └── Media Literacy Profile
```

## Data Flow: Live Investigation

```
1. User pastes content → clicks "Investigate Content"
   │
2. Frontend sends POST /investigate/full { text: "...", is_demo: false }
   │
3. Backend: run_investigation(text="...", is_demo_mode=False)
   │
4. get_ai_provider() checks GEMINI_API_KEY/OPENAI_API_KEY
   │
   ├── If key set → LiveAIProvider (calls external API)
   └── If no key → DeterministicDemoProvider (fallback)
   │
5. Result structured into unified investigation payload
   │
6. Cached in Upstash Redis (2h TTL)
   │
7. Frontend renders full investigation workspace
```
