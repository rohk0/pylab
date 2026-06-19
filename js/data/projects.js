// ============================================================
// PROJECTS — guided builds. Each has steps, starter code, an
// optional check, and a final "open in playground" path.
// ============================================================

window.PROJECTS = [
  {
    id: "p-calc",
    title: "Calculator",
    summary: "Tiny REPL that evaluates +, -, *, /.",
    difficulty: "easy",
    minutes: 15,
    steps: [
      { title: "Read input", body: "Use `input()` to read an expression like `2 + 3`." },
      { title: "Split into tokens", body: "Use `.split()` to break the expression into three pieces: left, op, right." },
      { title: "Convert to numbers", body: "Convert left and right with `float()`." },
      { title: "Branch on operator", body: "Use `if op == '+'`, `'-'`, `'*'`, `'/'` to dispatch." },
      { title: "Print the result", body: "Don't forget to handle division by zero." },
    ],
    starter:
`def calc(expr):
    left, op, right = expr.split()
    a, b = float(left), float(right)
    # TODO: implement +, -, *, /
    return None

print(calc("2 + 3"))
print(calc("10 / 4"))
`,
    check: `assert calc("2 + 3") == 5
assert calc("10 - 7") == 3
assert calc("6 * 7") == 42
assert calc("10 / 4") == 2.5
print("CHECK_OK")`,
  },
  {
    id: "p-passgen",
    title: "Password generator",
    summary: "Random secure passwords with options.",
    difficulty: "easy", minutes: 20,
    steps: [
      { title: "Import random", body: "Use the standard `random` module." },
      { title: "Pick from a character pool", body: "Build a string of letters, digits, and symbols. Pick characters with `random.choice`." },
      { title: "Parameterise length", body: "Define `generate(n, symbols=True)`." },
      { title: "Print sample", body: "Print a few generated passwords." },
    ],
    starter:
`import random, string

def generate(n=12, symbols=True):
    pool = string.ascii_letters + string.digits
    if symbols:
        pool += "!@#$%^&*"
    return "".join(random.choice(pool) for _ in range(n))

for _ in range(3):
    print(generate(16))
`,
  },
  {
    id: "p-guess",
    title: "Number guessing game",
    summary: "Player guesses a number; hints higher/lower.",
    difficulty: "easy", minutes: 20,
    steps: [
      { title: "Pick the secret", body: "`random.randint(1, 100)`" },
      { title: "Loop until correct", body: "Read guesses with `input()`, convert to int." },
      { title: "Print higher / lower", body: "Use if/elif/else." },
      { title: "Count attempts", body: "Show how many guesses it took." },
    ],
    starter:
`import random

secret = random.randint(1, 100)
tries = 0
while True:
    g = int(input("guess: "))
    tries += 1
    if g < secret: print("higher")
    elif g > secret: print("lower")
    else:
        print(f"got it in {tries} tries"); break
`,
  },
  {
    id: "p-todo",
    title: "To-do list",
    summary: "Add, list, and complete tasks (in-memory).",
    difficulty: "easy", minutes: 25,
    steps: [
      { title: "Pick a data structure", body: "Use a list of dicts: `{ 'text': ..., 'done': False }`." },
      { title: "Add", body: "Append a new task." },
      { title: "List", body: "Print numbered tasks with a `[x]` or `[ ]` mark." },
      { title: "Complete", body: "Set `done=True` by index." },
    ],
    starter:
`tasks = []

def add(text):
    tasks.append({"text": text, "done": False})

def done(i):
    tasks[i]["done"] = True

def show():
    for i, t in enumerate(tasks):
        mark = "x" if t["done"] else " "
        print(f"[{mark}] {i}. {t['text']}")

add("learn python")
add("write a project")
done(0)
show()
`,
  },
  {
    id: "p-quiz-game",
    title: "Quiz game",
    summary: "Ask trivia questions; tally a score.",
    difficulty: "medium", minutes: 30,
    steps: [
      { title: "Store questions", body: "List of (question, answer) tuples." },
      { title: "Ask each", body: "Loop, prompt with `input`, compare case-insensitively." },
      { title: "Score it", body: "Increment on correct; print final at end." },
    ],
    starter:
`questions = [
    ("Capital of France?", "Paris"),
    ("2 + 2?", "4"),
    ("Name of Python's creator?", "Guido"),
]

score = 0
for q, a in questions:
    ans = input(q + " ")
    if ans.strip().lower() == a.lower():
        score += 1
print(f"score: {score} / {len(questions)}")
`,
  },
  {
    id: "p-text-adv",
    title: "Text adventure",
    summary: "Mini choose-your-own-adventure.",
    difficulty: "medium", minutes: 30,
    steps: [
      { title: "Model rooms", body: "Dict of dicts: `rooms[name] = {desc, choices: {key: next_name}}`." },
      { title: "Loop", body: "Print description, read choice, jump to next room." },
      { title: "End condition", body: "Designate one or more rooms as endings." },
    ],
    starter:
`rooms = {
    "start": {
        "desc": "You stand at a fork. Go [l]eft or [r]ight?",
        "choices": {"l": "cave", "r": "river"},
    },
    "cave":  {"desc": "A dragon! THE END.", "choices": {}},
    "river": {"desc": "You find a boat. THE END.", "choices": {}},
}

room = "start"
while room:
    r = rooms[room]
    print(r["desc"])
    if not r["choices"]: break
    pick = input("> ").strip()
    room = r["choices"].get(pick, room)
`,
  },
  {
    id: "p-chatbot",
    title: "Pattern chatbot",
    summary: "ELIZA-style keyword responses.",
    difficulty: "medium", minutes: 25,
    steps: [
      { title: "Patterns dict", body: "Map keywords to responses." },
      { title: "Match", body: "Scan user input for any keyword." },
      { title: "Fallback", body: "Generic response if nothing matches." },
    ],
    starter:
`import random

rules = {
    "hello": ["hi there", "hey!"],
    "name":  ["I'm pybot.", "they call me pybot."],
    "bye":   ["see ya", "later!"],
}
fallback = ["tell me more", "interesting…"]

def reply(msg):
    msg = msg.lower()
    for kw, opts in rules.items():
        if kw in msg:
            return random.choice(opts)
    return random.choice(fallback)

print(reply("hello there"))
print(reply("what's your name?"))
print(reply("how's the weather"))
`,
  },
  {
    id: "p-file-organizer",
    title: "File organizer (logic)",
    summary: "Group filenames by extension.",
    difficulty: "medium", minutes: 25,
    steps: [
      { title: "Take a list of filenames", body: "Hard-code a few for testing." },
      { title: "Split by extension", body: "Use `name.rsplit('.', 1)[-1]`." },
      { title: "Group into a dict", body: "Map ext -> list of names." },
      { title: "Print groups", body: "Sort the keys for stability." },
    ],
    starter:
`files = ["report.pdf", "logo.png", "notes.md", "data.csv", "selfie.png", "draft.md"]

groups = {}
for f in files:
    ext = f.rsplit(".", 1)[-1].lower()
    groups.setdefault(ext, []).append(f)

for ext in sorted(groups):
    print(f"{ext}: {', '.join(groups[ext])}")
`,
    check: `assert "pdf" in groups and "png" in groups
assert sorted(groups["png"]) == ["logo.png", "selfie.png"]
print("CHECK_OK")`,
  },
];
