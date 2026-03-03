# AI Setup (ChatGPT / Gemini)

This app now includes secure serverless endpoints:
- `/api/generate-message`
- `/api/generate-image`

## 1) Deploy where serverless functions run
Use Vercel (recommended) or any platform that supports Node serverless APIs.

## 2) Configure environment variables on server
Set at least one provider key:

- `OPENAI_API_KEY` (for ChatGPT + OpenAI image)
- OR `GEMINI_API_KEY` (for Gemini text/image)

Optional model overrides:
- `OPENAI_TEXT_MODEL`
- `OPENAI_IMAGE_MODEL`
- `GEMINI_TEXT_MODEL`
- `GEMINI_IMAGE_MODEL`

## 3) Connect frontend to backend
In the app banner, click **Configure AI** and enter your backend URL, e.g.

`https://your-ai-backend.vercel.app`

If empty, frontend calls local `/api` (same-origin).

## 4) Use in app
- Select provider: `Auto`, `ChatGPT`, or `Gemini`
- Click **AI Message** to generate text
- Click **AI Image** to generate artwork and place it on card

## Notes
- Never put API keys in `index.html` or `app.js`.
- If both keys exist and provider is `Auto`, app uses OpenAI first.
- Current app can stay on GitHub Pages while AI backend runs separately.
