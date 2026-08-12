# ETHICS.md — ATHENA Ethical AI Design Document

## Ethical Framework for PROJECT ATHENA
### UNESCO Youth Hackathon 2026

---

## Core Ethical Commitments

ATHENA is designed around explicit ethical principles that align with UNESCO's Media and Information Literacy (MIL) framework and international guidelines for responsible AI in education.

---

## 1. Epistemological Honesty

**Principle:** ATHENA never presents AI-generated analysis as absolute truth.

**Implementation:**
- All assessments use probabilistic language: *"Evidence currently suggests..."*, *"Context may be missing..."*, *"Insufficient evidence to confirm..."*
- Confidence levels are always displayed alongside assessments
- Uncertainty is explicitly communicated — not hidden from users
- ATHENA distinguishes between "confidence in the analysis" and "factual certainty about the claim"

**What ATHENA never says:**
- ❌ "This is definitely true."
- ❌ "This is definitely fake."
- ❌ "Our AI has verified this claim."

**What ATHENA says instead:**
- ✅ "Evidence is currently insufficient to support this claim."
- ✅ "Conflicting credible evidence exists — requires independent verification."
- ✅ "Context is missing — the original source has not been established."

---

## 2. No Fabricated Evidence

**Principle:** ATHENA never invents citations, URLs, statistics, or fact-check results.

**Implementation:**
- All URLs shown in the demo are labeled as **Demonstration Data** where applicable
- The platform does not invent academic paper titles, author names, or publication dates
- Source credibility scores are based on public datasets and domain heuristics, not fabricated ratings
- Image forensics uses real algorithmic analysis (Error Level Analysis, metadata inspection) — not invented results

---

## 3. Demonstration Data Transparency

**Principle:** All simulated or curated demo content must be clearly labeled.

**Implementation:**
- Demo payloads carry an `is_demo: true` flag throughout the system
- UI displays explicit labels: **"⚠ Demonstration Data"** or **"Prototype Simulation"**
- The demo scenario involves a fictional viral claim — never real-world events
- No demonstration content fabricates statements from real people, organizations, or governments

---

## 4. Pedagogical Ethics

**Principle:** ATHENA teaches critical thinking, not dependence on AI.

**Implementation:**
- The AI Tutor explains *why* something is misleading — not just what the verdict is
- Quiz challenges require users to reason, not simply recall ATHENA's output
- The Media Literacy Profile tracks personal growth in 5 human-reasoning skills
- ATHENA explicitly tells users to verify with independent sources

---

## 5. Bias Awareness

**Principle:** ATHENA's AI systems may have inherent biases and must communicate them.

**Implementation:**
- Source credibility datasets (AllSides, MBFC) have known political limitations — ATHENA discloses this
- Perspective Explorer deliberately includes diverse viewpoints to avoid ideological echo chambers
- Bias detection focuses on *structural framing patterns*, not political content
- No claim is pre-labeled as "true" or "false" based on political alignment

---

## 6. Privacy & Data Minimization

**Principle:** ATHENA collects only what is necessary for educational features.

**Implementation:**
- User investigation content is not stored permanently by default
- Media Literacy Profile scores are aggregated skill metrics — not behavioral surveillance data
- Authentication uses Supabase industry-standard OAuth — no passwords stored in plaintext
- No user content is sold, shared, or used for advertising model training

---

## 7. Accessibility & Inclusion

**Principle:** ATHENA must be usable by all young people, regardless of ability.

**Implementation:**
- Semantic HTML5 throughout the interface
- WCAG 2.1 AA color contrast targets for the Deep Navy theme
- Keyboard navigation support on all interactive elements
- Screen-reader friendly ARIA labels
- Responsive design for mobile, tablet, and desktop
- Multilingual architecture: English + Hindi, extensible to UNESCO-priority languages

---

## 8. Age-Appropriate Design

**Principle:** ATHENA is designed for youth (ages 15–30 per UNESCO hackathon brief).

**Implementation:**
- Clear, accessible language in all UI text
- Educational scaffolding before analysis (the tutor explains before testing)
- No alarming or traumatic content in demonstration scenarios
- No dark patterns, addictive mechanics, or social pressure elements

---

## Alignment with UNESCO MIL Principles

| UNESCO MIL Principle | ATHENA Implementation |
|---|---|
| Access to information | Open investigation workspace, no paywalls |
| Evaluation of information | Trust Passport, Perspective Explorer |
| Creation & communication | Narrative Memory shows how content spreads |
| Reflection on media | AI Tutor teaches metacognitive skills |
| Participation & action | Literacy Profile tracks civic-skills growth |
| Cultural & social contexts | Multilingual support, diverse perspectives |

---

## Limitations & Honest Disclosure

- ATHENA's live AI analysis is limited by the quality and recency of news API data
- Narrative Memory in v1.0 uses demonstration data — not live historical internet archives
- Source credibility ratings are probabilistic estimates, not absolute judgments
- AI generation detection is based on syntactic heuristics — not forensically validated
- The platform currently supports English and Hindi — other languages are architecturally planned

---

*ATHENA is a prototype educational tool, not a certified fact-checking service or law enforcement resource.*
