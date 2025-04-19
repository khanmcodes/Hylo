3. MVP Development Plan
   🔹 Phase 1: Setup & Upload Flow
   React Native app to pick a document from device.

Send to backend API (Flask/Node on Render/Vercel).

🔹 Phase 2: Backend Parsing & Dialogue
Parse content → segment into topics

Use OpenRouter or GPT-3.5 API to generate a 2-person conversation per topic

Return script to frontend

🔹 Phase 3: TTS Audio Generation
Use Coqui TTS (free, local) or Google Cloud TTS (1M chars/month free)

Generate two voices, merge with FFmpeg

Upload to Firebase or serve directly

🔹 Phase 4: Podcast Player + Interactivity
Build player in React Native

Add text/voice input (using Expo Speech & Expo Speech-to-Text or Mozilla DeepSpeech)

Midway, user can:

Ask a question (text/voice)

App pauses → sends query to backend → gets response from GPT → plays answer
