# DEMO.md — ATHENA Pitch Demo Guide

## UNESCO Youth Hackathon 2026 — Pitch-Ready 60–90 Second Demo

This guide describes the **exact steps** to demonstrate ATHENA's primary user journey for the UNESCO Hackathon recording.

---

## Pre-Demo Checklist

- [ ] Backend running: `uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`
- [ ] Frontend running: `npm run dev` in `Frontend/`
- [ ] Browser at `http://localhost:3000`
- [ ] Browser window maximized (1920×1080 preferred for recording)
- [ ] Screen recorder active
- [ ] All other applications minimized

---

## Demo Script (60–90 Seconds)

### 1. LANDING PAGE (~10 sec)
**URL:** `http://localhost:3000`

*Narrate:* "ATHENA is an AI-powered Media Literacy Platform that helps young people evaluate digital content rather than blindly believing or sharing it."

- Show the hero headline: **"ATHENA — AI-Powered Media Literacy Platform"**
- Show the tagline: *"Don't just know what to believe. Learn how to evaluate."*
- Show the four pillars: Investigate, Compare, Trace, Learn

---

### 2. CLICK "TRY DEMO INVESTIGATION" (~5 sec)
Click the amber **"Try Demo Investigation"** button.

*Narrate:* "Let's investigate a real example of viral misinformation."

---

### 3. CONTENT INGESTION & ANALYSIS ANIMATION (~10 sec)
**URL:** `/investigate?demo=true`

Watch the investigation animation:
- Step 1: "Extracting Primary Claim..."
- Step 2: "Cross-referencing Evidence Sources..."
- Step 3: "Evaluating Missing Context & Emotional Framing..."
- Step 4: "Mapping Multi-Source Perspectives..."
- Step 5: "Generating Trust Passport & Tutor Challenge..."

*Narrate:* "ATHENA runs a 360-degree investigation across 5 literacy dimensions."

---

### 4. TRUST PASSPORT (~15 sec)
The **Trust Passport** tab loads automatically.

**Expand & demonstrate:**
- **Extracted Claim:** "Scientists approved quantum AI system that eradicates digital misinformation."
- **Assessment banner:** *"Evidence is currently insufficient to support this claim."*
- Expand **Evidence Matrix:** 0 supporting, 3 conflicting sources listed
- Expand **Language Framing:** Sensationalism score 88/100, loaded words highlighted

*Narrate:* "The Trust Passport never calls something fake — it shows you the evidence gaps and why the claim requires scrutiny."

---

### 5. PERSPECTIVE EXPLORER (~10 sec)
Click **"Perspective Explorer"** tab.

**Show:**
- Scientific/Academic: Skeptical stance
- Fact-Checking Community: Debunked
- UNESCO/International Organizations: Educational
- Social Media Community: Mixed/Viral

Show the **synthesis section**: Common Ground / Key Differences / Remaining Uncertainties.

*Narrate:* "ATHENA doesn't tell you who to trust — it shows you how different credible sources frame the exact same claim."

---

### 6. NARRATIVE MEMORY (~10 sec)
Click **"Narrative Memory"** tab.

**Click through timeline events:**
- Step 1: Aug 1 — Original speculative academic blog
- Step 2: Aug 5 — Headline manipulated for clicks
- Step 3: Aug 8 — Viral social media amplification
- Step 4: Aug 11 — Fact-check correction

*Narrate:* "ATHENA traces how a legitimate concept mutated into viral misinformation over 10 days."

---

### 7. AI TUTOR & QUIZ (~15 sec)
Click **"AI Tutor & Quiz"** tab.

**Show:**
- Educational explanation: "Spotting Sensationalized Absolute Claims"
- Loaded words analysis
- **Answer Question 1:** Select Option B
- **Answer Question 2:** Select Option C
- Click **"Submit Learning Challenge Answers"**

*Narrate:* "ATHENA doesn't just flag content — it teaches you WHY it's misleading and tests your reasoning."

---

### 8. MEDIA LITERACY PROFILE (~5 sec)
Click **"Media Literacy Profile"** tab.

**Show:**
- Level indicator updated
- 5 skill competency bars
- "UNESCO MIL Investigator" badge earned

*Narrate:* "Every investigation updates your personal Media Literacy Journey — building critical-thinking skills over time."

---

### 9. RETURN TO LANDING PAGE (~5 sec)
Click **ATHENA** logo in navbar.

Show the full platform summary.

*Narrate:* "This is ATHENA — from suspicious content to verified understanding in under 90 seconds. Not because AI told you so, but because you evaluated it yourself."

---

## Demo Stability Notes

- **Demo Mode is fully deterministic.** All results are pre-curated and do not require internet access.
- **Backend fallback:** If backend is unavailable, the frontend serves embedded client-side demo data automatically.
- **Language toggle:** Demo the EN/Hindi switcher in the navbar as a bonus if time allows.

---

## Demonstration Content

The demo scenario uses a fictional but realistic viral claim:

> "BREAKING: Scientists have officially approved a revolutionary technology that can eliminate all digital misinformation automatically using AI quantum frequency scans."

This is **clearly labeled as Demonstration Data** throughout ATHENA.  
It does **not represent any real-world scientific announcement**.
