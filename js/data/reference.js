// ============================================================
// REFERENCE — Python cheat sheets.
// Each entry has id, category, title, body (markdown-ish).
// ============================================================

window.REFERENCE = [
  // ----- Built-ins -----
  {
    id: "ref-builtins", category: "Built-ins", title: "Common built-in functions",
    body: `
| Function | Example | Notes |
|---|---|---|
| \`print(*a, sep, end)\` | \`print("hi", end="!")\` | writes to stdout |
| \`input(prompt)\` | \`input("name? ")\` | reads a line as str |
| \`len(x)\` | \`len([1,2,3]) == 3\` | length of container |
| \`range(a, b, s)\` | \`range(0, 10, 2)\` | half-open range |
| \`abs(x)\` | \`abs(-3) == 3\` | absolute value |
| \`min, max\` | \`max([3,1,2])\` | min/max |
| \`sum(xs, start=0)\` | \`sum([1,2,3]) == 6\` | sums numbers |
| \`sorted(xs, key=, reverse=)\` | | returns a new list |
| \`reversed(xs)\` | | iterator in reverse |
| \`map(f, it)\` / \`filter(p, it)\` | | lazy iterators |
| \`zip(a, b)\` | | pair iterables |
| \`enumerate(it, start=0)\` | \`for i, x in enumerate(xs)\` | pairs index, value |
| \`type(x)\` | \`type(3) is int\` | runtime type |
| \`isinstance(x, T)\` | | preferred over type check |
| \`open(path, mode)\` | \`with open("f") as fp:\` | file I/O |
`
  },
  {
    id: "ref-operators", category: "Built-ins", title: "Operators",
    body: `
**Arithmetic** \`+  -  *  /  //  %  **\`
\`//\` floor divides; \`**\` is exponent.

**Comparison** \`==  !=  <  <=  >  >=\` and chained (\`0 < x < 10\`).

**Boolean** \`and  or  not\` — short-circuit, return operand value not always bool.

**Membership** \`in\` / \`not in\`.

**Identity** \`is\` / \`is not\` — same object.

**Bitwise** \`&  |  ^  ~  <<  >>\`.

**Assignment** \`+=  -=  *=  /=  //=  %=  **=  &=  |=  ^=\`.
`
  },

  // ----- Strings -----
  {
    id: "ref-str-methods", category: "Strings", title: "String methods",
    body: `
| Method | Returns |
|---|---|
| \`s.upper()\` / \`s.lower()\` | new string |
| \`s.title()\` / \`s.capitalize()\` | new string |
| \`s.strip(chars=None)\` | trimmed string |
| \`s.lstrip / rstrip\` | trimmed left/right |
| \`s.split(sep=None, maxsplit=-1)\` | list |
| \`s.rsplit(sep)\` | list (right-to-left) |
| \`sep.join(iter)\` | string |
| \`s.replace(old, new, count=-1)\` | string |
| \`s.startswith(p)\` / \`s.endswith(p)\` | bool |
| \`s.find(sub) / s.index(sub)\` | int (or -1 / raises) |
| \`s.count(sub)\` | int |
| \`s.format(...)\` / f-strings | string |
| \`s.isdigit / isalpha / isalnum\` | bool |
| \`s.zfill(n)\` | left-pads with 0 |
| \`s.encode(enc='utf-8')\` | bytes |
`
  },

  // ----- Lists -----
  {
    id: "ref-list-methods", category: "Lists", title: "List methods",
    body: `
| Method | Effect |
|---|---|
| \`xs.append(x)\` | adds to end |
| \`xs.extend(it)\` | concat in place |
| \`xs.insert(i, x)\` | inserts at index |
| \`xs.pop(i=-1)\` | removes and returns |
| \`xs.remove(x)\` | removes first matching |
| \`xs.clear()\` | empties |
| \`xs.index(x)\` | first occurrence (raises) |
| \`xs.count(x)\` | matches |
| \`xs.sort(key=, reverse=)\` | in-place sort |
| \`xs.reverse()\` | in-place reverse |
| \`xs.copy()\` | shallow copy |
`
  },

  // ----- Dicts -----
  {
    id: "ref-dict-methods", category: "Dicts", title: "Dict methods",
    body: `
| Method | Effect |
|---|---|
| \`d[k]\` | value or KeyError |
| \`d.get(k, default=None)\` | value or default |
| \`d.setdefault(k, default)\` | insert if missing |
| \`d.pop(k, default)\` | remove and return |
| \`d.update(other)\` | merge |
| \`d.keys() / values() / items()\` | views |
| \`k in d\` | membership |
| \`{**a, **b}\` | merge (new dict) |
`
  },

  // ----- Sets / Tuples -----
  {
    id: "ref-set-methods", category: "Sets", title: "Set methods",
    body: `
| Method | Effect |
|---|---|
| \`s.add(x)\` | insert |
| \`s.discard(x)\` | remove if present |
| \`s.remove(x)\` | remove or raise |
| \`s.pop()\` | arbitrary remove |
| \`a \\| b\` | union |
| \`a & b\` | intersection |
| \`a - b\` | difference |
| \`a ^ b\` | symmetric difference |
| \`a.issubset(b)\` / \`issuperset\` | bool |
`
  },
  {
    id: "ref-tuples", category: "Tuples", title: "Tuples",
    body: `
Tuples are immutable ordered sequences.

\`\`\`python
t = (1, 2, 3)
a, b, c = t        # unpacking
single = (42,)     # note the trailing comma
\`\`\`

Use them for fixed-size groupings and as **dict keys**.
`
  },

  // ----- Control flow -----
  {
    id: "ref-control", category: "Control", title: "Control flow",
    body: `
\`\`\`python
if x > 0: ...
elif x == 0: ...
else: ...

for x in xs:
    ...
else:
    # runs if loop didn't break
    ...

while cond:
    ...
    if done: break
    if skip: continue

match shape:
    case "circle": ...
    case "square": ...
    case _: ...
\`\`\`
`
  },

  // ----- Files -----
  {
    id: "ref-files", category: "Files", title: "File handling",
    body: `
Always use the context manager so files close even on errors.

\`\`\`python
with open("data.txt", "r", encoding="utf-8") as f:
    text = f.read()
    # or:
    for line in f: ...

with open("out.txt", "w") as f:
    f.write("hi\\n")
\`\`\`

Modes: \`r\` read, \`w\` write (truncate), \`a\` append, \`b\` binary, \`x\` exclusive create.

In the browser playground, file I/O is sandboxed — see the playground docs.
`
  },

  // ----- Exceptions -----
  {
    id: "ref-exceptions", category: "Errors", title: "Exceptions",
    body: `
\`\`\`python
try:
    risky()
except (ValueError, TypeError) as e:
    print("oops:", e)
except Exception:
    print("any other")
else:
    print("no error")
finally:
    cleanup()
\`\`\`

Common exception classes:
- \`ValueError\`, \`TypeError\`
- \`KeyError\`, \`IndexError\`, \`AttributeError\`
- \`FileNotFoundError\`, \`PermissionError\`
- \`ZeroDivisionError\`, \`StopIteration\`
`
  },

  // ----- Comprehensions -----
  {
    id: "ref-comp", category: "Comprehensions", title: "Comprehensions",
    body: `
\`\`\`python
squares = [x*x for x in range(10)]
evens   = [x for x in xs if x % 2 == 0]
matrix  = [[r*c for c in range(3)] for r in range(3)]
by_len  = {w: len(w) for w in words}
uniq    = {f(x) for x in xs}
gen     = (x*x for x in range(10))   # generator (lazy)
\`\`\`
`
  },

  // ----- Cheat sheets -----
  {
    id: "ref-cheat-format", category: "Cheat", title: "f-string formatting",
    body: `
| Spec | Result |
|---|---|
| \`f"{x:5}"\` | width 5 |
| \`f"{x:<5}"\` | left-align |
| \`f"{x:>5}"\` | right-align |
| \`f"{x:^5}"\` | center |
| \`f"{x:.2f}"\` | 2 decimals |
| \`f"{x:,}"\` | thousands separator |
| \`f"{x:08.2f}"\` | zero-padded |
| \`f"{x:#x}"\` | hex with 0x prefix |
| \`f"{x:%}"\` | percent (x is fraction) |
`
  },
  {
    id: "ref-cheat-slice", category: "Cheat", title: "Slicing tricks",
    body: `
\`\`\`python
s = "abcdefg"
s[0]      # 'a'
s[-1]     # 'g'
s[:3]     # 'abc'
s[3:]     # 'defg'
s[::-1]   # 'gfedcba'  (reverse)
s[::2]    # 'aceg'
s[1:-1]   # 'bcdef'
\`\`\`
`
  },
];

window.REF_CATS = Array.from(new Set(REFERENCE.map(r => r.category)));
