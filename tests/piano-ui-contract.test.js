const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.join(__dirname, "..");
const appSource = fs.readFileSync(path.join(rootDir, "app.js"), "utf8");
const htmlSource = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");

test("piano prompt is exposed as a polite live region", () => {
  assert.match(
    htmlSource,
    /<p id="pianoPrompt" class="piano-shell-prompt" role="status" aria-live="polite" aria-atomic="true">/u,
  );
});

test("piano navigation cleanup remains wired in app state management", () => {
  assert.match(appSource, /function resetPianoTransientState\(\{ render = false \} = \{\}\)/u);
  assert.match(appSource, /function goHome\(\) \{[\s\S]*?resetPianoTransientState\(\);[\s\S]*?\}/u);
  assert.match(appSource, /if \(state\.gameMode === "piano" && key !== "piano"\) \{[\s\S]*?resetPianoTransientState\(\);[\s\S]*?\}/u);
});

test("piano key interactions preserve focus when the key UI updates", () => {
  assert.match(appSource, /function restorePianoKeyFocus\(keyValue\)/u);
  assert.match(appSource, /setPianoPlayedKey\(keyModel\.key, \{ focusKey \}\)/u);
  assert.match(appSource, /renderPianoGame\(\{ focusKey \}\)/u);
});
