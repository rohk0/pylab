// ============================================================
// LESSONS — curriculum data.
//
// Each lesson has:
//   id, title, summary, prose (markdown-ish), exercises[]
// Each exercise has:
//   prompt, starter (code), check (run-after-code Python that
//   asserts and prints CHECK_OK on success), hints[], solution.
//
// The check string is wrapped in try/except by the grader.
// ============================================================

window.LESSONS = [
  {
    id: "u-basics",
    title: "Foundations",
    summary: "Variables, types, printing, simple math.",
    icon: "01",
    lessons: [
      {
        id: "l-hello",
        title: "Hello, Python",
        summary: "Run your first line of Python.",
        prose: `
# Hello, Python

Welcome. The fastest way to feel Python is to make it speak.

## print()
The \`print()\` function writes text to the screen.

\`\`\`python
print("Hello, world!")
\`\`\`

Anything inside the parentheses is the **argument**. Strings live inside quotes — single or double, your choice.

> Tip: press <kbd>Ctrl Enter</kbd> in the editor to run.
        `,
        exercises: [
          {
            prompt: 'Print the exact text: Hello, Pylab!',
            starter: '# write your print statement below\n',
            stdoutEquals: "Hello, Pylab!\n",
            hints: [
              "Use print() with a string argument.",
              "Strings need quotes around them.",
            ],
            solution: 'print("Hello, Pylab!")'
          }
        ],
      },
      {
        id: "l-variables",
        title: "Variables",
        summary: "Bind values to names.",
        prose: `
# Variables

A variable is a **name** bound to a **value**.

\`\`\`python
name = "Ada"
age = 36
\`\`\`

Names should be lowercase, separated by underscores. They cannot start with a number.

You can use a variable anywhere you would use its value:

\`\`\`python
print(name, age)
\`\`\`
        `,
        exercises: [
          {
            prompt: 'Create a variable called name and assign it your name as a string. Then print it.',
            starter: '',
            check: `assert isinstance(name, str), "name must be a string"
assert len(name) > 0, "name should not be empty"
print("CHECK_OK")`,
            hints: ["Use quotes for the value.", "Then print(name)."],
            solution: 'name = "Ada"\nprint(name)'
          },
          {
            prompt: 'Create two variables a = 7 and b = 3, then assign their sum to s and print s.',
            starter: '',
            check: `assert a == 7 and b == 3
assert s == 10
print("CHECK_OK")`,
            hints: ["s = a + b"],
            solution: 'a = 7\nb = 3\ns = a + b\nprint(s)'
          },
        ],
      },
      {
        id: "l-types",
        title: "Numbers & Strings",
        summary: "int, float, str.",
        prose: `
# Numbers & Strings

The three everyday types:

- \`int\` — whole numbers: \`42\`, \`-7\`
- \`float\` — decimals: \`3.14\`, \`-0.5\`
- \`str\` — text in quotes: \`"hi"\`

You can convert between them with \`int()\`, \`float()\`, \`str()\`.

\`\`\`python
n = int("42")     # 42
s = str(3.14)     # "3.14"
\`\`\`

Numbers support \`+ - * / // % **\` (\`//\` floor divides, \`**\` is power).
        `,
        exercises: [
          {
            prompt: 'Compute 2 to the power of 10, store it in result and print it.',
            starter: '',
            stdoutEquals: "1024\n",
            check: `assert result == 1024`,
            hints: ["Use ** for power."],
            solution: 'result = 2 ** 10\nprint(result)'
          },
          {
            prompt: 'Given price = 49.99 and qty = 3, print the total as a number.',
            starter: 'price = 49.99\nqty = 3\n',
            stdoutMatches: /149\.97/,
            hints: ["Just price * qty."],
            solution: 'price = 49.99\nqty = 3\nprint(price * qty)'
          }
        ],
      },
      {
        id: "l-input",
        title: "Input & f-strings",
        summary: "Read input, format output.",
        prose: `
# Input & f-strings

\`input()\` reads a line of text from the user. It always returns a **string** — convert it if you need a number.

\`\`\`python
n = int(input("how many? "))
\`\`\`

**f-strings** let you embed expressions inside text:

\`\`\`python
name = "Ada"
print(f"hi {name}, you are {2025 - 1815} years old")
\`\`\`
        `,
        exercises: [
          {
            prompt: 'Read a name with input() and print "Hello, <name>!". Stdin is preset to: Ada',
            starter: '',
            stdin: "Ada\n",
            stdoutContains: "Hello, Ada!",
            hints: ["name = input()", "print(f\"Hello, {name}!\")"],
            solution: 'name = input()\nprint(f"Hello, {name}!")'
          }
        ],
      },
    ],
  },

  {
    id: "u-control",
    title: "Control Flow",
    summary: "Branches, loops, decisions.",
    icon: "02",
    lessons: [
      {
        id: "l-if",
        title: "if / elif / else",
        summary: "Make choices.",
        prose: `
# if / elif / else

Indentation is part of the syntax. The body of an \`if\` is whatever lines are indented under it.

\`\`\`python
x = 10
if x > 0:
    print("positive")
elif x < 0:
    print("negative")
else:
    print("zero")
\`\`\`

Boolean expressions use \`and\`, \`or\`, \`not\`. Comparisons: \`==  !=  <  <=  >  >=\`.
        `,
        exercises: [
          {
            prompt: 'Read an integer n from stdin. Print "even" if even, "odd" otherwise. Stdin: 4',
            stdin: "4\n",
            stdoutEquals: "even\n",
            hints: ["n = int(input())", "use n % 2 == 0"],
            solution: 'n = int(input())\nprint("even" if n % 2 == 0 else "odd")'
          },
          {
            prompt: 'Given score = 78, print "A" if >=90, "B" if >=80, "C" if >=70, else "F".',
            starter: 'score = 78\n',
            stdoutEquals: "C\n",
            hints: ["Chain elif from highest threshold down."],
            solution: 'score = 78\nif score >= 90: print("A")\nelif score >= 80: print("B")\nelif score >= 70: print("C")\nelse: print("F")'
          }
        ],
      },
      {
        id: "l-for",
        title: "for loops & range",
        summary: "Repeat with structure.",
        prose: `
# for loops

A \`for\` loop walks through any **iterable**. The classic counted loop uses \`range\`:

\`\`\`python
for i in range(5):
    print(i)  # 0 1 2 3 4
\`\`\`

\`range(start, stop, step)\` — \`stop\` is **exclusive**.
        `,
        exercises: [
          {
            prompt: 'Print numbers 1 through 10, one per line.',
            stdoutEquals: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n",
            hints: ["range(1, 11)"],
            solution: 'for i in range(1, 11):\n    print(i)'
          },
          {
            prompt: 'Compute the sum of integers 1..100, store in total, print it.',
            check: `assert total == 5050`,
            stdoutEquals: "5050\n",
            hints: ["total = 0", "total += i"],
            solution: 'total = 0\nfor i in range(1, 101):\n    total += i\nprint(total)'
          }
        ],
      },
      {
        id: "l-while",
        title: "while & break",
        summary: "Conditional loops.",
        prose: `
# while

Run while a condition stays true.

\`\`\`python
n = 1
while n < 100:
    n *= 2
print(n)  # 128
\`\`\`

Use \`break\` to leave early, \`continue\` to skip to the next iteration.
        `,
        exercises: [
          {
            prompt: 'Find the first power of 2 greater than 1000 and store it in p, then print p.',
            check: `assert p > 1000 and (p & (p - 1)) == 0`,
            stdoutEquals: "1024\n",
            hints: ["Start with p = 1 and double."],
            solution: 'p = 1\nwhile p <= 1000:\n    p *= 2\nprint(p)'
          }
        ],
      },
    ],
  },

  {
    id: "u-collections",
    title: "Collections",
    summary: "Lists, tuples, dicts, sets.",
    icon: "03",
    lessons: [
      {
        id: "l-lists",
        title: "Lists",
        summary: "Ordered, mutable sequences.",
        prose: `
# Lists

Lists hold ordered items. Square brackets, comma-separated.

\`\`\`python
nums = [3, 1, 4, 1, 5]
nums.append(9)
nums[0]      # 3
nums[-1]     # 9 (last)
len(nums)    # 6
nums[1:3]    # [1, 4]
\`\`\`

Useful methods: \`.append\`, \`.extend\`, \`.pop\`, \`.sort\`, \`.reverse\`.
        `,
        exercises: [
          {
            prompt: 'Create xs = [3, 1, 4, 1, 5, 9, 2, 6]. Sort it ascending in-place and print xs.',
            check: `assert xs == [1,1,2,3,4,5,6,9]`,
            hints: [".sort() mutates in place."],
            solution: 'xs = [3,1,4,1,5,9,2,6]\nxs.sort()\nprint(xs)'
          },
          {
            prompt: 'Given xs = [1,2,3,4,5], use a list comprehension to build evens, the even numbers from xs.',
            starter: 'xs = [1,2,3,4,5]\n',
            check: `assert evens == [2,4]`,
            stdoutEquals: "[2, 4]\n",
            hints: ["[x for x in xs if x % 2 == 0]"],
            solution: 'xs = [1,2,3,4,5]\nevens = [x for x in xs if x % 2 == 0]\nprint(evens)'
          },
        ],
      },
      {
        id: "l-dicts",
        title: "Dictionaries",
        summary: "Key-value lookup.",
        prose: `
# Dictionaries

Dicts map **keys** to **values**.

\`\`\`python
user = {"name": "Ada", "age": 36}
user["name"]          # "Ada"
user["job"] = "math"  # add or update
"age" in user         # True
for k, v in user.items():
    print(k, v)
\`\`\`
        `,
        exercises: [
          {
            prompt: 'Build a frequency dict counts for the word "mississippi". Print counts["s"].',
            check: `assert counts["s"] == 4 and counts["i"] == 4 and counts["p"] == 2 and counts["m"] == 1`,
            stdoutEquals: "4\n",
            hints: ["counts = {}", "counts[c] = counts.get(c, 0) + 1"],
            solution: 'counts = {}\nfor c in "mississippi":\n    counts[c] = counts.get(c, 0) + 1\nprint(counts["s"])'
          }
        ],
      },
      {
        id: "l-tuples-sets",
        title: "Tuples & Sets",
        summary: "Immutable groups & unique items.",
        prose: `
# Tuples and Sets

**Tuples** are immutable lists, written with parentheses:

\`\`\`python
point = (3, 4)
x, y = point  # unpacking
\`\`\`

**Sets** hold unique items, no order:

\`\`\`python
s = {1, 2, 2, 3}   # {1, 2, 3}
s.add(4)
1 in s             # True
\`\`\`
        `,
        exercises: [
          {
            prompt: 'Given words = ["a","b","a","c","b","a"], compute unique = set(words). Print len(unique).',
            starter: 'words = ["a","b","a","c","b","a"]\n',
            check: `assert unique == {"a","b","c"}`,
            stdoutEquals: "3\n",
            hints: ["unique = set(words)"],
            solution: 'words = ["a","b","a","c","b","a"]\nunique = set(words)\nprint(len(unique))'
          }
        ],
      },
    ],
  },

  {
    id: "u-functions",
    title: "Functions",
    summary: "Reuse logic with def.",
    icon: "04",
    lessons: [
      {
        id: "l-def",
        title: "Defining functions",
        summary: "Parameters and return values.",
        prose: `
# Functions

\`\`\`python
def greet(name):
    return f"hi, {name}"

print(greet("Ada"))
\`\`\`

A function that lacks \`return\` returns \`None\`. Parameters can have defaults:

\`\`\`python
def greet(name, mood="happy"):
    return f"{mood} hi, {name}"
\`\`\`
        `,
        exercises: [
          {
            prompt: 'Define a function square(n) that returns n * n. The grader will check several inputs.',
            check: `assert square(0) == 0
assert square(5) == 25
assert square(-3) == 9
print("CHECK_OK")`,
            hints: ["return n * n"],
            solution: 'def square(n):\n    return n * n'
          },
          {
            prompt: 'Define is_prime(n) -> bool. Numbers <= 1 are not prime.',
            check: `assert is_prime(2) and is_prime(3) and is_prime(13)
assert not is_prime(1) and not is_prime(9) and not is_prime(0) and not is_prime(-5)
print("CHECK_OK")`,
            hints: ["Loop from 2 to int(n**0.5)+1.", "Return False on any divisor."],
            solution: 'def is_prime(n):\n    if n <= 1: return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0: return False\n    return True'
          }
        ],
      },
      {
        id: "l-scope",
        title: "Scope & closures",
        summary: "Local vs global names.",
        prose: `
# Scope

Names defined inside a function are **local** unless declared \`global\` or \`nonlocal\`.

\`\`\`python
def counter():
    n = 0
    def tick():
        nonlocal n
        n += 1
        return n
    return tick
\`\`\`
        `,
        exercises: [
          {
            prompt: 'Write make_adder(x) that returns a function adding x to its argument. The grader will call make_adder(7)(3) and expect 10.',
            check: `add7 = make_adder(7)
assert add7(3) == 10
assert make_adder(0)(0) == 0
print("CHECK_OK")`,
            hints: ["def make_adder(x):", "    def add(y): return x + y"],
            solution: 'def make_adder(x):\n    def add(y):\n        return x + y\n    return add'
          }
        ],
      },
    ],
  },

  {
    id: "u-strings",
    title: "Strings",
    summary: "Slicing, methods, formatting.",
    icon: "05",
    lessons: [
      {
        id: "l-string-basics",
        title: "String basics",
        summary: "Index, slice, immutability.",
        prose: `
# Strings

Strings are sequences of characters. Like lists, you can **slice** them.

\`\`\`python
s = "hello"
s[0]      # 'h'
s[-1]     # 'o'
s[1:4]    # 'ell'
s[::-1]   # 'olleh'  (reverse)
\`\`\`

Strings are **immutable**. \`s[0] = "H"\` is an error — make a new string instead.
        `,
        exercises: [
          {
            prompt: 'Given s = "racecar", check whether s reads the same forwards and backwards. Print True or False.',
            starter: 's = "racecar"\n',
            stdoutEquals: "True\n",
            hints: ["s == s[::-1]"],
            solution: 's = "racecar"\nprint(s == s[::-1])'
          }
        ],
      },
      {
        id: "l-string-methods",
        title: "String methods",
        summary: "split, join, replace, strip.",
        prose: `
# Methods to know

- \`.upper()\` / \`.lower()\`
- \`.strip()\` removes whitespace at the ends
- \`.split(sep)\` returns a list
- \`"-".join(items)\` glues a list back together
- \`.replace(a, b)\`
- \`.startswith(p)\` / \`.endswith(p)\`
        `,
        exercises: [
          {
            prompt: 'Given line = "  hello, world  ", produce a clean lowercase version without surrounding spaces and print it.',
            starter: 'line = "  hello, world  "\n',
            stdoutEquals: "hello, world\n",
            hints: [".strip() then .lower()"],
            solution: 'line = "  hello, world  "\nprint(line.strip().lower())'
          },
          {
            prompt: 'Given csv = "ada,grace,linus", produce a list names. Print names.',
            starter: 'csv = "ada,grace,linus"\n',
            check: `assert names == ["ada","grace","linus"]`,
            stdoutContains: "ada",
            hints: ["csv.split(\",\")"],
            solution: 'csv = "ada,grace,linus"\nnames = csv.split(",")\nprint(names)'
          }
        ],
      }
    ],
  },

  {
    id: "u-files-errors",
    title: "Files & Errors",
    summary: "I/O and try/except.",
    icon: "06",
    lessons: [
      {
        id: "l-exceptions",
        title: "Exceptions",
        summary: "Handle errors with try/except.",
        prose: `
# Exceptions

Errors are objects. Catch them:

\`\`\`python
try:
    n = int(input())
except ValueError:
    print("not a number")
\`\`\`

Common ones: \`ValueError\`, \`TypeError\`, \`KeyError\`, \`IndexError\`, \`ZeroDivisionError\`.
        `,
        exercises: [
          {
            prompt: 'Write safe_div(a, b) that returns a / b, or returns "error" on ZeroDivisionError.',
            check: `assert safe_div(10, 2) == 5
assert safe_div(7, 0) == "error"
print("CHECK_OK")`,
            hints: ["try / except ZeroDivisionError"],
            solution: 'def safe_div(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "error"'
          }
        ],
      }
    ],
  },

  {
    id: "u-oop",
    title: "Classes",
    summary: "OOP basics.",
    icon: "07",
    lessons: [
      {
        id: "l-classes",
        title: "Defining a class",
        summary: "__init__, attributes, methods.",
        prose: `
# Classes

A class is a blueprint for objects.

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name
    def bark(self):
        return f"{self.name} says woof"

d = Dog("Rex")
print(d.bark())
\`\`\`

\`__init__\` is the constructor. \`self\` refers to the instance.
        `,
        exercises: [
          {
            prompt: 'Define a class Counter with start=0. Methods: tick() increments by 1, value() returns current count.',
            check: `c = Counter()
assert c.value() == 0
c.tick(); c.tick(); c.tick()
assert c.value() == 3
print("CHECK_OK")`,
            hints: ["self.n = 0 inside __init__"],
            solution: 'class Counter:\n    def __init__(self):\n        self.n = 0\n    def tick(self):\n        self.n += 1\n    def value(self):\n        return self.n'
          }
        ],
      }
    ],
  },

  {
    id: "u-advanced",
    title: "Advanced",
    summary: "Comprehensions, lambdas, modules.",
    icon: "08",
    lessons: [
      {
        id: "l-comprehensions",
        title: "Comprehensions",
        summary: "Build collections in one line.",
        prose: `
# Comprehensions

List, dict, and set comprehensions are the idiomatic way to transform data.

\`\`\`python
squares = [x*x for x in range(10)]
evens   = [x for x in range(20) if x % 2 == 0]
by_len  = {w: len(w) for w in ["one", "two", "three"]}
\`\`\`
        `,
        exercises: [
          {
            prompt: 'Build squares — a list of squares of even numbers from 0 to 19, inclusive.',
            check: `assert squares == [0,4,16,36,64,100,144,196,256,324]`,
            hints: ["[x*x for x in range(20) if x % 2 == 0]"],
            solution: 'squares = [x*x for x in range(20) if x % 2 == 0]\nprint(squares)'
          }
        ],
      },
      {
        id: "l-lambdas",
        title: "Lambdas & higher-order",
        summary: "Functions as values.",
        prose: `
# Lambdas

Tiny anonymous functions. Use them with \`sorted\`, \`map\`, \`filter\`, \`max\`.

\`\`\`python
words = ["banana", "fig", "apple"]
print(sorted(words, key=lambda w: len(w)))
\`\`\`
        `,
        exercises: [
          {
            prompt: 'Sort pairs = [(1,"b"),(3,"a"),(2,"c")] by the second item. Store sorted list in result.',
            starter: 'pairs = [(1,"b"),(3,"a"),(2,"c")]\n',
            check: `assert result == [(3,"a"),(1,"b"),(2,"c")]`,
            hints: ["sorted(pairs, key=lambda p: p[1])"],
            solution: 'pairs = [(1,"b"),(3,"a"),(2,"c")]\nresult = sorted(pairs, key=lambda p: p[1])\nprint(result)'
          }
        ],
      }
    ],
  }
];

// Flat list helper
window.ALL_LESSONS = LESSONS.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id, unitTitle: u.title })));
window.findLesson = id => ALL_LESSONS.find(l => l.id === id);
window.lessonNeighbors = id => {
  const i = ALL_LESSONS.findIndex(l => l.id === id);
  return { prev: ALL_LESSONS[i - 1], next: ALL_LESSONS[i + 1] };
};
