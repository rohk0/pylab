# pylab

An AI-powered Python learning workbench that runs entirely in the browser. No backend, no build step. Real Python via [Pyodide](https://pyodide.org). Real AI via [Groq](https://groq.com).

## What's in it

### Learning experiences
- **Lessons** — typed-code exercises across 8 units, each auto-graded.
- **Challenges** — 20+ hand-curated problems plus AI-generated ones on demand.
- **Daily Practice** — AI generates a fresh challenge each day, scaled to your level.
- **Playground** — full Python editor with file persistence, shareable URLs, stdin.
- **Quizzes** — MCQ, fill-in, predict-output, debug-the-code. Generate more with AI.
- **Flashcards** — flip-card review with favorites and self-rated spacing.
- **Reference** — searchable cheat sheets (built-ins, methods, slicing, …).
- **Projects** — guided builds; AI can generate new ones to match your interest.
- **Skill tree** + achievements.
- **Notes** — local-only, searchable, exportable.

### AI features
- **AI Coach** — every coding exercise has a progressive hint ladder (nudge → strong hint → almost there → reveal).
- **AI Reviewer** — after you pass, get a senior-dev style code review.
- **AI Debugger** — when checks fail, AI explains what went wrong and points at the fix.
- **AI Lesson Explainer** — re-explain at any level: ELI10, another example, vs JS/C++, why useful, in real code.
- **AI Code Explainer** — paste any Python, get a walkthrough with complexity and edge-case notes.
- **AI Improve** — refactor your code: Pythonic, performance, readability, comments, dedupe, structure.
- **AI Tutor Chat** — dedicated chat page with session memory and personalized context.
- **AI Companion** — the dashboard shows a personalized message based on your activity.
- **AI Error Dictionary** — click any Python exception for a fresh explanation with examples and fixes.
- **AI Generators** — generate quizzes, challenges, and projects on demand.
- **Personalized tracking** — the platform tracks weak topics, frequent errors, and recent accuracy; the AI uses this context.

## API key

The site uses Groq's OpenAI-compatible API. A default key is bundled in `js/config.js`, but:

- **Anything in client-side JS is public** — anyone visiting the live site can read the key.
- For real use, get your own key at [console.groq.com/keys](https://console.groq.com/keys) and paste it in **Settings → AI · Groq**. It's stored only in your browser's localStorage, never sent anywhere except Groq.
- To remove the bundled key from the repo, replace the value in `js/config.js` with `""`.

## Run locally

Open `index.html` in any modern browser. That's it.

```bash
# Optional: run via a local server
python -m http.server 8000
```

## Deploy to GitHub Pages

1. Push this directory to a GitHub repo.
2. Repo **Settings → Pages**, source = `main` branch / root.
3. Live at `https://<you>.github.io/<repo>/` within a minute.

No build step. All paths are relative.

## Architecture

```
index.html             dashboard
lessons.html / lesson.html
challenges.html / challenge.html
playground.html
quizzes.html
flashcards.html
projects.html
skills.html
reference.html
notes.html
settings.html

chat.html              AI tutor chat
practice.html          AI daily practice
errors.html            AI error dictionary
explain.html           paste-and-explain / improve

css/main.css           core styles
css/ai.css             AI-specific styles

js/state.js            persistent state + XP, streaks, completions
js/config.js           Groq API key + model presets
js/ai/core.js          Groq client (streaming, queue, errors)
js/ai/prompts.js       prompt builders for every AI feature
js/ai/panel.js         reusable AI side-drawer
js/ai/tracker.js       weak-topic / error tracking
js/shell.js            titlebar, sidebar, command palette
js/editor.js           code editor + Python syntax highlighter
js/runtime.js          Pyodide wrapper
js/grader.js           exercise auto-grader
js/data/*.js           lessons, challenges, quizzes, flashcards, reference, projects
js/pages/*.js          per-page render logic
```

All progress lives in `localStorage` under `pylab.state.v1`. Export/import via Settings.

## Keyboard

- `Ctrl K` — command palette
- `Ctrl Enter` — run code (in any editor)
- `Ctrl S` — save (playground)
- `Esc` — close the AI panel

## License

Public domain / MIT — do whatever.
