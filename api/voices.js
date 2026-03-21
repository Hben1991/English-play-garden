const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVENLABS_DEFAULT_VOICE = process.env.ELEVENLABS_DEFAULT_VOICE || "Rachel";
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || "";
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "";
const AZURE_SPEECH_DEFAULT_VOICE = process.env.AZURE_SPEECH_DEFAULT_VOICE || "en-US-JennyMultilingualNeural";

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const allVoices = [];
  let defaultVoice = null;

  // Azure first so production matches the local Node server behavior
  if (isAzureConfigured()) {
    try {
      const azRes = await fetch(
        `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list`,
        { headers: { "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY } }
      );
      if (azRes.ok) {
        const voices = await azRes.json();
        const filtered = (Array.isArray(voices) ? voices : [])
          .filter((v) => v.Locale && v.Locale.startsWith("en-"))
          .map((v) => ({
            shortName: `azure:${v.ShortName}`,
            displayName: `${v.LocalName || v.DisplayName} (${v.Locale}) · Azure`,
            locale: v.Locale,
            provider: "azure",
          }));
        allVoices.push(...filtered);
        const azDef = filtered.find((v) => v.shortName === `azure:${AZURE_SPEECH_DEFAULT_VOICE}`);
        defaultVoice = azDef ? azDef.shortName : (filtered[0]?.shortName || null);
      }
    } catch (err) {
      console.error("Azure voices error:", err.message);
    }
  }

  if (isElevenLabsConfigured()) {
    try {
      const elRes = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": ELEVENLABS_API_KEY },
      });
      if (elRes.ok) {
        const data = await elRes.json();
        const voices = Array.isArray(data.voices) ? data.voices : [];
        voices.forEach((v) => {
          allVoices.push({
            shortName: `elevenlabs:${v.voice_id}`,
            displayName: `${v.name} (ElevenLabs)`,
            locale: "en-US",
            provider: "elevenlabs",
          });
        });
        if (!defaultVoice) {
          const match = voices.find((v) => v.name === ELEVENLABS_DEFAULT_VOICE);
          defaultVoice = match ? `elevenlabs:${match.voice_id}` : (voices[0] ? `elevenlabs:${voices[0].voice_id}` : null);
        }
      }
    } catch (err) {
      console.error("ElevenLabs voices error:", err.message);
    }
  }

  res.status(200).json({ configured: allVoices.length > 0, voices: allVoices, defaultVoice });
};

function isElevenLabsConfigured() {
  return Boolean(ELEVENLABS_API_KEY && !ELEVENLABS_API_KEY.startsWith("your_"));
}

function isAzureConfigured() {
  return Boolean(AZURE_SPEECH_KEY && AZURE_SPEECH_REGION && !AZURE_SPEECH_KEY.startsWith("your_") && !AZURE_SPEECH_REGION.startsWith("your_"));
}
