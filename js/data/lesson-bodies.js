// ============================================================
// Hand-written lesson bodies for non-Python languages.
//
// Keys match the lesson ids in DEFAULT_CURRICULA. When a curated
// body exists, renderAILessonPage uses it directly — no AI call,
// instant load. JS lessons ship with executable `check` scripts so
// grading runs locally and is deterministic (matches Python UX).
//
// HTML lessons still use AI grading for now (DOM-inspection grading
// is doable but not in this turn).
// ============================================================

window.DEFAULT_LESSON_BODIES = {

  // ====================== JavaScript ======================

  "js-vars": {
    prose: `
# let, const, var

JavaScript has three ways to declare a variable, and the choice matters.

\`\`\`javascript
const PI = 3.14;     // can't be reassigned. Use this by default.
let count = 0;       // can be reassigned. Use this when you need to.
var legacy = "old";  // function-scoped, hoisted. Avoid in new code.
\`\`\`

**\`const\` doesn't mean immutable** — it means the *binding* can't change.
The contents of a \`const\` object can still be mutated:

\`\`\`javascript
const items = [];
items.push(1);    // fine — array contents change
items = [1, 2];   // TypeError — can't reassign the binding
\`\`\`

**Rule of thumb:** start with \`const\`. Switch to \`let\` only when you actually
reassign. Never use \`var\` in new code.
    `,
    exercise: {
      prompt: "Declare a const greeting set to the string 'Hello, world!' and a let counter starting at 0. Then increment counter by 1.",
      starter: "// Declare greeting (const) and counter (let), then increment counter.\n",
      hints: [
        "Use const for greeting because it never changes",
        "counter changes (you increment it), so it needs to be let",
        "Increment with counter++ or counter += 1"
      ],
      solution: 'const greeting = "Hello, world!";\nlet counter = 0;\ncounter += 1;',
      check: `assert(typeof greeting === "string", "greeting should be a string");
assert(greeting === "Hello, world!", "greeting should be exactly 'Hello, world!'");
assert(typeof counter === "number", "counter should be a number");
assert(counter === 1, "counter should be 1 after incrementing once from 0");
console.log("CHECK_OK");`
    }
  },

  "js-types": {
    prose: `
# Types & coercion

JavaScript has 7 primitive types: string, number, boolean, null, undefined,
bigint, symbol — plus objects (which include arrays and functions).

\`\`\`javascript
typeof "hi"        // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"  (this is a famous historical bug)
typeof [1,2,3]     // "object"
typeof (() => 1)   // "function"
\`\`\`

**Equality has two flavors:**

\`\`\`javascript
1 == "1"    // true   — == coerces types before comparing
1 === "1"   // false  — === requires same type

null == undefined   // true (special case)
null === undefined  // false
\`\`\`

**Use \`===\` by default.** It's the rule pretty much every JS codebase enforces.
    `,
    exercise: {
      prompt: "Write a function sameValue(a, b) that returns true only if a and b are the same value AND the same type (strict equality, no coercion).",
      starter: "function sameValue(a, b) {\n  // TODO\n}\n",
      hints: [
        "Use the === operator",
        "It's a one-liner: return a === b"
      ],
      solution: "function sameValue(a, b) {\n  return a === b;\n}",
      check: `assert(typeof sameValue === "function", "sameValue should be a function");
assert(sameValue(1, 1) === true, "sameValue(1,1) should be true");
assert(sameValue(1, "1") === false, "sameValue(1,'1') should be false — different types");
assert(sameValue("a", "a") === true);
assert(sameValue(null, undefined) === false, "null !== undefined");
assert(sameValue(0, false) === false, "0 and false are not strictly equal");
console.log("CHECK_OK");`
    }
  },

  "js-operators": {
    prose: `
# Operators

Standard arithmetic and comparison work the way you'd expect. The interesting
ones in modern JS:

- **\`??\` (nullish coalescing):** \`a ?? b\` returns \`a\` unless \`a\` is null
  or undefined. Different from \`||\` which also catches \`0\`, \`""\`, \`false\`.
- **\`||\` (short-circuit OR):** \`a || b\` returns \`a\` if it's truthy, otherwise \`b\`.
- **\`?.\` (optional chaining):** \`user?.profile?.name\` doesn't crash if \`user\`
  or \`profile\` is null.
- **\`? :\` (ternary):** \`cond ? a : b\` — an inline if/else.

\`\`\`javascript
const port = userPort ?? 8080;     // 8080 only if userPort is null/undefined
const name = user.name || "guest"; // "guest" if user.name is empty too
const role = isAdmin ? "admin" : "viewer";
\`\`\`
    `,
    exercise: {
      prompt: "Write classify(score) that returns 'pass' if score >= 60, 'fail' otherwise. Use the ternary operator.",
      starter: "function classify(score) {\n  // TODO: use a ternary\n}\n",
      hints: [
        "Pattern: cond ? truthyResult : falsyResult",
        "score >= 60 ? 'pass' : 'fail'"
      ],
      solution: 'function classify(score) {\n  return score >= 60 ? "pass" : "fail";\n}',
      check: `assert(classify(60) === "pass");
assert(classify(59) === "fail");
assert(classify(100) === "pass");
assert(classify(0) === "fail");
console.log("CHECK_OK");`
    }
  },

  "js-if": {
    prose: `
# if / else

The shape JS shares with most languages:

\`\`\`javascript
if (condition) {
  // ...
} else if (otherCondition) {
  // ...
} else {
  // ...
}
\`\`\`

**Truthy and falsy.** JS doesn't require a boolean — it coerces. These are the
falsy values: \`false\`, \`0\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`. Everything else
is truthy, including empty arrays and objects.

\`\`\`javascript
if ([])    { /* runs   — [] is truthy */ }
if ({})    { /* runs   — {} is truthy */ }
if ("")    { /* skipped — empty string is falsy */ }
\`\`\`
    `,
    exercise: {
      prompt: "Write gradeLetter(score) returning 'A' if score >= 90, 'B' if >= 80, 'C' if >= 70, 'D' if >= 60, otherwise 'F'.",
      starter: "function gradeLetter(score) {\n  // TODO\n}\n",
      hints: [
        "Chain if / else if / else",
        "Check highest threshold first"
      ],
      solution: 'function gradeLetter(score) {\n  if (score >= 90) return "A";\n  if (score >= 80) return "B";\n  if (score >= 70) return "C";\n  if (score >= 60) return "D";\n  return "F";\n}',
      check: `assert(gradeLetter(95) === "A");
assert(gradeLetter(85) === "B");
assert(gradeLetter(75) === "C");
assert(gradeLetter(65) === "D");
assert(gradeLetter(50) === "F");
assert(gradeLetter(90) === "A", "90 should still be A");
assert(gradeLetter(100) === "A");
assert(gradeLetter(0) === "F");
console.log("CHECK_OK");`
    }
  },

  "js-loops": {
    prose: `
# Loops

Modern JS has several looping forms; pick the one that matches your intent:

\`\`\`javascript
// Counted loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// Iterate values in an array
for (const item of ["a", "b", "c"]) {
  console.log(item);
}

// Iterate keys in an object
for (const key in { x: 1, y: 2 }) {
  console.log(key);
}

// Conditional loop
let n = 10;
while (n > 0) {
  n -= 1;
}
\`\`\`

For array operations, prefer the functional methods (\`map\`, \`filter\`, \`reduce\`)
when they fit — covered in the next unit.
    `,
    exercise: {
      prompt: "Write sumUpTo(n) that returns the sum of integers from 1 to n inclusive. Use a loop.",
      starter: "function sumUpTo(n) {\n  // TODO\n}\n",
      hints: [
        "Initialize a total at 0",
        "Loop i from 1 to n, add each to total",
        "Return total at the end"
      ],
      solution: "function sumUpTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) total += i;\n  return total;\n}",
      check: `assert(sumUpTo(1) === 1);
assert(sumUpTo(5) === 15, "1+2+3+4+5 = 15");
assert(sumUpTo(10) === 55);
assert(sumUpTo(100) === 5050);
assert(sumUpTo(0) === 0);
console.log("CHECK_OK");`
    }
  },

  // ========================= HTML =========================
  // (No executable check yet — HTML lessons grade via AI for now.)

  "html-doc": {
    prose: `
# The shape of an HTML page

Every HTML document starts with a doctype, then nests everything inside an
\`<html>\` element with two main children: \`<head>\` (metadata, not visible)
and \`<body>\` (the content the user sees).

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>A paragraph.</p>
  </body>
</html>
\`\`\`

The \`<!doctype html>\` tells the browser to render in standards mode (the
modern, sane behavior). Without it, browsers fall back to *quirks mode* and
some CSS rules behave differently — usually in subtly broken ways.

\`<html lang="en">\` helps screen readers pick the right pronunciation engine.
Always set it.
    `,
    exercise: {
      prompt: "Write a minimal valid HTML5 page that includes a doctype, charset meta tag, a title 'My First Page', and an <h1> with the text 'Hello'.",
      starter: "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <!-- meta + title go here -->\n  </head>\n  <body>\n    <!-- h1 goes here -->\n  </body>\n</html>\n",
      hints: [
        "Inside <head>: a <meta charset=\"utf-8\" /> and a <title>",
        "Inside <body>: an <h1>"
      ],
      solution: '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello</h1>\n  </body>\n</html>',
      tests: "Must contain <!doctype html>, <meta charset>, <title>My First Page</title>, and an <h1> with text 'Hello'."
    }
  },

  "html-text": {
    prose: `
# Text elements

HTML has six heading levels, \`<h1>\` through \`<h6>\`, in decreasing visual
importance. Use exactly one \`<h1>\` per page — it's the document title.

\`\`\`html
<h1>Article title</h1>
<p>This is a paragraph of normal body text.</p>

<p>You can <strong>emphasize importance</strong>, mark text as
   <em>italic-meaning</em>, and link to <a href="/about">other pages</a>.</p>
\`\`\`

**Semantic vs visual.** \`<strong>\` means "important" (screen readers raise
their voice); \`<b>\` is purely visual bold. Same for \`<em>\` (meaningful
emphasis) vs \`<i>\` (just italic). Prefer the semantic ones.

Don't pick a heading level for how big it looks — pick it for the structure
it implies. Visual styling is CSS's job.
    `,
    exercise: {
      prompt: "Inside a <body>, write an <h1> with text 'My Blog', followed by a paragraph that says 'Welcome to my first post.' with the word 'Welcome' wrapped in <strong>.",
      starter: "<body>\n  <!-- TODO -->\n</body>\n",
      hints: [
        "Heading first, then paragraph",
        "<p>Use <strong>Welcome</strong>... pattern</p>"
      ],
      solution: '<body>\n  <h1>My Blog</h1>\n  <p><strong>Welcome</strong> to my first post.</p>\n</body>',
      tests: "Must contain exactly one <h1>My Blog</h1> and a <p> that includes <strong>Welcome</strong>."
    }
  },

  "html-lists": {
    prose: `
# Lists

Three kinds, each with semantic meaning:

\`\`\`html
<ul>                     <!-- Unordered: bulleted, order doesn't matter -->
  <li>Apples</li>
  <li>Bananas</li>
</ul>

<ol>                     <!-- Ordered: numbered, sequence matters -->
  <li>Crack eggs</li>
  <li>Whisk</li>
  <li>Cook</li>
</ol>

<dl>                     <!-- Description: term + definition pairs -->
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>
\`\`\`

You can nest a \`<ul>\` inside an \`<li>\` for sublists — just keep the structure
valid (a \`<ul>\` only contains \`<li>\` elements; bigger content goes inside the
\`<li>\`).
    `,
    exercise: {
      prompt: "Write an ordered list (<ol>) with three list items: 'Wake up', 'Drink coffee', 'Write code'.",
      starter: "<!-- TODO: <ol> with three <li> items -->\n",
      hints: [
        "<ol> wraps <li> elements",
        "One <li> per item"
      ],
      solution: '<ol>\n  <li>Wake up</li>\n  <li>Drink coffee</li>\n  <li>Write code</li>\n</ol>',
      tests: "Must be an <ol> containing exactly three <li> elements with the listed texts in order."
    }
  },

  "html-anchors": {
    prose: `
# Links

The anchor tag, \`<a>\`, is what makes the web hyper.

\`\`\`html
<a href="https://example.com">External link</a>
<a href="/about">Same-site link</a>
<a href="#section-2">Anchor on this page</a>
<a href="mailto:me@example.com">Email link</a>
\`\`\`

**\`target="_blank"\`** opens the link in a new tab. When you do that, also
add **\`rel="noopener noreferrer"\`** for security — without it, the new page
can manipulate the originating window via \`window.opener\`.

\`\`\`html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Opens in a new tab, safely
</a>
\`\`\`
    `,
    exercise: {
      prompt: "Write an anchor that links to https://mdn.dev with the text 'MDN docs', opens in a new tab, and includes the security rel attribute.",
      starter: "<!-- TODO -->\n",
      hints: [
        "href + target + rel",
        'rel="noopener noreferrer"'
      ],
      solution: '<a href="https://mdn.dev" target="_blank" rel="noopener noreferrer">MDN docs</a>',
      tests: "Must be an <a> with href='https://mdn.dev', target='_blank', rel containing 'noopener', and text 'MDN docs'."
    }
  },

  "html-images": {
    prose: `
# Images

The \`<img>\` tag is self-closing — there's no \`</img>\`. The **\`alt\` attribute
is required** for accessibility:

\`\`\`html
<img src="/cat.png" alt="A black cat sitting on a windowsill" />
\`\`\`

Screen readers read the \`alt\` text. For decorative images (purely visual,
no information), use \`alt=""\` — that tells the screen reader to skip it.
Don't use \`alt="image"\` — that's worse than nothing.

**Responsive images** with \`srcset\`:

\`\`\`html
<img src="/cat-1x.png"
     srcset="/cat-2x.png 2x, /cat-3x.png 3x"
     alt="A black cat" />
\`\`\`

Browsers pick the right resolution based on the user's display density.
    `,
    exercise: {
      prompt: "Write an <img> tag with src='/logo.png' and a meaningful alt text describing it as 'pylab logo'.",
      starter: "<!-- TODO -->\n",
      hints: [
        "<img src=\"...\" alt=\"...\" />",
        "alt must be descriptive, not empty"
      ],
      solution: '<img src="/logo.png" alt="pylab logo" />',
      tests: "Must be an <img> with src='/logo.png' and alt='pylab logo'."
    }
  },
};
