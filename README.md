# English Speaking Practice

A personal language-learning tool for practising free speaking in English (B2 level), built with the Birkenbihl method (decoding + passive listening) combined with shadowing exercises and Amazon Polly audio with karaoke-style word highlighting.

**Live:** [nicdev02.github.io/English-Practice](https://nicdev02.github.io/English-Practice/)

## Features

- **Read tab** — dialog in two views: original English and clean German translation
- **Listen & follow tab** — karaoke-style word highlighting synced to Amazon Polly audio; click any word to jump to that position and start playback; per-speaker line layout; speaker filter (show only A, B, or both); adjustable playback speed
- **Vocabulary tab** — lesson word list (EN / DE)

## Audio workflow

Lessons ship with **pre-configured audio** — no setup needed on any device including mobile. Audio files live in the repo and are embedded at build time:

- MP3 → `public/audio/`
- Speech Marks (`.marks`) → `public/speech-marks/`

Speaker attribution (who said what) comes from the lesson JSON, not the audio. The audio is a flat recording; Amazon Polly's word-level Speech Marks provide only the timestamps for karaoke highlighting.

Send Polly **plain dialog text without speaker labels** — one line per utterance is fine. This gives a 1:1 match between speech marks and displayed words for accurate sync.

Note: em dashes (`—`) are skipped during sync matching because Polly doesn't produce a speech mark for them. Underscore-joined identifiers (e.g. `flag_outliers`) are split by Polly into separate marks (`flag_`, `outliers`) and automatically re-joined during matching. The sync stays accurate in both cases.

## Tech stack

- Vite + React + TypeScript
- Plain CSS with custom properties (no UI library)
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

The `tag` must match one of the dashboard categories: `"Uni / Data Science"`, `"Konferenz"`, or `"Alltag"`.

```json
{
  "id": "05-my-lesson",
  "title": "My lesson title",
  "eyebrow": "Einheit 1 · Context",
  "tag": "Uni / Data Science",
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
import rawMarks03 from '../../public/speech-marks/your-lesson-03.marks?raw'

{
  ...(lesson03 as Lesson),
  defaultAudio: {
    audioUrl: 'audio/your-lesson-03.mp3',
    speechMarks: parseMarks(rawMarks03),
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

Example input for Polly (Lesson 03):
```
Are you heading off soon? It's almost five.
Yeah, nearly. What are you up to this weekend?
Nothing special — maybe a walk if the weather holds. What about you?
...
```

---

## Planned lessons

### Uni / Data Science

- **Presenting to non-technical people** — Sarah explains a model without jargon to her professor or a stakeholder
- **Disagreeing in a meeting** — politely but clearly pushing back on someone else's point
- **Asking for feedback on a paper** — giving and receiving written feedback on a draft
- **The job interview** — Emma plays the interviewer; how to talk about your work under pressure

### Alltag

- **Canceling plans** — short-notice apologies, rescheduling, common polite excuses
- **At the doctor's** — describing symptoms, asking questions, understanding what's said
- **Something went wrong** — politely complaining (wrong order, lost parcel) without sounding aggressive
- **Small talk at a party** — starting conversations with strangers, keeping them going, graceful exits

### Fortgeschritten

- **I don't understand** — asking targeted follow-up questions without seeming incompetent ("Could you walk me through that again?")
- **Writing that email** — Sarah and Emma discuss how to phrase a tricky message (too harsh? too soft?)
