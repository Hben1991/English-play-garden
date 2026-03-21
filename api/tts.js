const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVENLABS_DEFAULT_VOICE = process.env.ELEVENLABS_DEFAULT_VOICE || "Rachel";
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || "";
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "";
const AZURE_SPEECH_DEFAULT_VOICE = process.env.AZURE_SPEECH_DEFAULT_VOICE || "en-US-JennyMultilingualNeural";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const voice = typeof body.voice === "string" ? body.voice.trim() : "";
  const rate = clampNumber(body.rate, 0.4, 1.3, 0.75);
  const pitch = clampNumber(body.pitch, 0.8, 1.3, 1);
  const spelling = Boolean(body.spelling);

  if (!text) return res.status(400).json({ error: "Text is required" });

  const isElevenLabsVoice = voice.startsWith("elevenlabs:");
  const isAzureVoice = voice.startsWith("azure:");
  const wantsAzureByDefault = !voice && isAzureConfigured();

  let audioBuffer = null;

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

  if (!audioBuffer && isElevenLabsConfigured() && (isElevenLabsVoice || (!voice && !isAzureConfigured()))) {
    try {
      let voiceId;
      if (isElevenLabsVoice) {
        voiceId = voice.slice("elevenlabs:".length);
      } else {
        voiceId = await getDefaultElevenLabsVoiceId();
      }
      if (voiceId) {
        audioBuffer = await elevenLabsTts(text, voiceId, rate, spelling);
      }
    } catch (err) {
      console.error("ElevenLabs TTS error:", err.message);
    }
  }

  if (!audioBuffer && isAzureConfigured()) {
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
    return res.status(503).json({ error: "No TTS provider available" });
  }

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Cache-Control", "public, max-age=604800");
  res.status(200).send(Buffer.from(audioBuffer));
};

// ── ElevenLabs ────────────────────────────────────────────────

async function getDefaultElevenLabsVoiceId() {
  try {
    const elRes = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": ELEVENLABS_API_KEY },
    });
    if (!elRes.ok) return null;
    const data = await elRes.json();
    const voices = Array.isArray(data.voices) ? data.voices : [];
    const match = voices.find((v) => v.name === ELEVENLABS_DEFAULT_VOICE);
    return match ? match.voice_id : (voices[0]?.voice_id || null);
  } catch {
    return null;
  }
}

async function elevenLabsTts(text, voiceId, rate, spelling) {
  const processedText = spelling ? buildElevenLabsSpellingText(text) : text;
  const stability = clampNumber(1.1 - rate * 0.5, 0.3, 0.9, 0.5);

  const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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

  if (elRes.status === 401 || elRes.status === 403 || elRes.status === 429) {
    throw new Error("ElevenLabs quota exhausted");
  }
  if (!elRes.ok) throw new Error(`ElevenLabs TTS failed: ${elRes.status}`);

  return Buffer.from(await elRes.arrayBuffer());
}

function buildElevenLabsSpellingText(text) {
  return text
    .split("")
    .filter((ch) => ch.trim().length > 0)
    .map((ch) => `${ch.toUpperCase()}.`)
    .join(" ... ");
}

// ── Azure ─────────────────────────────────────────────────────

async function azureTts(text, voiceName, rate, pitch, spelling) {
  const ssml = buildSsml({ text, voice: voiceName, rate, pitch, spelling });

  const azRes = await fetch(
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

  if (!azRes.ok) {
    const errText = await azRes.text();
    throw new Error(`Azure TTS ${azRes.status}: ${errText}`);
  }

  return Buffer.from(await azRes.arrayBuffer());
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

// ── Helpers ───────────────────────────────────────────────────

function isElevenLabsConfigured() {
  return Boolean(ELEVENLABS_API_KEY && !ELEVENLABS_API_KEY.startsWith("your_"));
}

function isAzureConfigured() {
  return Boolean(AZURE_SPEECH_KEY && AZURE_SPEECH_REGION && !AZURE_SPEECH_KEY.startsWith("your_") && !AZURE_SPEECH_REGION.startsWith("your_"));
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
