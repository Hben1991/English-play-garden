const PIANO_TOPICS = {
  letters: {
    key: "letters",
    label: "Letters",
    prompt: "Tap a letter.",
    replayLabel: "Hear again",
  },
  words: {
    key: "words",
    label: "Words",
    prompt: "Tap a word.",
    replayLabel: "Hear again",
  },
  colors: {
    key: "colors",
    label: "Colors",
    prompt: "Tap a color.",
    replayLabel: "Hear again",
  },
  shapes: {
    key: "shapes",
    label: "Shapes",
    prompt: "Tap a shape.",
    replayLabel: "Hear again",
  },
  consonants: {
    key: "consonants",
    label: "Consonants",
    prompt: "Tap a consonant.",
    replayLabel: "Hear again",
  },
  numbers: {
    key: "numbers",
    label: "Numbers",
    prompt: "Tap a number.",
    replayLabel: "Hear again",
  },
};

const PIANO_TOPIC_KEYS = Object.keys(PIANO_TOPICS);

const PIANO_STATIC_KEY_MODELS = {
  letters: [
    { key: "A", label: "A" },
    { key: "B", label: "B" },
    { key: "C", label: "C" },
    { key: "D", label: "D" },
  ],
  consonants: [
    { key: "B", label: "B" },
    { key: "M", label: "M" },
    { key: "S", label: "S" },
    { key: "T", label: "T" },
  ],
  shapes: [
    { key: "circle", label: "circle" },
    { key: "square", label: "square" },
    { key: "triangle", label: "triangle" },
    { key: "star", label: "star" },
  ],
};

const PIANO_DYNAMIC_KEY_LIMIT = 6;

function normalizePianoTopic(topic) {
  const key = String(topic || "").trim().toLowerCase();
  return PIANO_TOPICS[key] ? key : "letters";
}

function getPianoTopicConfig(topic) {
  const config = PIANO_TOPICS[normalizePianoTopic(topic)];
  return {
    key: config.key,
    label: config.label,
    prompt: config.prompt,
    replayLabel: config.replayLabel,
  };
}

function getNextPianoGuidedTarget(keySet, previousTarget) {
  const models = Array.isArray(keySet) ? keySet.map(normalizePianoKeyModel).filter(Boolean) : [];
  if (!models.length) {
    return null;
  }

  const previousKey = normalizePianoKeyModel(previousTarget)?.key || "";
  const previousIndex = models.findIndex((model) => model.key === previousKey);
  const nextIndex = previousIndex >= 0 ? (previousIndex + 1) % models.length : 0;
  const next = models[nextIndex];
  return {
    key: next.key,
    label: next.label,
  };
}

function normalizePianoKeyModel(item) {
  if (item && typeof item === "object") {
    const key = String(
      item.key !== undefined ? item.key : item.label !== undefined ? item.label : "",
    ).trim();
    const label = String(
      item.label !== undefined ? item.label : item.key !== undefined ? item.key : "",
    ).trim();

    if (!key && !label) {
      return null;
    }

    return {
      ...item,
      key: key || label,
      label: label || key,
    };
  }

  const value = String(item ?? "").trim();
  if (!value) {
    return null;
  }

  return { key: value, label: value };
}

function clonePianoKeyModels(models) {
  return models.map((model) => ({ key: model.key, label: model.label }));
}

function sortPianoKeyModels(models) {
  return models.slice().sort((left, right) => {
    const leftIsNumber = left.key !== "" && !Number.isNaN(Number(left.key));
    const rightIsNumber = right.key !== "" && !Number.isNaN(Number(right.key));

    if (leftIsNumber && rightIsNumber) {
      const keyDelta = Number(left.key) - Number(right.key);
      if (keyDelta !== 0) return keyDelta;
    } else if (left.key < right.key) {
      return -1;
    } else if (left.key > right.key) {
      return 1;
    }

    if (left.label < right.label) return -1;
    if (left.label > right.label) return 1;
    return 0;
  });
}

function getPianoNumberSortValue(model) {
  if (!model) return Number.POSITIVE_INFINITY;
  if (typeof model.numberValue === "number" && Number.isFinite(model.numberValue)) {
    return model.numberValue;
  }

  const parsedKey = Number(model.key);
  if (Number.isFinite(parsedKey)) return parsedKey;

  const parsedLabel = Number(model.label);
  if (Number.isFinite(parsedLabel)) return parsedLabel;

  return Number.POSITIVE_INFINITY;
}

function sortPianoNumberModels(models) {
  return models.slice().sort((left, right) => {
    const leftValue = getPianoNumberSortValue(left);
    const rightValue = getPianoNumberSortValue(right);

    if (leftValue !== rightValue) {
      return leftValue - rightValue;
    }

    return sortPianoKeyModels([left, right])[0] === left ? -1 : 1;
  });
}

function getStablePianoKeySet(topic, sourcePool) {
  const normalizedTopic = normalizePianoTopic(topic);
  if (PIANO_STATIC_KEY_MODELS[normalizedTopic]) {
    return clonePianoKeyModels(PIANO_STATIC_KEY_MODELS[normalizedTopic]);
  }

  const pool = Array.isArray(sourcePool) ? sourcePool : [];
  const normalizedPool = pool
    .map(normalizePianoKeyModel)
    .filter(Boolean);

  if (normalizedTopic === "colors" || normalizedTopic === "numbers") {
    const hasCategoryFields = pool.some((item) => item && typeof item === "object" && item.category !== undefined);
    const models = hasCategoryFields
      ? pool
          .filter((item) => {
            if (!item || typeof item !== "object") {
              return true;
            }

            return item.category === normalizedTopic || item.category === undefined;
          })
          .map(normalizePianoKeyModel)
          .filter(Boolean)
      : normalizedPool;

    const sorted = normalizedTopic === "numbers"
      ? sortPianoNumberModels(models)
      : sortPianoKeyModels(models);

    return sorted.slice(0, PIANO_DYNAMIC_KEY_LIMIT);
  }

  const sorted = sortPianoKeyModels(normalizedPool);
  return sorted.slice(0, PIANO_DYNAMIC_KEY_LIMIT);
}

function getInitialPianoTopicState(savedTopic) {
  return {
    topic: getLastUsedPianoTopic(savedTopic),
  };
}

function getLastUsedPianoTopic(savedTopic) {
  return normalizePianoTopic(savedTopic);
}

function getPianoGuidedPrompt(topic, target) {
  const normalizedTopic = normalizePianoTopic(topic);
  const model = normalizePianoKeyModel(target);
  const verb = normalizedTopic === "letters" || normalizedTopic === "consonants" || normalizedTopic === "numbers"
    ? "Tap"
    : "Find";
  if (!model) {
    return getPianoTopicConfig(normalizedTopic).prompt;
  }

  const label = model.label || model.key || getPianoTopicConfig(normalizedTopic).prompt;
  if (!label) {
    return getPianoTopicConfig(normalizedTopic).prompt;
  }

  const promptLabel = normalizedTopic === "letters" || normalizedTopic === "consonants"
    ? label.toUpperCase()
    : label;

  return `${verb} ${promptLabel}.`;
}

function getPianoReplayText(topic) {
  return getPianoTopicConfig(topic).replayLabel;
}

function getPianoAudioPolicy(topic) {
  return {
    replaySource: "current-prompt",
    autoRepeatGuidedPrompt: false,
  };
}

function getPianoLiveAnnouncement(topic, promptText) {
  const config = getPianoTopicConfig(topic);
  const prompt = String(promptText || config.prompt || "").trim() || config.prompt;
  return `${config.label}. ${prompt}`.trim();
}

function getPianoFocusRestoreKey(keySet, preferredKey) {
  const nextKey = String(preferredKey || "").trim();
  if (!nextKey) {
    return "";
  }

  const models = Array.isArray(keySet) ? keySet.map(normalizePianoKeyModel).filter(Boolean) : [];
  return models.some((model) => model.key === nextKey) ? nextKey : "";
}

function getClearedPianoTransientState(currentState) {
  return {
    ...(currentState || {}),
    lastPlayedKey: "",
    playedKeyTimer: null,
    focusKey: "",
  };
}

const api = {
  PIANO_TOPICS,
  PIANO_TOPIC_KEYS,
  PIANO_STATIC_KEY_MODELS,
  getClearedPianoTransientState,
  getPianoFocusRestoreKey,
  getInitialPianoTopicState,
  getLastUsedPianoTopic,
  getPianoAudioPolicy,
  getPianoGuidedPrompt,
  getPianoLiveAnnouncement,
  getNextPianoGuidedTarget,
  getPianoReplayText,
  getPianoTopicConfig,
  getStablePianoKeySet,
  normalizePianoTopic,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}

if (typeof globalThis !== "undefined") {
  globalThis.PianoActivity = api;
}
