const http = require("node:http");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { URL } = require("node:url");

loadEnv(path.join(__dirname, ".env"));

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8123);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVENLABS_DEFAULT_VOICE = process.env.ELEVENLABS_DEFAULT_VOICE || "Rachel";

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || "";
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "";
const AZURE_SPEECH_DEFAULT_VOICE =
  process.env.AZURE_SPEECH_DEFAULT_VOICE || "en-US-JennyMultilingualNeural";
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || "";
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";

const STATIC_DIR = __dirname;
const AUDIO_CACHE = new Map();
const PHOTO_CACHE = new Map();

const PIXABAY_CATEGORY_MAP = {
  animals: "animals",
  food: "food",
  nature: "nature",
  things: "education",
};

const PIXABAY_COLOR_MAP = {};

const PIXABAY_CATEGORY_KEYWORDS = {
  animals: ["animal", "pet", "wildlife", "cute"],
  food: ["food", "fruit", "dessert", "meal", "drink"],
  nature: ["nature", "outdoors", "sky", "plant", "landscape"],
  things: ["object", "toy", "book", "school", "transport"],
};

const ELEVENLABS_VOICE_CACHE = { expiresAt: 0, voices: [] };
const AZURE_VOICE_CACHE = { expiresAt: 0, voices: [] };

// Track whether ElevenLabs quota is exhausted so we auto-fallback
let elevenLabsQuotaExhausted = false;
let elevenLabsQuotaCheckTime = 0;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

    if (request.method === "GET" && requestUrl.pathname === "/api/voices") {
      return handleVoices(response);
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/tts") {
      return handleTts(request, response);
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/health") {
      return sendJson(response, 200, {
        ok: true,
        elevenlabs: isElevenLabsConfigured(),
        azure: isAzureConfigured(),
        pixabay: isPixabayConfigured(),
        pexels: isPexelsConfigured(),
        elevenLabsQuotaExhausted,
      });
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/photos") {
      return handlePhotos(requestUrl, response);
    }

    if (request.method === "GET") {
      return serveStaticFile(requestUrl.pathname, response);
    }

    sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Internal server error" });
  }
});

server.listen(PORT, HOST, () => {
  console.log("English Play Garden server is ready.");
  console.log(`  Local:   http://localhost:${PORT}`);
  for (const url of getNetworkUrls(PORT)) {
    console.log(`  Mobile:  ${url}`);
  }
  if (isAzureConfigured()) console.log("  Azure TTS: enabled (primary)");
  if (isElevenLabsConfigured()) console.log("  ElevenLabs TTS: enabled (optional)");
  if (isPixabayConfigured()) console.log("  Pixabay photos: enabled (preferred)");
  if (isPexelsConfigured()) console.log("  Pexels photos: enabled (fallback)");
});

// ── Voices ────────────────────────────────────────────────────

async function handleVoices(response) {
  const allVoices = [];
  let defaultVoice = null;

  // Azure voices first
  if (isAzureConfigured()) {
    try {
      const azVoices = await getAzureVoices();
      const filtered = azVoices
        .filter((v) => v.Locale && v.Locale.startsWith("en-"))
        .map((v) => ({
          shortName: `azure:${v.ShortName}`,
          displayName: `${v.LocalName || v.DisplayName} (${v.Locale}) · Azure`,
          locale: v.Locale,
          provider: "azure",
        }));
      allVoices.push(...filtered);
      const azDefault = filtered.find((v) => v.shortName === `azure:${AZURE_SPEECH_DEFAULT_VOICE}`);
      defaultVoice = azDefault ? azDefault.shortName : (filtered[0]?.shortName || null);
    } catch (err) {
      console.error("Failed to fetch Azure voices:", err.message);
    }
  }

  // ElevenLabs voices after Azure
  if (isElevenLabsConfigured()) {
    try {
      const elVoices = await getElevenLabsVoices();
      elVoices.forEach((v) => {
        allVoices.push({
          shortName: `elevenlabs:${v.voice_id}`,
          displayName: `${v.name} (ElevenLabs)`,
          locale: "en-US",
          provider: "elevenlabs",
        });
      });
      if (!defaultVoice) {
        const defaultEl = elVoices.find((v) => v.name === ELEVENLABS_DEFAULT_VOICE);
        defaultVoice = defaultEl ? `elevenlabs:${defaultEl.voice_id}` : (elVoices[0] ? `elevenlabs:${elVoices[0].voice_id}` : null);
      }
    } catch (err) {
      console.error("Failed to fetch ElevenLabs voices:", err.message);
    }
  }

  sendJson(response, 200, {
    configured: allVoices.length > 0,
    voices: allVoices,
    defaultVoice,
    elevenLabsQuotaExhausted,
  });
}

// ── TTS ───────────────────────────────────────────────────────

async function handleTts(request, response) {
  const body = await readJson(request);
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const voice = typeof body.voice === "string" ? body.voice.trim() : "";
  const rate = clampNumber(body.rate, 0.4, 1.3, 0.75);
  const pitch = clampNumber(body.pitch, 0.8, 1.3, 1);
  const spelling = Boolean(body.spelling);

  if (!text) {
    return sendJson(response, 400, { error: "Text is required" });
  }

  const cacheKey = createCacheKey({ text, voice, rate, pitch, spelling });
  const cached = AUDIO_CACHE.get(cacheKey);
  if (cached) {
    response.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": cached.byteLength,
      "Cache-Control": "public, max-age=604800",
    });
    response.end(cached);
    return;
  }

  // Determine provider from voice prefix
  const isElevenLabsVoice = voice.startsWith("elevenlabs:");
  const isAzureVoice = voice.startsWith("azure:");
  const wantsAzureByDefault = !voice && isAzureConfigured();

  let audioBuffer = null;

  // Use Azure first when Azure is configured or explicitly selected
  if (isAzureConfigured() && (isAzureVoice || wantsAzureByDefault)) {
    try {
      const azureVoiceName = isAzureVoice
        ? voice.slice("azure:".length)
        : AZURE_SPEECH_DEFAULT_VOICE;
      audioBuffer = await azureTts(text, azureVoiceName, rate, pitch, spelling);
    } catch (err) {
      console.error("Azure TTS error:", err.message);
    }
  }

  // Use ElevenLabs only when explicitly selected, or when Azure is unavailable
  if (!audioBuffer && isElevenLabsConfigured() && (isElevenLabsVoice || (!voice && !elevenLabsQuotaExhausted && !isAzureConfigured()))) {
    try {
      const voiceId = isElevenLabsVoice ? voice.slice("elevenlabs:".length) : await getDefaultElevenLabsVoiceId();
      if (voiceId) {
        audioBuffer = await elevenLabsTts(text, voiceId, rate, spelling);
        // If we get here, quota is fine
        if (elevenLabsQuotaExhausted) {
          elevenLabsQuotaExhausted = false;
          console.log("ElevenLabs quota restored");
        }
      }
    } catch (err) {
      if (err.quotaExhausted) {
        elevenLabsQuotaExhausted = true;
        elevenLabsQuotaCheckTime = Date.now();
        console.warn("ElevenLabs free quota exhausted, falling back to Azure");
      } else {
        console.error("ElevenLabs TTS error:", err.message);
      }
    }
  }

  // Final Azure fallback if ElevenLabs was explicitly chosen and failed
  if (!audioBuffer && isAzureConfigured() && !wantsAzureByDefault) {
    try {
      const azureVoiceName = isAzureVoice
        ? voice.slice("azure:".length)
        : AZURE_SPEECH_DEFAULT_VOICE;
      audioBuffer = await azureTts(text, azureVoiceName, rate, pitch, spelling);
    } catch (err) {
      console.error("Azure TTS error:", err.message);
    }
  }

  if (!audioBuffer) {
    return sendJson(response, 503, { error: "No TTS provider available" });
  }

  AUDIO_CACHE.set(cacheKey, audioBuffer);
  trimAudioCache();

  response.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Content-Length": audioBuffer.byteLength,
    "Cache-Control": "public, max-age=604800",
  });
  response.end(audioBuffer);
}

// ── Photos ───────────────────────────────────────────────────

async function handlePhotos(requestUrl, response) {
  if (!isPixabayConfigured() && !isPexelsConfigured()) {
    return sendJson(response, 200, { configured: false, photo: null });
  }

  const query = (requestUrl.searchParams.get("query") || "").trim();
  const category = (requestUrl.searchParams.get("category") || "").trim();
  const excludeIds = (requestUrl.searchParams.get("exclude") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!query) {
    return sendJson(response, 400, { error: "Query is required" });
  }

  const cacheKey = `${category}::${query}`.toLowerCase();
  const cached = excludeIds.length ? null : PHOTO_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return sendJson(response, 200, { configured: true, photo: cached.photo });
  }

  try {
    let photo = null;
    if (isPixabayConfigured()) {
      photo = await searchPixabayPhoto(query, category, excludeIds);
    }
    if (!photo && isPexelsConfigured()) {
      photo = await searchPexelsPhoto(query, category, excludeIds);
    }
    if (!excludeIds.length) {
      PHOTO_CACHE.set(cacheKey, {
        photo,
        expiresAt: Date.now() + 1000 * 60 * 60 * 12,
      });
      trimPhotoCache();
    }
    return sendJson(response, 200, { configured: true, photo });
  } catch (error) {
    console.error("Photo search error:", error.message);
    return sendJson(response, 200, { configured: true, photo: null });
  }
}

// ── ElevenLabs ────────────────────────────────────────────────

async function getElevenLabsVoices() {
  if (ELEVENLABS_VOICE_CACHE.expiresAt > Date.now() && ELEVENLABS_VOICE_CACHE.voices.length > 0) {
    return ELEVENLABS_VOICE_CACHE.voices;
  }

  const res = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": ELEVENLABS_API_KEY },
  });

  if (!res.ok) throw new Error(`ElevenLabs voices failed: ${res.status}`);

  const data = await res.json();
  const voices = Array.isArray(data.voices) ? data.voices : [];
  ELEVENLABS_VOICE_CACHE.voices = voices;
  ELEVENLABS_VOICE_CACHE.expiresAt = Date.now() + 1000 * 60 * 60 * 6;
  return voices;
}

async function getDefaultElevenLabsVoiceId() {
  try {
    const voices = await getElevenLabsVoices();
    const match = voices.find((v) => v.name === ELEVENLABS_DEFAULT_VOICE);
    return match ? match.voice_id : (voices[0]?.voice_id || null);
  } catch {
    return null;
  }
}

async function elevenLabsTts(text, voiceId, rate, spelling) {
  // For spelling, add pauses between letters
  const processedText = spelling ? buildElevenLabsSpellingText(text) : text;

  // Map rate (0.4-1.3) to ElevenLabs stability (higher rate = lower stability for faster feel)
  const stability = clampNumber(1.1 - rate * 0.5, 0.3, 0.9, 0.5);

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: processedText,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability,
        similarity_boost: 0.75,
        style: 0.1,
        use_speaker_boost: true,
      },
    }),
  });

  if (res.status === 401 || res.status === 403 || res.status === 429) {
    const err = new Error("ElevenLabs quota exhausted");
    err.quotaExhausted = true;
    throw err;
  }

  if (!res.ok) {
    throw new Error(`ElevenLabs TTS failed: ${res.status}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

function buildElevenLabsSpellingText(text) {
  return text
    .split("")
    .filter((ch) => ch.trim().length > 0)
    .map((ch) => `${ch.toUpperCase()}.`)
    .join(" ... ");
}

// ── Azure ─────────────────────────────────────────────────────

async function getAzureVoices() {
  if (AZURE_VOICE_CACHE.expiresAt > Date.now() && AZURE_VOICE_CACHE.voices.length > 0) {
    return AZURE_VOICE_CACHE.voices;
  }

  const res = await fetch(
    `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`,
    { headers: { "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY } }
  );

  if (!res.ok) throw new Error(`Azure voice list failed: ${res.status}`);

  const voices = await res.json();
  AZURE_VOICE_CACHE.voices = Array.isArray(voices) ? voices : [];
  AZURE_VOICE_CACHE.expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  return AZURE_VOICE_CACHE.voices;
}

async function azureTts(text, voiceName, rate, pitch, spelling) {
  const ssml = buildSsml({ text, voice: voiceName, rate, pitch, spelling });

  const res = await fetch(
    `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "din-english-play-garden",
      },
      body: ssml,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Azure TTS ${res.status}: ${errText}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

function buildSsml({ text, voice, rate, pitch, spelling }) {
  const escaped = escapeXml(text);
  const ratePercent = `${Math.round((rate - 1) * 100)}%`;
  const pitchPercent = `${Math.round((pitch - 1) * 100)}%`;
  const content = spelling ? buildAzureSpellingMarkup(text) : escaped;

  return [
    '<speak version="1.0" xml:lang="en-US" xmlns="http://www.w3.org/2001/10/synthesis">',
    `  <voice name="${escapeXml(voice)}">`,
    `    <prosody rate="${ratePercent}" pitch="${pitchPercent}">`,
    `      ${content}`,
    "    </prosody>",
    "  </voice>",
    "</speak>",
  ].join("\n");
}

function buildAzureSpellingMarkup(text) {
  return text
    .split("")
    .filter((letter) => letter.trim().length > 0)
    .map((letter) => `${escapeXml(letter)}<break time="320ms"/>`)
    .join("");
}

async function searchPexelsPhoto(query, category, excludeIds = []) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "20");
  url.searchParams.set("orientation", "square");
  url.searchParams.set("size", "medium");
  url.searchParams.set("locale", "en-US");

  const res = await fetch(url, {
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`Pexels search failed: ${res.status}`);
  }

  const data = await res.json();
  const photos = Array.isArray(data.photos) ? data.photos : [];
  const bestPhoto = chooseBestPexelsPhoto(photos, category, query, excludeIds);

  if (!bestPhoto) return null;

  return {
    id: bestPhoto.id,
    src: bestPhoto.src?.large || bestPhoto.src?.medium || bestPhoto.src?.original || "",
    gridSrc: bestPhoto.src?.medium || bestPhoto.src?.small || bestPhoto.src?.large || bestPhoto.src?.original || "",
    alt: bestPhoto.alt || query,
    photographer: bestPhoto.photographer || "Pexels",
    photographerUrl: bestPhoto.photographer_url || "https://www.pexels.com",
    url: bestPhoto.url || "https://www.pexels.com",
  };
}

function chooseBestPexelsPhoto(photos, category, query, excludeIds = []) {
  const blockedTerms = [
    "blood", "knife", "weapon", "scary", "horror", "alcohol", "beer", "wine", "cocktail",
    "cigarette", "smoke", "nude", "dead", "injury", "monster", "dark", "creepy",
  ];
  const preferredTerms = ["cute", "bright", "colorful", "happy", "playful", "friendly", "soft", "kid", "child"];
  const categoryTerms = {
    animals: ["pet", "cute", "friendly"],
    food: ["fresh", "fruit", "colorful"],
    nature: ["sunny", "green", "bright"],
    things: ["clean", "simple", "colorful"],
    body: ["simple", "learning", "friendly"],
    colors: ["bright", "colorful"],
    numbers: ["counting", "toy", "blocks"],
  };

  const safePhotos = [...photos]
    .filter((photo) => {
      const text = `${photo.alt || ""} ${photo.url || ""}`.toLowerCase();
      return !blockedTerms.some((term) => text.includes(term));
    });
  const withoutDuplicates = safePhotos.filter((photo) => !excludeIds.includes(String(photo.id)));
  const pool = withoutDuplicates.length ? withoutDuplicates : safePhotos;

  return pool
    .sort((a, b) => scorePexelsPhoto(b, preferredTerms, categoryTerms[category] || [], query) - scorePexelsPhoto(a, preferredTerms, categoryTerms[category] || [], query))[0] || null;
}

function scorePexelsPhoto(photo, preferredTerms, categoryTerms, query) {
  const text = `${photo.alt || ""} ${photo.url || ""}`.toLowerCase();
  const tokens = String(query || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !["photo", "single", "bright", "simple", "clean", "object", "scene", "daylight", "background"].includes(token));
  let score = 0;

  for (const term of preferredTerms) {
    if (text.includes(term)) score += 2;
  }

  for (const term of categoryTerms) {
    if (text.includes(term)) score += 3;
  }

  if (photo.width && photo.height && Math.abs(photo.width - photo.height) < 700) {
    score += 1;
  }

  for (const token of tokens) {
    if (text.includes(token)) score += 5;
  }

  return score;
}

async function searchPixabayPhoto(query, category, excludeIds = []) {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.set("key", PIXABAY_API_KEY);
  url.searchParams.set("q", query);
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("safesearch", "true");
  url.searchParams.set("lang", "en");
  url.searchParams.set("per_page", "30");
  url.searchParams.set("order", "popular");

  const mappedCategory = PIXABAY_CATEGORY_MAP[category];
  if (mappedCategory) url.searchParams.set("category", mappedCategory);

  const color = PIXABAY_COLOR_MAP[category];
  if (color) url.searchParams.set("colors", color);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Pixabay search failed: ${res.status}`);
  }

  const data = await res.json();
  const photos = Array.isArray(data.hits) ? data.hits : [];
  const bestPhoto = chooseBestPixabayPhoto(photos, category, query, excludeIds);
  if (!bestPhoto) return null;

  return {
    id: bestPhoto.id,
    src: bestPhoto.webformatURL || bestPhoto.largeImageURL || bestPhoto.previewURL || "",
    gridSrc: bestPhoto.previewURL || bestPhoto.webformatURL || bestPhoto.largeImageURL || "",
    alt: bestPhoto.tags || query,
    photographer: bestPhoto.user || "Pixabay",
    photographerUrl: `https://pixabay.com/users/${bestPhoto.user || "pixabay"}-${bestPhoto.user_id || ""}/`,
    url: bestPhoto.pageURL || "https://pixabay.com",
    provider: "pixabay",
  };
}

function chooseBestPixabayPhoto(photos, category, query, excludeIds = []) {
  const safePhotos = [...photos].filter((photo) => !excludeIds.includes(String(photo.id)));
  const pool = safePhotos.length ? safePhotos : photos;

  return pool
    .sort((a, b) => scorePixabayPhoto(b, category, query) - scorePixabayPhoto(a, category, query))[0] || null;
}

function scorePixabayPhoto(photo, category, query) {
  const text = `${photo.tags || ""} ${photo.type || ""}`.toLowerCase();
  const tokens = String(query || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !["photo", "single", "bright", "simple", "clean", "object", "scene", "daylight", "background"].includes(token));

  let score = 0;
  for (const token of tokens) {
    if (text.includes(token)) score += 6;
  }

  if (PIXABAY_CATEGORY_KEYWORDS[category]) {
    for (const term of PIXABAY_CATEGORY_KEYWORDS[category]) {
      if (text.includes(term)) score += 3;
    }
  }

  if (photo.imageWidth && photo.imageHeight && photo.imageWidth >= 500 && photo.imageHeight >= 500) {
    score += 2;
  }

  if (typeof photo.likes === "number") score += Math.min(photo.likes / 30, 4);
  if (typeof photo.downloads === "number") score += Math.min(photo.downloads / 5000, 3);

  return score;
}

// ── Static Files ──────────────────────────────────────────────

function serveStaticFile(requestPath, response) {
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const safePath = path.normalize(normalized).replace(/^(\.\.[/\\])+/, "");
  const pathSegments = safePath.split(/[\\/]/).filter(Boolean);
  if (pathSegments.some((segment) => segment.startsWith("."))) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }
  const filePath = path.join(STATIC_DIR, safePath);

  if (!filePath.startsWith(STATIC_DIR)) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    });
    response.end(data);
  });
}

// ── Helpers ───────────────────────────────────────────────────

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
}

function isElevenLabsConfigured() {
  return Boolean(ELEVENLABS_API_KEY && !ELEVENLABS_API_KEY.startsWith("your_"));
}

function isAzureConfigured() {
  return Boolean(AZURE_SPEECH_KEY && AZURE_SPEECH_REGION && !AZURE_SPEECH_KEY.startsWith("your_") && !AZURE_SPEECH_REGION.startsWith("your_"));
}

function isPexelsConfigured() {
  return Boolean(PEXELS_API_KEY && !PEXELS_API_KEY.startsWith("your_"));
}

function isPixabayConfigured() {
  return Boolean(PIXABAY_API_KEY && !PIXABAY_API_KEY.startsWith("your_"));
}

function createCacheKey(payload) {
  return crypto.createHash("sha1").update(JSON.stringify(payload)).digest("hex");
}

function trimAudioCache() {
  const keys = [...AUDIO_CACHE.keys()];
  while (keys.length > 80) {
    AUDIO_CACHE.delete(keys.shift());
  }
}

function trimPhotoCache() {
  const keys = [...PHOTO_CACHE.keys()];
  while (keys.length > 120) {
    PHOTO_CACHE.delete(keys.shift());
  }
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (Number.isNaN(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function escapeXml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
    request.on("error", reject);
  });
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function getNetworkUrls(port) {
  const interfaces = os.networkInterfaces();
  const urls = [];

  for (const entries of Object.values(interfaces)) {
    if (!Array.isArray(entries)) continue;
    for (const details of entries) {
      if (!details || details.internal || details.family !== "IPv4") continue;
      urls.push(`http://${details.address}:${port}`);
    }
  }

  return [...new Set(urls)];
}

// Reset ElevenLabs quota flag every hour (in case quota resets)
setInterval(() => {
  if (elevenLabsQuotaExhausted && Date.now() - elevenLabsQuotaCheckTime > 1000 * 60 * 60) {
    elevenLabsQuotaExhausted = false;
    console.log("Retrying ElevenLabs (hourly quota check)");
  }
}, 1000 * 60 * 60);
