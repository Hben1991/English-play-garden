# Piano Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a calm, child-friendly piano game mode inside the existing Learn/game screen, with a focused pure-logic helper module and tests.

**Architecture:** Keep the repo in its current vanilla HTML/CSS/JS shape. Put piano-specific mode definitions, prompt selection, and key-set generation into a new pure `piano-activity.js` module so the behavior can be covered by Node tests before browser wiring. Then integrate that module into `app.js`, add a piano panel to `index.html`, and finish with targeted CSS only. Avoid new abstractions, routing layers, or unrelated refactors.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node built-in `node:test`

---

### Task 1: Lock The Piano Logic Contract In Tests

**Files:**
- Create: `piano-activity.js`
- Create: `tests/piano-activity.test.js`

- [ ] **Step 1: Write the failing tests**

  Cover the small pure API that the browser code will depend on:
  - topic normalization falls back to `letters`
  - topic metadata exists for `letters`, `words`, `colors`, `shapes`, `consonants`, and `numbers`
  - each topic returns a short parent-friendly label, a short child-facing prompt, and a stable key model list
  - key models stay deterministic for a given topic and source pool
  - replay text stays simple and mode-appropriate

  Use `node:test` and `assert/strict`. Keep the tests focused on observable output, not internal implementation details.

  Example shape:

  ```js
  test("getPianoTopicConfig returns the letters defaults", () => {
    assert.deepEqual(getPianoTopicConfig("letters"), {
      key: "letters",
      label: "Letters",
      prompt: "Tap a letter.",
      replayLabel: "Hear again",
    });
  });
  ```

- [ ] **Step 2: Run the test file to verify it fails**

  Run: `node --test tests/piano-activity.test.js`

  Expected: FAIL because `piano-activity.js` does not exist yet, or the exported helpers are still missing.

- [ ] **Step 3: Implement the minimal pure helper module**

  Add `piano-activity.js` as a CommonJS module that also works in the browser, following the same export pattern as `engagement-utils.js`.

  Keep the module focused on data and tiny helper functions only:
  - valid topic list and default topic
  - topic labels and short prompts
  - stable key-set generation for each topic
  - exact topic data sources:
    - `words` uses the current `state.filteredWords` pool at runtime
    - `colors` and `numbers` reuse the existing `WORDS` entries already in the app
    - `letters`, `consonants`, and `shapes` use small local static datasets only
  - a tiny helper for the guided prompt text shown in the studio
  - a tiny helper for the initial topic state and last-used-topic fallback

  Do not add DOM access, timers, audio calls, or storage logic here.

- [ ] **Step 4: Run the test file again to verify it passes**

  Run: `node --test tests/piano-activity.test.js`

  Expected: PASS.

- [ ] **Step 5: Commit the small logic slice if working in task-sized commits**

  ```bash
  git add piano-activity.js tests/piano-activity.test.js
  git commit -m "feat: add piano activity helpers"
  ```

### Task 2: Add Piano To Routing And Learn/Game Navigation

**Files:**
- Modify: `piano-activity.js`
- Modify: `tests/piano-activity.test.js`
- Modify: `app.js`
- Modify: `index.html`

- [ ] **Step 1: Re-read the Learn integration rule from the spec before editing**

  Keep piano inside the existing Learn/game screen:
  - do not add a new home-screen piano route
  - do not create a separate top-level piano screen
  - do make piano a real in-game mode that opens after entering Learn

- [ ] **Step 2: Extend the pure helper tests with the next failing state contract**

  Add failing tests in `tests/piano-activity.test.js` for:
  - the initial piano state defaults to `letters`
  - a stored last-used topic is restored when valid
  - an invalid stored topic falls back to `letters`

  This keeps the next routing/state decision test-first before any browser wiring starts.

- [ ] **Step 3: Run the piano helper tests to verify the new cases fail**

  Run: `node --test tests/piano-activity.test.js`

  Expected: FAIL until the state helpers exist.

- [ ] **Step 4: Implement the smallest pure helpers needed to satisfy those tests**

  Add or extend helper functions in `piano-activity.js` for:
  - default topic selection
  - topic normalization
  - last-used-topic restore rules

  Keep these helpers pure and independent from DOM or localStorage calls.

- [ ] **Step 5: Re-run the piano helper tests**

  Run: `node --test tests/piano-activity.test.js`

  Expected: PASS.

- [ ] **Step 6: Wire the piano destination into the existing app flow**

  Update `app.js` in the same navigation style already used for `spell`, `listen`, and the train screen:
  - add `piano` to `GAME_MODES`
  - add a `piano` branch in `applyGameMode()`
  - make sure entering Learn still works the same way from home
  - make the game-mode layer visible and usable once the child is inside Learn
  - store and restore the last-used piano topic via local storage, using the exact key `din-english-garden-piano-topic` and the pure helper fallback rules
  - cache any new piano DOM nodes alongside the existing `el` lookups, not in a new global registry

  In `index.html`, add a dedicated piano panel inside the existing `.game-area`. Keep the panel inside the Learn/game screen instead of creating a separate top-level screen.
  Also add `<script src="./piano-activity.js"></script>` before `app.js` so the browser can access the shared piano helpers through the same global/export pattern used by `engagement-utils.js`.

- [ ] **Step 7: Re-run the Node tests**

  Run: `node --test tests/piano-activity.test.js`

  Expected: PASS.

- [ ] **Step 8: Commit the routing slice if you are landing in small commits**

  ```bash
  git add piano-activity.js tests/piano-activity.test.js app.js index.html
  git commit -m "feat: add piano mode to learn flow"
  ```

### Task 3: Build The Piano Studio Shell And Interaction Loop

**Files:**
- Modify: `tests/piano-activity.test.js`
- Modify: `app.js`
- Modify: `index.html`
- Modify: `piano-activity.js`

- [ ] **Step 1: Write the next failing helper tests for interaction-critical behavior**

  Add or expand assertions for the interaction contract the browser code will rely on:
  - the piano topic selector starts on a sensible default, likely `letters`
  - switching topics returns a fresh topic config without mutating unrelated state
  - the stable key model for each topic includes the labels the studio should render
  - the replay/guided audio policy produces a single foreground audio instruction model
  - the guided prompt helper does not auto-repeat after every tap

  Keep these helper tests focused on decisions the DOM layer will consume, not direct DOM output.

  Keep this in `tests/piano-activity.test.js` so the browser shell can be built around a locked contract.

- [ ] **Step 2: Run the helper tests to verify the new cases fail**

  Run: `node --test tests/piano-activity.test.js`

  Expected: FAIL until the new helpers exist.

- [ ] **Step 3: Add the minimal helper logic needed to make those tests pass**

  Extend `piano-activity.js` only as far as needed for:
  - topic switching without shared mutation
  - guided prompt text generation
  - replay/guided audio priority metadata

  Do not add browser APIs yet.

- [ ] **Step 4: Re-run the helper tests**

  Run: `node --test tests/piano-activity.test.js`

  Expected: PASS.

- [ ] **Step 5: Implement the browser-facing piano state and panel wiring**

  In `app.js`, add the smallest state needed for the piano studio:
  - active piano topic
  - current guided prompt
  - current target key or target item, if the topic uses one
  - last-used topic storage key
  - replay state only if it helps keep the UI calm and predictable
  - one clear foreground audio rule: replay replaces the current guided prompt audio, and taps never trigger repeated prompt playback automatically

  Add a `initPianoStudio()` path in the existing mode switch that:
  - renders the topic selector
  - renders the prompt area
  - renders a stable set of large keys
  - plays immediate feedback on every tap
  - keeps free play available even when a guided prompt is active
  - restores the last-used topic when the studio opens
  - uses `piano-activity.js` for the topic data and prompt text

  Reuse existing audio and celebration helpers already in `app.js` instead of inventing new ones.

- [ ] **Step 6: Add the piano panel markup**

  In `index.html`, place the piano panel inside `.game-area` with only the controls the spec needs:
  - a small topic selector
  - a replay button
  - one short prompt line
  - one stable keyboard area

  Keep the layout quiet and obvious. Do not add scrollable keyboards, lesson steps, or unrelated parent dashboards.

- [ ] **Step 7: Run the Node tests again after the integration changes**

  Run: `node --test tests/piano-activity.test.js`

  Expected: PASS, confirming the pure logic contract stayed intact while the browser code changed around it.

- [ ] **Step 8: Commit the shell and interaction slice**

  ```bash
  git add tests/piano-activity.test.js app.js index.html piano-activity.js
  git commit -m "feat: add piano studio shell"
  ```

### Task 4: Style The Piano Studio For Calm Touch Play

**Files:**
- Modify: `styles.css`
- Modify: `index.html`

- [ ] **Step 1: Write the styling expectations in comments or checklist notes before editing**

  Keep the style pass intentionally narrow:
  - keys must be large enough for toddler touch input
  - the stage should feel quiet, not busy
  - active, pressed, and focused states must be visible
  - the topic selector and replay control should be secondary to the keys
  - motion should stay brief and respect reduced-motion users

- [ ] **Step 2: Add the piano-specific CSS**

  Extend `styles.css` with only the classes needed for the new piano panel:
  - piano shell, header row, and prompt area
  - topic pills or buttons
  - large keyboard grid and pressed state
  - calm success / hint styling
  - mobile layout adjustments
  - reduced-motion overrides for any non-essential animation

  Keep the existing spell/listen/train styles untouched unless the piano layout truly depends on shared tokens.

- [ ] **Step 3: Re-check the HTML structure against the new styles**

  Make any tiny `index.html` adjustments needed so the piano classes have the right wrappers and IDs, but do not restructure the rest of the page.

- [ ] **Step 4: Re-run the Node tests**

  Run: `node --test tests/piano-activity.test.js`

  Expected: PASS. This is a sanity check that the styling pass did not leak into the helper contract.

- [ ] **Step 5: Commit the style slice**

  ```bash
  git add styles.css index.html
  git commit -m "feat: style piano studio"
  ```

### Task 5: Final Verification And Smoke Check

**Files:**
- None

- [ ] **Step 1: Run the full Node test suite**

  Run: `node --test tests/engagement-utils.test.js tests/piano-activity.test.js`

  Expected: PASS.

- [ ] **Step 2: Start the local server and smoke the piano flow**

  Run: `node server.js`

  Then verify in the browser that:
  - the home Learn/game area still opens normally
  - the piano entry point opens the new studio inside the existing game screen
  - piano opens into an immediately tappable default topic on first use
  - returning to piano restores the last-used topic when valid
  - topic switching does not reset the whole app
  - key taps give immediate calm feedback
  - replay replaces the active guided audio instead of layering on top
  - guided prompts do not auto-repeat after every tap
  - replay stays visible and easy to reach
  - words mode uses the current filtered Learn pool
  - colors and numbers reuse existing app entries
  - shapes stays intentionally small and simple
  - random tapping and one-key repetition still feel calm and usable
  - pauses leave the screen steady without pushing the child forward
  - rapid mode changes do not break audio or state
  - topic buttons, replay, and keys all remain keyboard reachable
  - visible focus states are present for topic buttons, replay, and keys
  - reduced-motion behavior stays readable and usable
  - mobile sizing still feels comfortable

- [ ] **Step 3: Review the diff for scope creep**

  Confirm that only the piano feature, its tests, and the minimal routing/style updates changed. Do not add unrelated refactors, new state stores, or package-level scripts.
