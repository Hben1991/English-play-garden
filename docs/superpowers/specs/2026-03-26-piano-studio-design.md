# English Play Garden Piano Studio Design

## Goal

Add a piano learning activity inside the existing Learn flow that feels calm, predictable, and fun for a 2.9-year-old autistic child. The studio should combine open-ended free play with gentle guided prompts, use separate topic modes, and stay faithful to the app's warm, child-first tone.

## Product Intent

The piano studio is not a music curriculum in the school sense. It is a short-session play space that helps the child:

- explore cause and effect through sound
- repeat the same action without friction
- copy tiny patterns when ready
- feel successful quickly
- stay regulated with a predictable layout and gentle feedback

The experience should be inviting before it is instructional. If the child only wants to tap one key over and over, that still counts as success.

## UX Direction

The studio should live inside Learn as one mode-based destination, not as a new home-screen mode. The child should always know where they are, what is tappable, and what happens next.

In the current app structure, that means:

- the home screen still routes into the existing Learn/Spell experience
- piano becomes a new game mode inside the current game screen
- back navigation from piano returns to the same game screen and then home exactly the way other game modes already do
- the first child-facing experience stays immediate instead of adding a new home-level choice

Design the flow around three ideas:

- one stable piano stage
- a small set of topic modes with clear differences
- a shared loop of free play, then a tiny guided stretch, then back to free play

The tone should be warm and reassuring. Use language like "play," "copy," "again," and "listen." Avoid pressure, scoring language, or overly busy instructions.

## Proposed UI Changes

### Learn Entry

- Add piano as a new game mode inside the existing Learn/game screen.
- Keep the home screen simple; do not introduce a separate piano home mode or a separate top-level piano screen.
- Let the child reach piano after entering Learn, using the existing game-mode layer rather than a new front-door branch.

### Piano Studio Shell

- Introduce a dedicated piano panel inside the existing game screen.
- Use a fixed keyboard area with large touch targets and no scrolling keyboard.
- Keep the stage visually quiet so the keys and prompt area remain the focus.
- Include a small top-level mode selector for the piano topic modes.
- Include a simple replay control so the child can hear the prompt again without losing context.
- Open piano directly into a ready-to-tap default topic so the child does not need to make a choice before first play.
- Restore the last-used piano topic on return when possible; if nothing is stored yet, default to `Letters`.

### Key Surface

- Show a small, stable set of keys at first rather than a full complex instrument.
- Use high-contrast but soft colors that remain readable and not overstimulating.
- Keep key shapes and spacing consistent across topic modes.
- Make every key feel directly tappable with clear pressed feedback.

### Prompt Area

- Add one short prompt line near the keyboard.
- The prompt should be short enough for a parent to repeat naturally.
- The prompt should change with the topic mode, but the layout should stay the same.

## Interaction Model

The interaction model should support both child-led exploration and tiny guided challenges.

### Shared Loop

1. The child opens piano and lands on an immediately tappable default topic.
2. The studio offers a very short prompt or demo.
3. The child can play freely on the keys.
4. When appropriate, the studio offers one small next step.
5. Success returns the child to free play or repeats the same mode with a slightly different prompt.

### Feedback Rules

- Every tap should produce immediate, calm audio feedback.
- Successful actions should get brief praise or a soft celebration.
- Incorrect or unexpected taps should not feel wrong or noisy; they should simply redirect toward the next gentle action.
- If the child pauses, the studio should remain steady and wait rather than pushing ahead.
- One foreground audio event should lead at a time. Replay should cancel or replace the current guided prompt audio, and guided prompts should not auto-repeat after every tap.

### Parent-Friendly Control

- Keep replay easy to reach.
- Keep mode switching visible but secondary to the keys.
- Do not require reading-heavy instructions to understand the current activity.

## Topic Modes

Each topic mode should reuse the same keyboard shell and the same tap loop, but change the learning content shown on the keys and in the prompt area.

The piano activity should launch with topic modes, not music-game archetypes. The child should be able to move between learning domains without learning a new layout each time.

### 1. Letters

- Purpose: connect key taps with single English letters.
- Behavior: each key represents one letter from a small visible set.
- Guided prompts: "Tap A," "Find M," "Play B again."
- Value: simple letter exposure with instant repetition.

### 2. Words

- Purpose: connect sound, vocabulary, and visual recognition.
- Behavior: each key represents one familiar word from the current filtered learning pool.
- Guided prompts: "Find dog," "Play apple," "Tap train again."
- Value: brings the existing vocabulary set into a more playful, musical interaction.

### 3. Colors

- Purpose: link spoken color names to strong visual swatches.
- Behavior: each key uses a stable color surface and speaks the color name when tapped.
- Guided prompts: "Find red," "Tap blue," "Play yellow again."
- Value: direct color recognition with low reading demand.

### 4. Shapes

- Purpose: teach common early-learning shapes through repeated tapping.
- Behavior: each key shows one simple shape such as circle, square, triangle, star, heart, oval, rectangle, or diamond.
- Guided prompts: "Find triangle," "Tap circle," "Play star again."
- Value: adds a non-word concept mode that still fits the same interaction model.

### 5. Consonants

- Purpose: focus on a smaller phonics-friendly letter group.
- Behavior: keys show consonant letters only, using the same keyboard shell as the letters mode.
- Guided prompts: "Find B," "Tap S," "Play T again."
- Value: reduces choice load and supports early sound grouping without heavy instruction.

### 6. Numbers

- Purpose: extend the app's existing counting strength into the piano activity.
- Behavior: each key represents a number word or numeral from a small current set.
- Guided prompts: "Tap 3," "Find five," "Play 2 again."
- Value: supports repetition and transfer from the number train into the Learn flow.

The first release should include enough topic variety to feel worth returning to, but each topic must stay simple. If additional topics are added later, they should follow the same rule: one clear learning domain, one stable key layout, one tiny guided stretch.

## Content Reuse And New Content Scope

To keep the feature aligned with the existing app instead of quietly becoming a larger curriculum project:

- `Words` must reuse the existing filtered vocabulary pool from the current Learn flow.
- `Colors` must reuse the existing color entries already present in the app data.
- `Numbers` must reuse the existing number entries already present in the app data.
- `Letters` and `Consonants` should come from small static alphabet datasets rather than new remote content or generated assets.
- `Shapes` is the only clearly new concept set in this first release and should use a small static local dataset with simple labels and visual forms.

No topic mode in the first release should require new APIs, new backend storage, or large new art production.

## Guided Play Inside Each Topic

The child should not have to choose between free play and guided play as separate experiences. Each topic mode should blend both:

- Any key tap should always work and feel rewarding.
- The studio should occasionally offer one tiny target prompt within the current topic.
- A correct guided tap should get a soft celebration, then return naturally to open tapping.
- A non-target tap should still play and speak, so "wrong" never feels like failure.

This structure preserves child-led repetition while still creating gentle learning moments.

## Motion And Accessibility Guardrails

- Motion should be soft, brief, and purposeful.
- Avoid constant bouncing, flashing, or long decorative loops.
- Press feedback should feel immediate, but not jittery.
- Respect reduced-motion preferences by removing non-essential animation.
- Keep focus states visible for all interactive elements.
- Make sure the keyboard remains usable with touch, mouse, and keyboard input.
- Do not rely on color alone to explain the current mode or active key.
- Avoid audio overlap that could feel noisy or confusing.
- Keep transitions predictable so the child can build trust in the interface.

## Testing Considerations

Validate the studio with a mix of manual play checks and targeted behavior checks.

- Confirm the piano entry is discoverable inside Learn and does not appear as a separate home mode.
- Verify each topic mode has a distinct purpose but the same stable keyboard layout.
- Test that free play works instantly on first tap.
- Test that guided prompts are short, repeatable, and easy to replay.
- Test that switching modes does not reset the child into a confusing state.
- Test on a small mobile screen with repeated taps, pauses, and rapid mode changes.
- Verify reduced-motion behavior and readable contrast across the studio.
- Check that the experience still feels calm when the child taps randomly or repeats one key many times.

## Out Of Scope

- Full piano lessons or formal music theory
- Sheet music, notation, or note-reading instruction
- A full 88-key instrument
- Recording, saving, or sharing performances
- Multiplayer or competitive modes
- Parent analytics dashboards
- Therapy claims or clinical positioning
- A new piano mode on the home screen

## Success Signals

- The child enters the piano studio and begins tapping quickly without needing adult explanation.
- Free play and guided prompts both feel natural in the same space.
- The child repeats notes or tiny patterns without frustration.
- Topic modes feel distinct without making the app feel fragmented.
- Transitions stay calm and predictable.
- Parents can understand the activity at a glance and help only when needed.
- Short sessions end with the child still engaged, settled, and willing to return.
