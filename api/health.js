module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
  const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY || "";
  const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "";

  res.status(200).json({
    ok: true,
    elevenlabs: Boolean(ELEVENLABS_API_KEY && !ELEVENLABS_API_KEY.startsWith("your_")),
    azure: Boolean(AZURE_SPEECH_KEY && AZURE_SPEECH_REGION && !AZURE_SPEECH_KEY.startsWith("your_") && !AZURE_SPEECH_REGION.startsWith("your_")),
  });
};
