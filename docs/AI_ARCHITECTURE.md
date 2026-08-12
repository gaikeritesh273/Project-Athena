# AI_ARCHITECTURE.md — ATHENA AI Architecture & Abstraction Layer

## Overview

ATHENA implements a **modular, provider-agnostic AI Architecture**. The system does not hardcode UI logic to a single AI vendor or model. Instead, it defines a clean service abstraction layer with fallbacks, rate-limiting, and deterministic pitch engines.

---

## 1. Core Service Abstraction

```
┌─────────────────────────────────────────────────────────────┐
│                 ATHENA AI SERVICE LAYER                     │
│               (app/services/ai_service.py)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                      get_ai_provider()
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │   LiveAIProvider     │        │ DeterministicDemo    │
    │                      │        │     Provider         │
    │  - Gemini 2.0 Flash  │        │                      │
    │  - OpenAI GPT-4o     │        │  - Pitch Payload     │
    │  - (Requires Key)    │        │  - 0ms Latency       │
    └──────────┬───────────┘        │  - 100% Reliable     │
               │                    └──────────────────────┘
               │ (if failure)                  ▲
               └───────────────────────────────┘
                     Graceful Fallback
```

---

## 2. AI Sub-Services

The AI Service is decomposed into six dedicated analytical engines:

### A. Claim Extractor (`ClaimExtractor`)
- Extracts factual assertions from raw text or URLs.
- Filters out subjective opinions, rhetorical questions, and emotional commentary.
- Formats primary claim and secondary sub-claims.

### B. Evidence & Context Analyzer (`EvidenceAnalyzer`)
- Cross-references extracted claims against multi-source evidence (NewsAPI, RSS feeds, GNews, Reddit).
- Categorizes evidence into:
  - Supporting
  - Conflicting
  - Unverified
- Identifies **missing context** (unnamed sources, missing peer review, buzzwords).
- Analyzes **language and emotional framing** (loaded words, sensationalism index).
- Detects **AI generation indicators** (synthetic syntax, repetitive patterns).

### C. Perspective Analyzer (`PerspectiveAnalyzer`)
- Categorizes perspectives across 4 core groups:
  1. Scientific & Academic
  2. Fact-Checking Community
  3. International Organizations & Official Media
  4. Social Media & Community Viewpoints
- Synthesizes **Common Ground**, **Key Differences**, and **Remaining Uncertainties**.

### D. Narrative Memory Analyzer (`NarrativeAnalyzer`)
- Constructs chronological evolution timelines.
- Maps original paper/concept → headline manipulation → viral amplification → fact-check correction.

### E. Tutor & Quiz Generator (`TutorGenerator`)
- Generates educational explanations of *why* content may be misleading.
- Formats 1–3 interactive multiple-choice verification challenges with detailed explanations.

### F. Epistemological Assessment Engine
- Evaluates evidence density and produces guarded, non-binary assessments:
  - `"Evidence currently supports this claim."`
  - `"Evidence is currently insufficient to support this claim."`
  - `"Conflicting evidence exists from credible sources."`
  - `"Context is missing."`

---

## 3. Fallback & Reliability Design

To ensure ATHENA never crashes during live pitches or judge evaluations:

1. **Provider Precedence**: If `GEMINI_API_KEY` or `OPENAI_API_KEY` exists, `LiveAIProvider` is invoked.
2. **Exception Handling**: If external API calls time out, throw 429 rate-limit errors, or return malformed JSON, `LiveAIProvider` silently catches the exception and delegates to `DeterministicDemoProvider`.
3. **Client-Side Safety Net**: If the backend API server is offline, the Next.js frontend contains an embedded fallback engine so the UNESCO demo flow remains fully functional.

---

## 4. Prompt Engineering Principles

When calling live AI models, ATHENA enforces strict system prompts:

- **Neutral Epistemology**: Instructs the model never to use binary true/false verdicts.
- **Evidence-First**: Prompts require citing specific missing context before generating confidence scores.
- **JSON Schema Enforcer**: All LLM outputs are forced through strict Pydantic JSON schemas.
