# pylab

A handcrafted Python learning workbench that runs entirely in the browser. No backend, no build step, no tracking.

## What it is

- **Lessons** — typed-code exercises across 8 units (basics → OOP → comprehensions). Each exercise is auto-graded.
- **Challenges** — 20+ standalone coding problems (easy / medium / hard) with hidden tests and XP rewards.
- **Playground** — full Python editor with persistent files, shareable URLs, stdin input, and a stdout pane.
- **Quizzes** — multiple choice, fill-in-the-blank, predict-the-output, and debug-the-code.
- **Flashcards** — concept review with flip, favorites, and self-rated spacing.
- **Reference** — searchable cheat sheets covering built-ins, methods, slicing, comprehensions, and more.
- **Projects** — guided builds (calculator, password gen, quiz game, text adventure, chatbot, …).
- **Skill tree** — unit-by-unit progression with achievements.
- **Notes** — local-only personal notes, searchable and exportable.
- **Command palette** — `Ctrl K` jumps anywhere.

Real Python runs in the browser via [Pyodide](https://pyodide.org) (WebAssembly). The first run downloads the runtime; subsequent runs are instant.

## Run locally

Open `index.html` directly in any modern browser. That's it.

For development with hot reload, any static server works:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this directory to a GitHub repo.
2. In repo **Settings → Pages**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / root
3. Save. Your site will be live at `https://<you>.github.io/<repo>/` within a minute.

No build step is needed. All paths are relative, so it works from any subdirectory.

## Architecture

```
index.html              dashboard
lessons.html            curriculum index
lesson.html             single lesson + exercise
challenges.html         challenge index
challenge.html          single challenge
playground.html         freeform code editor
quizzes.html            quizzes (list + runner)
flashcards.html         flashcard study mode
projects.html           guided projects
skills.html             visual skill tree
reference.html          searchable cheat sheets
notes.html              personal notes
settings.html           theme, editor prefs, export/import

css/main.css            all styles, one file
js/state.js             persistent state (XP, streaks, completions) in localStorage
js/shell.js             app shell (titlebar, sidebar, command palette)
js/editor.js            code editor + Python syntax highlighter
js/runtime.js           Pyodide wrapper (loads on demand)
js/grader.js            exercise auto-grader
js/data/*.js            content (lessons, challenges, quizzes, flashcards, reference, projects)
js/pages/*.js           per-page render logic
```

All persistent data lives in `localStorage` under the key `pylab.state.v1`. Use **Settings → Export progress** to back it up.

## Design notes

- VS Code-inspired shell — titlebar, activity bar, sidebar, tabs, status bar.
- Dense layout, monospace UI accents, sharp corners (4–6 px max).
- Custom Python syntax highlighter (no external editor lib).
- Pyodide loaded lazily so dashboard and content pages stay fast.

## License

Public domain / MIT — do whatever.
