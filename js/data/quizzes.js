// ============================================================
// QUIZZES — short topic checks. Mixed question types.
//
// Types:
//   mcq        — pick one
//   fill       — fill in the blank (exact answer)
//   predict    — predict the output (compare to expected string)
//   debug      — typed code with hidden test (uses Grader)
// ============================================================

window.QUIZZES = [
  {
    id: "q-basics",
    title: "Python Basics",
    description: "Foundations: variables, types, and printing.",
    questions: [
      { type: "mcq", q: "Which of these is a valid variable name?", choices: ["2name", "name-1", "_name", "class"], answer: 2 },
      { type: "mcq", q: "What does type(3.14) return?", choices: ["int", "float", "str", "Decimal"], answer: 1 },
      { type: "fill", q: "Function that returns the length of a list:", answer: "len" },
      { type: "predict", q: "Predict the output:\n\nprint(2 + 3 * 4)", answer: "14" },
      { type: "mcq", q: "Strings in Python are…", choices: ["mutable", "immutable", "always ASCII", "always bytes"], answer: 1 },
    ]
  },
  {
    id: "q-control",
    title: "Control Flow",
    description: "if, for, while, break, continue.",
    questions: [
      { type: "predict", q: "Predict the output:\n\nfor i in range(3):\n    print(i, end='-')", answer: "0-1-2-" },
      { type: "mcq", q: "Which keyword skips the rest of a loop iteration?", choices: ["pass", "skip", "continue", "break"], answer: 2 },
      { type: "predict", q: "Predict the output:\n\nx = 5\nif x > 3 and x < 10:\n    print('mid')\nelse:\n    print('out')", answer: "mid" },
      { type: "fill", q: "range(5) generates 5 numbers starting at ___ ?", answer: "0" },
      { type: "mcq", q: "What is the value of x after:  x = 0\\nfor i in range(4): x += i", choices: ["3", "4", "6", "10"], answer: 2 },
    ]
  },
  {
    id: "q-collections",
    title: "Collections",
    description: "Lists, tuples, dicts, sets.",
    questions: [
      { type: "mcq", q: "Which is immutable?", choices: ["list", "dict", "set", "tuple"], answer: 3 },
      { type: "predict", q: "Predict the output:\n\nxs = [1,2,3]\nprint(xs[-1])", answer: "3" },
      { type: "fill", q: "Method that adds to a list end:", answer: "append" },
      { type: "predict", q: "Predict the output:\n\ns = {1,2,2,3}\nprint(len(s))", answer: "3" },
      { type: "mcq", q: "d = {'a': 1}; d['a'] = 2 — d is now…", choices: ["{'a': 1, 'a': 2}", "{'a': 2}", "Error", "{'a': [1, 2]}"], answer: 1 },
    ]
  },
  {
    id: "q-debug",
    title: "Debug It",
    description: "Find and fix the bug.",
    questions: [
      {
        type: "debug",
        q: "Fix this function so it returns the sum of 1..n inclusive.",
        starter: "def total(n):\n    s = 0\n    for i in range(n):\n        s += i\n    return s\n",
        check: `assert total(5) == 15
assert total(10) == 55
print("CHECK_OK")`,
        hints: ["range(n) stops one short of n."],
      },
      {
        type: "debug",
        q: "Fix this so it counts how many of the input list are positive.",
        starter: "def positives(xs):\n    n = 0\n    for x in xs:\n        if x > 0\n            n += 1\n    return n\n",
        check: `assert positives([-1, 0, 1, 2, -3]) == 2
assert positives([]) == 0
print("CHECK_OK")`,
        hints: ["Look at the if line carefully."],
      },
    ]
  },
];

window.findQuiz = id => QUIZZES.find(q => q.id === id);
