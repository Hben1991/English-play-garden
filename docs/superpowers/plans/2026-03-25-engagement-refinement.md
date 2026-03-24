# Engagement Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve short-session engagement and developmental fit by strengthening home-screen entry points, repetition-friendly audio interactions, and child-first hierarchy.

**Architecture:** Keep the app as a lightweight vanilla HTML/CSS/JS experience, but extract small pure helpers for routing and prompt logic so the new behavior can be tested with Node's built-in test runner. Implement the UI upgrade in-place without rewriting the app structure.

**Tech Stack:** Static HTML, CSS, browser JavaScript, GSAP, Node built-in `node:test`

---

### Task 1: Add Testable Engagement Helpers

**Files:**
- Create: `engagement-utils.js`
- Create: `tests/engagement-utils.test.js`
- Modify: `index.html`
- Modify: `app.js`

- [ ] **Step 1: Write the failing tests**
- [ ] **Step 2: Run the tests to verify they fail**
- [ ] **Step 3: Implement pure helper functions for home routing and spell/listen prompts**
- [ ] **Step 4: Wire helpers into the browser app**
- [ ] **Step 5: Run tests again to verify they pass**

### Task 2: Rebuild The Home Screen Around Better Entry Points

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`

- [ ] **Step 1: Update home-screen markup to add count/pattern routes and demote settings**
- [ ] **Step 2: Update home-screen styles to improve hierarchy and scannability**
- [ ] **Step 3: Implement route handling for the new child-facing destinations**
- [ ] **Step 4: Verify the screen still behaves well on mobile widths**

### Task 3: Strengthen The Repeatable Spell Loop

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`

- [ ] **Step 1: Add missing UI containers for game status, cues, and replay controls**
- [ ] **Step 2: Make auto-advance default to off for new users**
- [ ] **Step 3: Add current-word replay controls and progress-sensitive cues**
- [ ] **Step 4: Add immediate letter speech and tighter completion controls**
- [ ] **Step 5: Verify spell flow still completes correctly**

### Task 4: Motion, Focus, And Polish Pass

**Files:**
- Modify: `styles.css`
- Modify: `app.js`

- [ ] **Step 1: Normalize feedback timing and active states**
- [ ] **Step 2: Add focus-visible styling for major controls**
- [ ] **Step 3: Add reduced-motion handling for non-essential animation**
- [ ] **Step 4: Verify overlays and animated layers still stage correctly**

### Task 5: Verification

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add a test script if needed**
- [ ] **Step 2: Run `node --test tests/engagement-utils.test.js`**
- [ ] **Step 3: Run the project-level test command**
- [ ] **Step 4: Review the diff for unintended regressions**
