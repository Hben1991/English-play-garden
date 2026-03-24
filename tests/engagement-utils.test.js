const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getHomeRoute,
  getHomePrimaryAction,
  getGameFeedback,
  getPracticeCue,
  getReplayActions,
} = require("../engagement-utils");

test("getHomeRoute maps the child-facing home targets", () => {
  assert.deepEqual(getHomeRoute("spell"), {
    key: "spell",
    label: "Spell",
    href: "#spell",
  });

  assert.deepEqual(getHomeRoute("count"), {
    key: "count",
    label: "Count",
    href: "#count",
  });

  assert.deepEqual(getHomeRoute("patterns"), {
    key: "pattern",
    label: "Patterns",
    href: "#pattern",
  });

  assert.deepEqual(getHomeRoute("listen"), {
    key: "listen",
    label: "Listen",
    href: "#listen",
  });

  assert.deepEqual(getHomeRoute("browse"), {
    key: "browse",
    label: "Browse",
    href: "#browse",
  });
});

test("getPracticeCue keeps repetition first and adds a tiny stretch", () => {
  assert.deepEqual(getPracticeCue({
    mode: "spell",
    repeatCount: 0,
    word: "DOG",
  }), {
    text: "Hear it again, then try the next letter.",
    repeat: true,
    stretch: "next-letter",
  });
});

test("getReplayActions prefers word, letters, then sound", () => {
  assert.deepEqual(getReplayActions({
    label: "dog",
    word: "DOG",
    sound: "Woof woof!",
  }), [
    { key: "hear-word", label: "Hear word" },
    { key: "hear-letters", label: "Hear letters" },
    { key: "hear-sound", label: "Hear sound" },
  ]);
});

test("getGameFeedback gives a calm next-step hint for each active game", () => {
  assert.deepEqual(getGameFeedback({
    mode: "pattern",
    phase: "wrong",
  }), {
    text: "Try another one.",
    tone: "hint",
  });

  assert.deepEqual(getGameFeedback({
    mode: "memory",
    phase: "mismatch",
  }), {
    text: "Not a pair. Try another card.",
    tone: "hint",
  });

  assert.deepEqual(getGameFeedback({
    mode: "sort",
    phase: "wrong",
    bucketLabel: "Animals",
  }), {
    text: "Put it with Animals.",
    tone: "hint",
  });

  assert.deepEqual(getGameFeedback({
    mode: "listen",
    phase: "wrong",
  }), {
    text: "Listen again, then tap it.",
    tone: "hint",
  });
});

test("getHomePrimaryAction picks a quick-start route and child-facing label", () => {
  assert.deepEqual(getHomePrimaryAction(), {
    key: "spell",
    label: "Play Letters",
    href: "#spell",
  });

  assert.deepEqual(getHomePrimaryAction("listen"), {
    key: "listen",
    label: "Hear It",
    href: "#listen",
  });
});
