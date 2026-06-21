# English Speaking Practice

A personal language-learning tool for practising free speaking in English (B2 level), built with the Birkenbihl method (decoding + passive listening) combined with shadowing exercises and Amazon Polly audio with karaoke-style word highlighting.

**Live:** [nicdev02.github.io/English-Practice](https://nicdev02.github.io/English-Practice/)

## Features

- **Read tab** — dialog in two views: original English and clean German translation
- **Listen & follow tab** — karaoke-style word highlighting synced to Amazon Polly audio; per-speaker line layout; speaker filter (show only A, B, or both); adjustable playback speed
- **Vocabulary tab** — lesson word list (EN / DE)
- **Setup tab** — optionally override pre-configured audio with your own Polly MP3 URL and Speech Marks file; stored in `localStorage`, never in the lesson file

## Audio workflow

Lessons ship with **pre-configured audio** — no setup needed on any device including mobile. Audio files live in the repo and are embedded at build time:

- MP3 → `public/audio/`
- Speech Marks (`.marks`) → `public/speech-marks/`

Speaker attribution (who said what) comes from the lesson JSON, not the audio. The audio is a flat recording; Amazon Polly's word-level Speech Marks provide only the timestamps for karaoke highlighting.

Send Polly **plain dialog text without speaker labels** — one line per utterance is fine. This gives a 1:1 match between speech marks and displayed words for accurate sync.

Users can always override the default audio per lesson via the Setup tab.

## Tech stack

- Vite + React + TypeScript
- Plain CSS with custom properties (no UI library)
- `localStorage` for per-lesson audio overrides
- Deployed to GitHub Pages via GitHub Actions (auto-deploy on push to `main`)

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/English-Practice/](http://localhost:5173/English-Practice/) in your browser.

```bash
npm run build   # production build
npm run preview # preview the build locally
```

---

## Adding a new lesson

1. Create a new file in [src/data/lessons/](src/data/lessons/) following the naming convention `NN-slug.json`.
2. Use this JSON schema:

```json
{
  "id": "02-my-lesson",
  "title": "My lesson title",
  "eyebrow": "Lesson 02 · Context",
  "tag": "Category",
  "locked": false,
  "lines": [
    { "speaker": "A", "speakerName": "Anna", "text": "Hello." },
    { "speaker": "B", "speakerName": "Ben",  "text": "Hi there." }
  ],
  "decoded": [
    { "speaker": "A", "original": "Hello.", "wordForWord": "Hallo." },
    { "speaker": "B", "original": "Hi there.", "wordForWord": "Hei da drüben." }
  ],
  "cleanTranslation": [
    { "speaker": "A", "text": "Hallo." },
    { "speaker": "B", "text": "Hi." }
  ],
  "vocab": [
    { "en": "example phrase", "de": "Beispielphrase", "note": "optional note" }
  ]
}
```

3. Import the file in [src/data/lessons.ts](src/data/lessons.ts) and add it to the `lessons` array.

### Adding pre-configured audio for a lesson

1. Place the MP3 in `public/audio/` and the `.marks` file in `public/speech-marks/`.
2. In `src/data/lessons.ts`, import the marks file and attach `defaultAudio`:

```ts
import rawMarks02 from '../../public/speech-marks/your-lesson-02.marks?raw'

{
  ...(lesson02 as Lesson),
  defaultAudio: {
    audioUrl: 'audio/your-lesson-02.mp3',
    speechMarks: parseMarks(rawMarks02),
  },
}
```

The speech marks are embedded at build time — no runtime fetch needed.

---

## Generating Amazon Polly audio

1. In the AWS Console, go to **Amazon Polly → Text-to-speech**.
2. Paste the lesson dialog as plain text — **no speaker labels**, just the lines one after another.
3. Engine: **Long-Form** · Language: **English, US** · Voice: **Danielle, Female**
4. Under **Additional settings** → File format: **Speech Marks** → Speech marks types: **Word**.
5. Download the `.mp3` and `.marks` files separately (two export runs needed — one for audio, one for speech marks).
6. Place them in `public/audio/` and `public/speech-marks/`, then wire them up in `lessons.ts` (see above).

Example input for Polly (Lesson 01):
```
Hey Emma, do you have a minute before the meeting?
I wanted to ask you about the dataset.
Sure, what's going on? You sounded a bit stressed in your message.
...
```
