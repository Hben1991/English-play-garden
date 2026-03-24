function normalizeTarget(target) {
  return String(target || "")
    .trim()
    .toLowerCase();
}

function getHomeRoute(target) {
  const key = normalizeTarget(target);
  const routes = {
    spell: { key: "spell", label: "Spell", href: "#spell" },
    learn: { key: "spell", label: "Spell", href: "#spell" },
    count: { key: "count", label: "Count", href: "#count" },
    numbers: { key: "count", label: "Count", href: "#count" },
    pattern: { key: "pattern", label: "Patterns", href: "#pattern" },
    patterns: { key: "pattern", label: "Patterns", href: "#pattern" },
    listen: { key: "listen", label: "Listen", href: "#listen" },
    browse: { key: "browse", label: "Browse", href: "#browse" },
    words: { key: "browse", label: "Browse", href: "#browse" },
  };

  return routes[key] || null;
}

function getHomePrimaryAction(target) {
  const route = getHomeRoute(target || "spell") || getHomeRoute("spell");
  const labels = {
    spell: "Play Letters",
    count: "Count Now",
    pattern: "Play Patterns",
    listen: "Hear It",
    browse: "See Words",
  };

  return {
    key: route.key,
    label: labels[route.key] || "Play Now",
    href: route.href,
  };
}

function getPracticeCue(input) {
  const data = input && typeof input === "object" ? input : { mode: input };
  const mode = normalizeTarget(data.mode || data.target || data.kind);

  const cues = {
    spell: {
      text: "Hear it again, then try the next letter.",
      repeat: true,
      stretch: "next-letter",
    },
    pattern: {
      text: "See it again, then find what comes next.",
      repeat: true,
      stretch: "what-comes-next",
    },
    count: {
      text: "Count it again, then try one more.",
      repeat: true,
      stretch: "one-more",
    },
    patterns: {
      text: "See it again, then find what comes next.",
      repeat: true,
      stretch: "what-comes-next",
    },
    listen: {
      text: "Hear it again, then tap what you heard.",
      repeat: true,
      stretch: "what-you-heard",
    },
    browse: {
      text: "Browse again, then pick one to hear.",
      repeat: true,
      stretch: "pick-one",
    },
  };

  return cues[mode] || {
    text: "Try it again.",
    repeat: true,
    stretch: "repeat",
  };
}

function getReplayActions(entry) {
  if (!entry) return [];

  const actions = [
    { key: "hear-word", label: "Hear word" },
  ];

  if (typeof entry.word === "string" && entry.word.trim().length > 1) {
    actions.push({ key: "hear-letters", label: "Hear letters" });
  }

  if (typeof entry.sound === "string" && entry.sound.trim()) {
    actions.push({ key: "hear-sound", label: "Hear sound" });
  }

  return actions;
}

function getGameFeedback(input) {
  const data = input && typeof input === "object" ? input : {};
  const mode = normalizeTarget(data.mode || data.game);
  const phase = normalizeTarget(data.phase || data.state || "idle");
  const bucketLabel = String(data.bucketLabel || data.categoryLabel || "").trim();

  const byMode = {
    pattern: {
      idle: { text: "Find what comes next.", tone: "neutral" },
      wrong: { text: "Try another one.", tone: "hint" },
      correct: { text: "You found the next one.", tone: "success" },
    },
    memory: {
      idle: { text: "Turn two cards to find a pair.", tone: "neutral" },
      mismatch: { text: "Not a pair. Try another card.", tone: "hint" },
      correct: { text: "You found a pair.", tone: "success" },
    },
    sort: {
      idle: { text: "Put it in the right group.", tone: "neutral" },
      wrong: {
        text: bucketLabel ? `Put it with ${bucketLabel}.` : "Try a different group.",
        tone: "hint",
      },
      correct: { text: "That goes there.", tone: "success" },
    },
    listen: {
      idle: { text: "Listen, then tap the picture.", tone: "neutral" },
      wrong: { text: "Listen again, then tap it.", tone: "hint" },
      correct: { text: "You heard it.", tone: "success" },
    },
  };

  const modeFeedback = byMode[mode] || {};
  return modeFeedback[phase] || modeFeedback.idle || {
    text: "Try again.",
    tone: "neutral",
  };
}

const api = {
  getHomePrimaryAction,
  getGameFeedback,
  getHomeRoute,
  getPracticeCue,
  getReplayActions,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}

if (typeof globalThis !== "undefined") {
  globalThis.EngagementUtils = api;
}
