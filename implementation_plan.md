# Implementation Plan: Advanced Features (Interview Project)
This plan outlines the roadmap for implementing 4 key features: AI Mock Interview, Code Execution, Gamification, and Analytics.

## Phase 1: Database Schema & Foundation (IMMEDIATE)
We need to update the Prisma schema to support all new features.

### Schema Changes
1.  **User Model (Gamification)**
    *   Add `xp` (Experience Points)
    *   Add `streak` (Current daily streak)
    *   Add `lastActive` (To calculate streaks)
    *   Add `level` (Derived from XP or explicit)
2.  **Question Model (Analytics & Coding)**
    *   Add `tags` (String[]) for granular skill tracking.
    *   Add `type` (Enum: MCQ, CODING).
    *   Add `codeTemplate` (String?) for coding questions.
    *   Add `testCases` (Json?) for evaluating code.
3.  **MockInterview Model (New)**
    *   Store voice/video interview sessions.
    *   Fields: `transcript`, `audioUrl` (optional), `feedback`, `duration`.
4.  **CodingSubmission Model (New)**
    *   Track user code history.

## Phase 2: Gamification (Leagues & Streaks)
**Goal:** Increase user retention.
*   **Backend:** Logic to increment XP on quiz completion. Logic to check/reset streaks on login/activity.
*   **Frontend:** visual "Level" progress bar in dashboard. "Daily Streak" flame icon.

## Phase 3: Analytics Dashboard (Skill Gap)
**Goal:** Visualize user strengths/weaknesses.
*   **Backend:** Aggregation query to sum score per `tag`.
*   **Frontend:** Radar Chart (using Recharts) on the Dashboard showing performance by category (e.g., React vs Node vs CS Fundamentals).

## Phase 4: AI Mock Interview (Voice)
**Goal:** Real-time speech interaction.
*   **Tech:** Web Speech API (Speech-to-text) + Browser Speech Synthesis (Text-to-speech).
*   **Flow:**
    1.  User grants mic access.
    2.  User speaks answer.
    3.  Text sent to Gemini/Claude.
    4.  AI responds with text + audio playback.

## Phase 5: Code Execution Environment
**Goal:** Run user code securely.
*   **Tech:** Monaco Editor (Frontend).
*   **Execution:** Integration with Piston API (free, open-source code execution engine) or similar.
*   **UI:** Split pane: Problem description left, Code editor right, Console bottom.

---

# Execution Steps
1.  **Update Prisma Schema** with all necessary fields.
2.  **Implement Gamification Logic** (Update user XP on actions).
3.  **Build Analytics Components** (Charts).
4.  **Develop Coding Interface** (Monaco + Piston).
5.  **Develop Voice Interview Interface**.
