# English Speaking Practice

A personal language-learning tool for practising free speaking in English (B2 level), built with the Birkenbihl method (decoding + passive listening) combined with shadowing exercises and Amazon Polly audio with karaoke-style word highlighting.

## Features

- **Read tab** — dialog in three views: original English, Birkenbihl word-for-word decoding, and clean German translation
- **Listen & follow tab** — karaoke-style word highlighting synced to Amazon Polly audio; speaker filter; adjustable playback speed
- **Vocabulary tab** — lesson word list (EN / DE)
- **Setup tab** — paste in a Polly MP3 URL and Speech Marks JSON; stored locally in `localStorage`, never in the lesson file
- **Routine box** — collapsible 5-day practice routine with notes on speaking inhibition

## Tech stack

- Vite + React + TypeScript
- Plain CSS with custom properties (no UI library)
- `localStorage` for audio URLs and speech marks
- Deployable to GitHub Pages

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173/english-speaking-practice/](http://localhost:5173/english-speaking-practice/) in your browser.

### Build & preview

```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages

1. In [vite.config.ts](vite.config.ts), set `base` to your repository name:
   ```ts
   base: '/your-repo-name/',
   ```
2. Push to GitHub, enable Pages (Settings → Pages → Deploy from branch `gh-pages`), and run:
   ```bash
   npm run build
   # then push the dist/ folder to the gh-pages branch, or use the gh-pages npm package
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

3. Import the new file in [src/data/lessons.ts](src/data/lessons.ts) and add it to the `lessons` array.

> **Note:** `audioUrl` and `speechMarks` are intentionally **not** stored in the JSON file. They are entered via the in-app Setup tab and stored in `localStorage` per lesson. This keeps lesson files portable and versionable without embedding binary links.

---

## Connecting Amazon Polly audio

1. In the AWS Console, go to **Amazon Polly → Text-to-speech**.
2. Paste the full lesson dialog as plain text (or the individual lines).
3. Choose a **Neural** English voice (e.g. *Joanna* or *Amy*).
4. Under **Additional settings**, enable **Speech Marks** → type: **word**.
5. Synthesise to S3 (or download locally):
   - The `.mp3` file is your audio URL.
   - The `.marks` file contains newline-delimited JSON like:
     ```
     {"time":373,"type":"word","start":5,"end":8,"value":"had"}
     {"time":490,"type":"word","start":9,"end":12,"value":"the"}
     ```
6. In the app, open the lesson → **Setup tab** → paste the URL and the full Speech Marks text → click **Connect this audio**.
7. Switch to **Listen & follow** — the player and karaoke highlighting will be active.

---

## Practice routine

| Day | Activity |
|-----|----------|
| Day 1 | **Decode** — read the dialog with the Birkenbihl word-for-word translation |
| Day 1–2 | **Active listening** — listen to Polly audio while reading the original text |
| Day 2–4 | **Passive listening** — play audio in the background without actively reading |
| From Day 3 | **Shadowing** — play audio and speak slightly behind it |
| Day 5 | **Free speaking** — reproduce a role from memory without audio |

> If a word escapes you while speaking freely, say *"ähm, what's the word —"* out loud and keep going. Continuing despite a gap is the actual skill, not perfection.
