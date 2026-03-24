# English Play Garden Engagement Refinement Design

## Goal

Increase re-engagement and short-session retention for a 2.9-year-old autistic child while preserving the app's broader mission: playful English exposure, counting, pattern recognition, and gentle developmental stretching.

## Product Intent

The app is for one real child first. It should feel safe, repeatable, rewarding, and developmentally useful. It should not optimize for maximum screen time. It should optimize for:

- fast delight
- immediate cause and effect
- meaningful English exposure
- parent-bridgeable play
- tiny variations that encourage flexibility without causing frustration

## Research-Aligned Principles

- Follow the child's interests rather than forcing abstract tasks.
- Use repetition as a strength, then add one small stretch at a time.
- Keep adult co-use easy, even when the child is mostly tapping independently.
- Favor active interaction over passive watching.
- Keep the experience predictable, low-friction, and low-surprise.

## Core Problems In The Current App

1. The first-run and return experience feels like a menu instead of an immediate invitation to play.
2. Interests the child is known to enjoy, especially counting and patterns, are underrepresented in the primary home navigation.
3. The strongest loop today is spelling plus repeated audio, but the UI does not make replay and repetition feel central.
4. Auto-advance favors throughput over deliberate repetition.
5. The app includes helpful informational UI in code and CSS, but some of it is either missing from the DOM or visually under-prioritized.

## UX Direction

### 1. Rebalance The Home Screen Around Favorite Entry Paths

The home screen should surface the child's likely interests as clear, large, immediate actions:

- Learn
- Count
- Patterns
- Listen
- Explore Words

Settings should become secondary, not one of the main child-facing choices.

### 2. Make Repetition Feel Supported, Not Incidental

The spell flow should better support:

- hearing the current word again
- hearing the letters again
- staying with the same word long enough to enjoy and learn it

Auto-advance should no longer be the default behavior for new users.

### 3. Add Gentle Developmental Stretch

Each word should offer one tiny developmental nudge at a time, for example:

- tap the next letter
- hear the word again
- count the letters
- find the first letter

These prompts should feel lightweight and optional, never instructional in a heavy-handed way.

### 4. Preserve Balance

This is not becoming a letters-only app. Letters are one strong hook, but the app should continue to broaden into:

- words
- numbers
- patterns
- listening

The balance should be visible in the home screen and in follow-up prompts.

## Proposed UI Changes

### Home Screen

- Keep the existing playful tone and mascots.
- Upgrade hierarchy so one primary route leads, but the broader learning mix is still visible.
- Add direct child-facing entry points for counting and patterns.
- Move settings into a smaller parent utility position.

### Spell Screen

- Add a visible replay/control dock for the current word.
- Surface a short "play cue" line that changes based on progress and mode.
- Speak correct letters immediately on successful placement.
- Keep the current art and word stage but make the interaction loop feel more intentional.

### Motion

- Retain playful motion, but make it clearer and more consistent.
- Ensure feedback motion is fast, purposeful, and not overstimulating.
- Respect reduced motion preferences.

### Accessibility And Robustness

- Add visible focus handling for keyboard-accessible elements.
- Fix missing DOM/UI pieces that are referenced in JS/CSS but not rendered.

## Out Of Scope

- Full rewrite into a framework
- New backend systems
- Clinical claims or therapy replacement
- Long-form parent dashboards or analytics

## Success Signals

- Faster first interaction from the home screen
- More obvious repeatable audio play
- More direct access to counting and pattern play
- Short sessions that feel satisfying without needing long attention spans
- A calmer, more coherent UI with stronger child-facing hierarchy
