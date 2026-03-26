const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizePianoTopic,
  getPianoTopicConfig,
  getStablePianoKeySet,
  getNextPianoGuidedTarget,
  getInitialPianoTopicState,
  getLastUsedPianoTopic,
  getPianoGuidedPrompt,
  getPianoAudioPolicy,
  getPianoReplayText,
  getPianoLiveAnnouncement,
  getPianoFocusRestoreKey,
  getClearedPianoTransientState,
} = require("../piano-activity");

test("normalizePianoTopic falls back to letters", () => {
  assert.equal(normalizePianoTopic(), "letters");
  assert.equal(normalizePianoTopic(null), "letters");
  assert.equal(normalizePianoTopic("  "), "letters");
  assert.equal(normalizePianoTopic("unknown-topic"), "letters");
});

test("getPianoTopicConfig exposes the supported topic metadata", () => {
  const topics = ["letters", "words", "colors", "shapes", "consonants", "numbers"];

  for (const topic of topics) {
    const config = getPianoTopicConfig(topic);

    assert.equal(config.key, topic);
    assert.equal(typeof config.label, "string");
    assert.ok(config.label.length > 0);
    assert.equal(typeof config.prompt, "string");
    assert.ok(config.prompt.length > 0);
    assert.equal(typeof config.replayLabel, "string");
    assert.ok(config.replayLabel.length > 0);
  }
});

test("getPianoTopicConfig keeps the letters defaults short and child-facing", () => {
  assert.deepEqual(getPianoTopicConfig("letters"), {
    key: "letters",
    label: "Letters",
    prompt: "Tap a letter.",
    replayLabel: "Hear again",
  });
});

test("getPianoTopicConfig returns a fresh config object each time", () => {
  const first = getPianoTopicConfig("words");
  const second = getPianoTopicConfig("words");

  assert.notStrictEqual(first, second);

  first.label = "Changed";
  first.prompt = "Changed prompt";

  assert.deepEqual(getPianoTopicConfig("words"), {
    key: "words",
    label: "Words",
    prompt: "Tap a word.",
    replayLabel: "Hear again",
  });
});

test("getStablePianoKeySet returns the static letters, consonants, and shapes sets", () => {
  assert.deepEqual(getStablePianoKeySet("letters", [
    { key: "z", label: "Z" },
  ]), [
    { key: "A", label: "A" },
    { key: "B", label: "B" },
    { key: "C", label: "C" },
    { key: "D", label: "D" },
  ]);

  assert.deepEqual(getStablePianoKeySet("consonants", [
    { key: "q", label: "Q" },
  ]), [
    { key: "B", label: "B" },
    { key: "M", label: "M" },
    { key: "S", label: "S" },
    { key: "T", label: "T" },
  ]);

  assert.deepEqual(getStablePianoKeySet("shapes", [
    { key: "heart", label: "heart" },
  ]), [
    { key: "circle", label: "circle" },
    { key: "square", label: "square" },
    { key: "triangle", label: "triangle" },
    { key: "star", label: "star" },
  ]);
});

test("getStablePianoKeySet maps runtime-driven word, color, and number pools deterministically", () => {
  const sourcePool = [
    { key: "dog", label: "dog" },
    { key: "ant", label: "ant" },
    { key: "cat", label: "cat" },
  ];

  const colorPool = [
    { key: "red", label: "red", category: "colors", color: "#EF5350" },
    { key: "blue", label: "blue", category: "colors", color: "#42A5F5" },
    { key: "green", label: "green", category: "colors", color: "#66BB6A" },
  ];

  const numberPool = [
    { key: "3", label: "3", category: "numbers" },
    { key: "1", label: "1", category: "numbers" },
    { key: "2", label: "2", category: "numbers" },
  ];

  const first = getStablePianoKeySet("words", sourcePool);
  const second = getStablePianoKeySet("words", sourcePool);

  assert.deepEqual(first, second);
  assert.deepEqual(first, [
    { key: "ant", label: "ant" },
    { key: "cat", label: "cat" },
    { key: "dog", label: "dog" },
  ]);

  assert.deepEqual(getStablePianoKeySet("colors", colorPool), [
    { key: "blue", label: "blue", category: "colors", color: "#42A5F5" },
    { key: "green", label: "green", category: "colors", color: "#66BB6A" },
    { key: "red", label: "red", category: "colors", color: "#EF5350" },
  ]);

  assert.deepEqual(getStablePianoKeySet("numbers", numberPool), [
    { key: "1", label: "1", category: "numbers" },
    { key: "2", label: "2", category: "numbers" },
    { key: "3", label: "3", category: "numbers" },
  ]);
});

test("getStablePianoKeySet sorts number keys numerically", () => {
  const numberPool = [
    { key: "10", label: "10", category: "numbers" },
    { key: "2", label: "2", category: "numbers" },
    { key: "3", label: "3", category: "numbers" },
  ];

  assert.deepEqual(getStablePianoKeySet("numbers", numberPool), [
    { key: "2", label: "2", category: "numbers" },
    { key: "3", label: "3", category: "numbers" },
    { key: "10", label: "10", category: "numbers" },
  ]);
});

test("getStablePianoKeySet accepts mixed pools and normalized pools for colors and numbers", () => {
  const mixedPool = [
    { key: "red", label: "red", category: "colors" },
    { key: "dog", label: "dog", category: "words" },
    { key: "3", label: "3", category: "numbers" },
    { key: "blue", label: "blue", category: "colors" },
    { key: "1", label: "1", category: "numbers" },
    { key: "cat", label: "cat", category: "words" },
  ];

  assert.deepEqual(getStablePianoKeySet("colors", mixedPool), [
    { key: "blue", label: "blue", category: "colors" },
    { key: "red", label: "red", category: "colors" },
  ]);

  assert.deepEqual(getStablePianoKeySet("numbers", mixedPool), [
    { key: "1", label: "1", category: "numbers" },
    { key: "3", label: "3", category: "numbers" },
  ]);

  assert.deepEqual(getStablePianoKeySet("colors", [
    { key: "blue", label: "blue" },
    { key: "red", label: "red" },
  ]), [
    { key: "blue", label: "blue" },
    { key: "red", label: "red" },
  ]);

  assert.deepEqual(getStablePianoKeySet("numbers", [
    { key: "10", label: "10" },
    { key: "2", label: "2" },
    { key: "3", label: "3" },
  ]), [
    { key: "2", label: "2" },
    { key: "3", label: "3" },
    { key: "10", label: "10" },
  ]);
});

test("getStablePianoKeySet merges categorized and uncategorized items for colors and numbers", () => {
  assert.deepEqual(getStablePianoKeySet("colors", [
    { key: "red", label: "red", category: "colors" },
    { key: "blue", label: "blue" },
    { key: "green", label: "green" },
  ]), [
    { key: "blue", label: "blue" },
    { key: "green", label: "green" },
    { key: "red", label: "red", category: "colors" },
  ]);

  assert.deepEqual(getStablePianoKeySet("numbers", [
    { key: "3", label: "3", category: "numbers" },
    { key: "2", label: "2" },
    { key: "10", label: "10" },
  ]), [
    { key: "2", label: "2" },
    { key: "3", label: "3", category: "numbers" },
    { key: "10", label: "10" },
  ]);
});

test("getStablePianoKeySet tolerates primitive items mixed with categorized colors and numbers", () => {
  assert.deepEqual(getStablePianoKeySet("colors", [
    { key: "red", label: "red", category: "colors" },
    "blue",
  ]), [
    { key: "blue", label: "blue" },
    { key: "red", label: "red", category: "colors" },
  ]);

  assert.deepEqual(getStablePianoKeySet("numbers", [
    { key: "3", label: "3", category: "numbers" },
    0,
    2,
  ]), [
    { key: "0", label: "0" },
    { key: "2", label: "2" },
    { key: "3", label: "3", category: "numbers" },
  ]);
});

test("getStablePianoKeySet caps dynamic topics and preserves metadata needed by the piano UI", () => {
  const wordPool = [
    { key: "zebra", label: "zebra", category: "words" },
    { key: "apple", label: "apple", category: "words" },
    { key: "monkey", label: "monkey", category: "words" },
    { key: "boat", label: "boat", category: "words" },
    { key: "cat", label: "cat", category: "words" },
    { key: "dog", label: "dog", category: "words" },
    { key: "eel", label: "eel", category: "words" },
  ];

  const colorPool = [
    { key: "red", label: "red", category: "colors", colors: ["#FFEBEE", "#EF5350", "#B71C1C"] },
    { key: "blue", label: "blue", category: "colors", colors: ["#E3F2FD", "#42A5F5", "#1565C0"] },
    { key: "green", label: "green", category: "colors", colors: ["#E8F5E9", "#66BB6A", "#2E7D32"] },
    { key: "yellow", label: "yellow", category: "colors", colors: ["#FFFDE7", "#FFEE58", "#F9A825"] },
    { key: "pink", label: "pink", category: "colors", colors: ["#FCE4EC", "#F48FB1", "#C2185B"] },
    { key: "orange", label: "orange", category: "colors", colors: ["#FFF3E0", "#FFA726", "#E65100"] },
    { key: "white", label: "white", category: "colors", colors: ["#F5F5F5", "#FFFFFF", "#BDBDBD"] },
  ];

  const numberPool = [
    { key: "ten", label: "ten", category: "numbers", numberValue: 10 },
    { key: "two", label: "two", category: "numbers", numberValue: 2 },
    { key: "one", label: "one", category: "numbers", numberValue: 1 },
    { key: "four", label: "four", category: "numbers", numberValue: 4 },
    { key: "three", label: "three", category: "numbers", numberValue: 3 },
    { key: "six", label: "six", category: "numbers", numberValue: 6 },
    { key: "five", label: "five", category: "numbers", numberValue: 5 },
  ];

  assert.deepEqual(getStablePianoKeySet("words", wordPool), [
    { key: "apple", label: "apple", category: "words" },
    { key: "boat", label: "boat", category: "words" },
    { key: "cat", label: "cat", category: "words" },
    { key: "dog", label: "dog", category: "words" },
    { key: "eel", label: "eel", category: "words" },
    { key: "monkey", label: "monkey", category: "words" },
  ]);

  assert.deepEqual(getStablePianoKeySet("colors", colorPool), [
    { key: "blue", label: "blue", category: "colors", colors: ["#E3F2FD", "#42A5F5", "#1565C0"] },
    { key: "green", label: "green", category: "colors", colors: ["#E8F5E9", "#66BB6A", "#2E7D32"] },
    { key: "orange", label: "orange", category: "colors", colors: ["#FFF3E0", "#FFA726", "#E65100"] },
    { key: "pink", label: "pink", category: "colors", colors: ["#FCE4EC", "#F48FB1", "#C2185B"] },
    { key: "red", label: "red", category: "colors", colors: ["#FFEBEE", "#EF5350", "#B71C1C"] },
    { key: "white", label: "white", category: "colors", colors: ["#F5F5F5", "#FFFFFF", "#BDBDBD"] },
  ]);

  assert.deepEqual(getStablePianoKeySet("numbers", numberPool), [
    { key: "one", label: "one", category: "numbers", numberValue: 1 },
    { key: "two", label: "two", category: "numbers", numberValue: 2 },
    { key: "three", label: "three", category: "numbers", numberValue: 3 },
    { key: "four", label: "four", category: "numbers", numberValue: 4 },
    { key: "five", label: "five", category: "numbers", numberValue: 5 },
    { key: "six", label: "six", category: "numbers", numberValue: 6 },
  ]);
});

test("getStablePianoKeySet drops malformed pool items", () => {
  assert.deepEqual(getStablePianoKeySet("words", [
    null,
    undefined,
    "",
    { key: "", label: "  " },
    { key: "dog", label: "" },
    { key: " ", label: "cat" },
    { label: "bird" },
    { key: "fish" },
  ]), [
    { key: "bird", label: "bird" },
    { key: "cat", label: "cat" },
    { key: "dog", label: "dog" },
    { key: "fish", label: "fish" },
  ]);
});

test("getStablePianoKeySet preserves primitive zero values in numeric pools", () => {
  assert.deepEqual(getStablePianoKeySet("numbers", [0, 2, 10]), [
    { key: "0", label: "0" },
    { key: "2", label: "2" },
    { key: "10", label: "10" },
  ]);
});

test("getInitialPianoTopicState and getLastUsedPianoTopic keep the topic stable", () => {
  assert.deepEqual(getInitialPianoTopicState(), {
    topic: "letters",
  });

  assert.equal(getLastUsedPianoTopic("colors"), "colors");
  assert.equal(getLastUsedPianoTopic("  words  "), "words");
  assert.equal(getLastUsedPianoTopic("not-a-topic"), "letters");
});

test("getPianoReplayText stays simple and mode-appropriate", () => {
  assert.equal(getPianoReplayText("letters"), "Hear again");
  assert.equal(getPianoReplayText("words"), "Hear again");
  assert.equal(getPianoReplayText("colors"), "Hear again");
  assert.equal(getPianoReplayText("shapes"), "Hear again");
  assert.equal(getPianoReplayText("consonants"), "Hear again");
  assert.equal(getPianoReplayText("numbers"), "Hear again");
});

test("getPianoAudioPolicy keeps replay on the current prompt and disables auto-repeat after taps", () => {
  assert.deepEqual(getPianoAudioPolicy("letters"), {
    replaySource: "current-prompt",
    autoRepeatGuidedPrompt: false,
  });

  assert.deepEqual(getPianoAudioPolicy("words"), {
    replaySource: "current-prompt",
    autoRepeatGuidedPrompt: false,
  });
});

test("getPianoGuidedPrompt stays short and uses the right verb by topic", () => {
  assert.equal(getPianoGuidedPrompt("letters", { key: "a", label: "a" }), "Tap A.");
  assert.equal(getPianoGuidedPrompt("consonants", { key: "m", label: "m" }), "Tap M.");
  assert.equal(getPianoGuidedPrompt("numbers", { key: "3", label: "3" }), "Tap 3.");

  assert.equal(getPianoGuidedPrompt("words", { key: "dog", label: "dog" }), "Find dog.");
  assert.equal(getPianoGuidedPrompt("colors", { key: "red", label: "red" }), "Find red.");
  assert.equal(getPianoGuidedPrompt("shapes", { key: "triangle", label: "triangle" }), "Find triangle.");
  assert.equal(getPianoGuidedPrompt("words", null), "Tap a word.");
  assert.notEqual(getPianoGuidedPrompt("words", null), "Find .");
});

test("getNextPianoGuidedTarget advances deterministically through a stable key set", () => {
  const keySet = [
    { key: "a", label: "A" },
    { key: "b", label: "B" },
    { key: "c", label: "C" },
  ];

  assert.deepEqual(getNextPianoGuidedTarget(keySet), { key: "a", label: "A" });
  assert.deepEqual(getNextPianoGuidedTarget(keySet, { key: "a", label: "A" }), { key: "b", label: "B" });
  assert.deepEqual(getNextPianoGuidedTarget(keySet, { key: "c", label: "C" }), { key: "a", label: "A" });
  assert.deepEqual(getNextPianoGuidedTarget(keySet, { key: "missing", label: "Missing" }), { key: "a", label: "A" });
});

test("getPianoLiveAnnouncement includes the current topic and prompt for polite updates", () => {
  assert.equal(getPianoLiveAnnouncement("words", "Find dog."), "Words. Find dog.");
  assert.equal(getPianoLiveAnnouncement("letters"), "Letters. Tap a letter.");
});

test("getPianoFocusRestoreKey only preserves focus for keys still present after rerender", () => {
  const keySet = [
    { key: "A", label: "A" },
    { key: "B", label: "B" },
  ];

  assert.equal(getPianoFocusRestoreKey(keySet, "B"), "B");
  assert.equal(getPianoFocusRestoreKey(keySet, "missing"), "");
  assert.equal(getPianoFocusRestoreKey([], "A"), "");
});

test("getClearedPianoTransientState clears played-key state without dropping topic context", () => {
  assert.deepEqual(getClearedPianoTransientState({
    topic: "colors",
    keySet: [{ key: "red", label: "red" }],
    guidedTarget: { key: "red", label: "red" },
    promptText: "Find red.",
    lastPlayedKey: "red",
    playedKeyTimer: 123,
    focusKey: "red",
  }), {
    topic: "colors",
    keySet: [{ key: "red", label: "red" }],
    guidedTarget: { key: "red", label: "red" },
    promptText: "Find red.",
    lastPlayedKey: "",
    playedKeyTimer: null,
    focusKey: "",
  });
});
