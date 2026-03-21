# English Play Garden

A small kid-friendly English learning app with:

- tap-to-hear illustrated word cards
- Azure Speech support for clearer voices
- browser voice fallback when Azure is not configured
- a drag-or-tap letter matching mini-game
- simple local progress saved in the browser
- self-hosted local server support with a regular browser link for phones and tablets

## Run it without Vercel

1. Create an Azure Speech resource and get:

- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`

Microsoft’s official pricing page currently lists `0.5 million characters free per month` for neural text-to-speech on the free tier. Source: [Azure Speech pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/).

2. Copy `.env.example` to `.env` and fill in the values:

```bash
cd /Users/ben/Documents/App/General/din-english-playground
cp .env.example .env
```

3. Start the local server:

```bash
cd /Users/ben/Documents/App/General/din-english-playground
npm start
```

4. The terminal will print links like these:

```text
Local:  http://localhost:8123
Mobile: http://192.168.x.x:8123
```

5. To open it on mobile:

- make sure the phone/tablet and the computer are on the same Wi-Fi
- open the `Mobile` link in Safari or Chrome on the phone
- if you want it to feel more like an app, use `Add to Home Screen`

## Notes

- The Azure API key stays on the local server and is never exposed in the browser.
- If Azure is not configured or fails, the app falls back to the device/browser voice.
- `en-US-JennyMultilingualNeural` is the default Azure voice, and you can change voices from the app.
- The app does not require Vercel. Any machine that can run `node server.js` can host it.
- If you later want a public internet link without Vercel, you can put this same app on any Node host or behind your own domain.
