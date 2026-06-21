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
  },

  // ----------------------------------------------------------------
  // Unit 9: Coding AI / Machine Learning
  // Built entirely from scratch in pure Python — no external libs.
  // Pyodide can install scikit-learn / numpy via micropip, but the
  // point of this unit is to demystify what the libraries do.
  // ----------------------------------------------------------------
  {
    id: "u-ml",
    title: "Coding AI",
    summary: "Build the machine-learning building blocks from scratch.",
    icon: "09",
    lessons: [
      {
        id: "l-ml-intro",
        title: "What is Machine Learning?",
        summary: "Predictors, features, labels — and the simplest model: a rule.",
        prose: `
# What is Machine Learning?

A machine learning model is just **a program that turns input into a prediction**.
The input is a *feature*; the prediction is a *label*. Training means tuning
the program so its predictions match real labels.

Before reaching for fancy algorithms, the simplest model is a hand-written rule.
A "rule-based" model is still a predictor — it just doesn't learn.

\`\`\`python
def classify(temp):
    if temp >= 80:
        return "hot"
    elif temp < 60:
        return "cold"
    return "mild"

print(classify(75))   # mild
print(classify(95))   # hot
\`\`\`

Real ML replaces those hand-typed thresholds with numbers an algorithm finds for you.
Same shape — just learned instead of typed.
        `,
        exercises: [
          {
            prompt: "Write predict(score) that returns 'pass' if score >= 60, otherwise 'fail'. This is your first model: a one-rule classifier.",
            starter: "def predict(score):\n    # TODO: return 'pass' or 'fail'\n    pass\n",
            check: `assert predict(60) == "pass"
assert predict(59) == "fail"
assert predict(100) == "pass"
assert predict(0) == "fail"
print("CHECK_OK")`,
            hints: ["Use an if/else", "60 is the cutoff — equal counts as pass"],
            solution: 'def predict(score):\n    return "pass" if score >= 60 else "fail"\n\nprint(predict(75))'
          }
        ],
      },
      {
        id: "l-ml-distance",
        title: "Distance & similarity",
        summary: "Euclidean distance — the foundation of k-nearest-neighbors.",
        prose: `
# How do we measure "close"?

The simplest *learning* algorithm is **k-nearest neighbors (kNN)**:
to classify a new point, look at the *k* closest training points and copy
their label.

"Closest" usually means **Euclidean distance** — straight-line distance:
sum the squared differences of each coordinate, then take the square root.

\`\`\`python
import math

def distance(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

print(distance((0, 0), (3, 4)))   # 5.0  (the 3-4-5 right triangle)
\`\`\`

Once you can measure distance, kNN is one more loop: sort all training points
by distance to the query, take the closest k, return the majority label.
        `,
        exercises: [
          {
            prompt: "Implement distance(a, b) returning Euclidean distance. Both points are lists/tuples of the same length.",
            starter: "import math\n\ndef distance(a, b):\n    # TODO\n    pass\n",
            check: `import math
assert distance((0,0), (3,4)) == 5
assert abs(distance((1,2,3), (4,6,3)) - 5.0) < 1e-9
assert distance((0,), (0,)) == 0
assert abs(distance([1,1], [4,5]) - 5.0) < 1e-9
print("CHECK_OK")`,
            hints: ["zip(a, b) pairs up coordinates", "Square the differences, sum, then sqrt"],
            solution: 'import math\n\ndef distance(a, b):\n    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))\n\nprint(distance((0,0), (3,4)))'
          }
        ],
      },
      {
        id: "l-ml-loss",
        title: "Measuring error",
        summary: "Mean squared error — how models know how wrong they are.",
        prose: `
# How do you score a wrong prediction?

A model that predicts \`5\` when the truth was \`4\` is a little wrong.
A model that predicts \`50\` is *very* wrong. We need a number that captures this.

**Mean squared error (MSE)** is the standard:

\`\`\`python
def mse(predictions, actuals):
    return sum((p - a) ** 2 for p, a in zip(predictions, actuals)) / len(predictions)
\`\`\`

Three nice properties:

- **Squaring** makes big mistakes count disproportionately more.
- **Squaring** also drops the sign — too-low and too-high are equally bad.
- **Averaging** means MSE doesn't grow with the dataset size.

Training a model means: change its parameters in whatever direction makes MSE smaller.
That's literally what gradient descent does.
        `,
        exercises: [
          {
            prompt: "Implement mse(predictions, actuals) returning the mean squared error.",
            starter: "def mse(predictions, actuals):\n    # TODO\n    pass\n",
            check: `assert mse([1,2,3], [1,2,3]) == 0
assert mse([1,2,3], [2,3,4]) == 1.0
assert abs(mse([0,0], [3,4]) - 12.5) < 1e-9
assert abs(mse([10], [20]) - 100) < 1e-9
print("CHECK_OK")`,
            hints: ["zip(predictions, actuals) gives (p, a) pairs", "Square the differences, sum, divide by the count"],
            solution: 'def mse(predictions, actuals):\n    return sum((p - a) ** 2 for p, a in zip(predictions, actuals)) / len(predictions)\n\nprint(mse([1,2,3], [2,3,4]))'
          }
        ],
      },
      {
        id: "l-ml-neuron",
        title: "A neuron from scratch",
        summary: "Sigmoid + a single neuron — the building block of every neural net.",
        prose: `
# What's actually inside a neural network?

A "neuron" is two steps:

1. **Weighted sum** of inputs: \`z = w1*x1 + w2*x2 + ... + bias\`
2. **Activation**: squish \`z\` into a useful range. The classic activation is
   the *sigmoid*: \`σ(z) = 1 / (1 + e^-z)\`. It maps any real number to a value
   between 0 and 1, which makes it useful for "is this true?"-style outputs.

\`\`\`python
import math

def sigmoid(z):
    return 1 / (1 + math.exp(-z))

def neuron(inputs, weights, bias):
    z = sum(i * w for i, w in zip(inputs, weights)) + bias
    return sigmoid(z)

# "Should I take an umbrella?" — features: [chance_of_rain, low_temp_flag]
print(neuron([0.9, 1.0], [3.0, 2.0], -2.0))   # ~0.97 → yes
print(neuron([0.1, 0.0], [3.0, 2.0], -2.0))   # ~0.15 → no
\`\`\`

Stack a few hundred of these into layers, train them with gradient descent,
and you've got the foundation of every modern AI system — including the model
answering your messages right now.
        `,
        exercises: [
          {
            prompt: "Implement sigmoid(z) = 1 / (1 + e^-z). The math module gives you math.exp.",
            starter: "import math\n\ndef sigmoid(z):\n    # TODO\n    pass\n",
            check: `import math
assert abs(sigmoid(0) - 0.5) < 1e-9
assert sigmoid(100) > 0.99
assert sigmoid(-100) < 0.01
assert abs(sigmoid(1) - 0.7310585786) < 1e-6
assert abs(sigmoid(-1) - 0.2689414214) < 1e-6
print("CHECK_OK")`,
            hints: ["math.exp(-z) gives e^(-z)", "Watch the parens — denominator is (1 + exp(-z))"],
            solution: 'import math\n\ndef sigmoid(z):\n    return 1 / (1 + math.exp(-z))\n\nprint(sigmoid(0))\nprint(sigmoid(1))'
          }
        ],
      }
    ],
  },

  // ----------------------------------------------------------------
  // Unit 10: Toolbox — Python's standard library
  // The "batteries included" parts learners reach for daily.
  // ----------------------------------------------------------------
  {
    id: "u-toolbox",
    title: "Toolbox",
    summary: "Random, datetime, collections, itertools — the daily-driver stdlib.",
    icon: "10",
    lessons: [
      {
        id: "l-std-random",
        title: "Randomness",
        summary: "Dice rolls, shuffles, and reproducible randomness with seed.",
        prose: `
# The random module

Python's \`random\` module gives you cheap, fast pseudo-randomness.
The functions you'll reach for 90% of the time:

\`\`\`python
import random

random.randint(1, 6)        # 1, 2, 3, 4, 5, or 6 (both ends inclusive)
random.random()             # float in [0.0, 1.0)
random.choice(["a","b","c"])# pick one
random.shuffle(my_list)     # in-place
random.sample(my_list, 3)   # 3 unique picks without replacement
\`\`\`

For tests or reproducibility, **seed** the generator first:

\`\`\`python
random.seed(42)
# Now every random.* call is deterministic across runs.
\`\`\`

Turtle graphics need a desktop window so they can't run in the browser,
but random walks, dice games, and procedural worlds all do.
        `,
        exercises: [
          {
            prompt: "Write roll(sides) that returns a random integer between 1 and sides (inclusive). Use random.randint.",
            starter: "import random\n\ndef roll(sides):\n    # TODO\n    pass\n",
            check: `import random
random.seed(0)
xs = [roll(6) for _ in range(200)]
assert all(isinstance(x, int) for x in xs)
assert all(1 <= x <= 6 for x in xs)
assert set(xs) == {1,2,3,4,5,6}, "Should cover every face after 200 rolls"
random.seed(0)
assert isinstance(roll(20), int)
print("CHECK_OK")`,
            hints: ["random.randint(a, b) — both ends are inclusive"],
            solution: 'import random\n\ndef roll(sides):\n    return random.randint(1, sides)\n\nprint(roll(6))'
          }
        ],
      },
      {
        id: "l-std-datetime",
        title: "Dates and times",
        summary: "Today, deltas, formatting, parsing.",
        prose: `
# datetime — dates without tears

\`\`\`python
from datetime import date, datetime, timedelta

today = date.today()
birthday = date(2008, 5, 12)

age_days = (today - birthday).days        # subtracting dates gives a timedelta
in_a_week = today + timedelta(days=7)

# Formatting / parsing strings
text = today.strftime("%Y-%m-%d")          # "2026-06-21"
parsed = datetime.strptime("2024-01-15", "%Y-%m-%d").date()
\`\`\`

Two gotchas:

- \`date\` (no time) and \`datetime\` (date + time) are different types.
- Subtracting two \`date\` objects gives a \`timedelta\`. Read its \`.days\`.
        `,
        exercises: [
          {
            prompt: "Write days_between(d1, d2) that returns the absolute number of days between two date objects.",
            starter: "from datetime import date\n\ndef days_between(d1, d2):\n    # TODO\n    pass\n",
            check: `from datetime import date
assert days_between(date(2024,1,1), date(2024,1,10)) == 9
assert days_between(date(2024,1,10), date(2024,1,1)) == 9
assert days_between(date(2024,1,1), date(2024,1,1)) == 0
assert days_between(date(2020,1,1), date(2024,1,1)) == 1461  # 2020 was a leap year
print("CHECK_OK")`,
            hints: ["Subtract the dates — the result has a .days attribute", "abs() handles either order"],
            solution: 'from datetime import date\n\ndef days_between(d1, d2):\n    return abs((d1 - d2).days)\n\nprint(days_between(date(2024,1,1), date(2024,12,31)))'
          }
        ],
      },
      {
        id: "l-std-collections",
        title: "Counter & defaultdict",
        summary: "Stop reinventing histograms.",
        prose: `
# collections — the dict's smarter cousins

**Counter** counts things. It's basically a dict with batteries:

\`\`\`python
from collections import Counter

words = "the cat sat on the mat".split()
c = Counter(words)
print(c)                # Counter({'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1})
print(c.most_common(2)) # [('the', 2), ('cat', 1)]
\`\`\`

**defaultdict** stops the \`if key not in d: d[key] = []\` dance:

\`\`\`python
from collections import defaultdict

groups = defaultdict(list)
for word in ["apple", "ant", "banana"]:
    groups[word[0]].append(word)
# groups → {'a': ['apple', 'ant'], 'b': ['banana']}
\`\`\`
        `,
        exercises: [
          {
            prompt: "Write most_common_word(text) returning the most common word (case-insensitive, split on whitespace).",
            starter: "from collections import Counter\n\ndef most_common_word(text):\n    # TODO\n    pass\n",
            check: `from collections import Counter
assert most_common_word("the cat sat on the mat") == "the"
assert most_common_word("Hello hello WORLD") == "hello"
assert most_common_word("one") == "one"
print("CHECK_OK")`,
            hints: ["Lowercase the text first", ".most_common(1) returns a list of (word, count) tuples"],
            solution: 'from collections import Counter\n\ndef most_common_word(text):\n    c = Counter(text.lower().split())\n    return c.most_common(1)[0][0]\n\nprint(most_common_word("the the cat"))'
          }
        ],
      },
      {
        id: "l-std-itertools",
        title: "itertools tricks",
        summary: "Combinations, permutations, chains, and other power tools.",
        prose: `
# itertools — the iterator algebra

\`\`\`python
from itertools import combinations, permutations, product, chain, count, cycle

list(combinations([1,2,3], 2))   # [(1,2), (1,3), (2,3)]   — order doesn't matter
list(permutations([1,2,3], 2))   # [(1,2),(1,3),(2,1),...] — order matters
list(product([1,2], ["a","b"]))  # [(1,'a'),(1,'b'),(2,'a'),(2,'b')]
list(chain([1,2], [3,4]))        # [1,2,3,4]
# count() and cycle() are infinite — only use them inside loops with a break.
\`\`\`

These are written in C and run nearly as fast as a hand-rolled loop in C,
so they're not just elegance — they're often the fastest option.
        `,
        exercises: [
          {
            prompt: "Write pairs(items) returning a list of all 2-element tuples (i,j) where i comes before j in items.",
            starter: "from itertools import combinations\n\ndef pairs(items):\n    # TODO\n    pass\n",
            check: `from itertools import combinations
assert pairs([1,2,3]) == [(1,2),(1,3),(2,3)]
assert pairs([]) == []
assert pairs([1]) == []
assert pairs(["a","b","c","d"]) == [("a","b"),("a","c"),("a","d"),("b","c"),("b","d"),("c","d")]
print("CHECK_OK")`,
            hints: ["combinations(items, 2) yields tuples", "Wrap in list() to get a list"],
            solution: 'from itertools import combinations\n\ndef pairs(items):\n    return list(combinations(items, 2))\n\nprint(pairs([1,2,3,4]))'
          }
        ],
      }
    ],
  },

  // ----------------------------------------------------------------
  // Unit 11: Text & Patterns
  // Regex, JSON, parsing — the stuff every real Python job touches.
  // ----------------------------------------------------------------
  {
    id: "u-text",
    title: "Text & Patterns",
    summary: "Regex, JSON, and parsing real-world text.",
    icon: "11",
    lessons: [
      {
        id: "l-text-regex",
        title: "Regex basics",
        summary: "Searching for patterns with the re module.",
        prose: `
# Regular expressions

A regex is a tiny language for describing patterns in text. The cheat sheet:

| Pattern | Matches |
|---------|---------|
| \`.\` | any character (except newline) |
| \`\\d\` | a digit \`0-9\` |
| \`\\w\` | a "word" character (letters, digits, _) |
| \`\\s\` | whitespace |
| \`+\` | one or more of the previous |
| \`*\` | zero or more |
| \`?\` | zero or one |
| \`[abc]\` | any of a, b, or c |
| \`^\` / \`$\` | start / end of line |

\`\`\`python
import re

re.search(r"\\d+", "I have 12 apples").group()   # "12"
re.findall(r"\\w+", "Hello, world!")              # ["Hello", "world"]
re.sub(r"\\s+", "-", "a   b   c")                 # "a-b-c"
\`\`\`

Always prefix patterns with \`r\` (raw string) so \`\\d\` isn't interpreted as an escape.
        `,
        exercises: [
          {
            prompt: "Write find_numbers(text) that returns a list of all numbers in the string (as strings, in order).",
            starter: "import re\n\ndef find_numbers(text):\n    # TODO\n    pass\n",
            check: `import re
assert find_numbers("I have 3 apples and 17 oranges") == ["3", "17"]
assert find_numbers("no numbers here") == []
assert find_numbers("1 2 3 4 5") == ["1","2","3","4","5"]
assert find_numbers("year 2024 and 1999") == ["2024", "1999"]
print("CHECK_OK")`,
            hints: ["re.findall returns a list", "Use r\"\\d+\" to match one or more digits"],
            solution: 'import re\n\ndef find_numbers(text):\n    return re.findall(r"\\d+", text)\n\nprint(find_numbers("3 cats and 12 dogs"))'
          }
        ],
      },
      {
        id: "l-text-regex-groups",
        title: "Capture groups",
        summary: "Pull pieces out of a pattern with parentheses.",
        prose: `
# Capture groups

Parentheses in a regex pull out the matched piece:

\`\`\`python
import re

m = re.match(r"(\\d{4})-(\\d{2})-(\\d{2})", "2024-01-15")
m.group(0)   # "2024-01-15" — the whole match
m.group(1)   # "2024"
m.groups()   # ("2024", "01", "15")
\`\`\`

For "find all occurrences" use \`findall\` — it returns tuples when there are
multiple groups:

\`\`\`python
re.findall(r"(\\w+)=(\\w+)", "a=1 b=2 c=3")
# [('a', '1'), ('b', '2'), ('c', '3')]
\`\`\`
        `,
        exercises: [
          {
            prompt: "Write parse_date(s) that parses a string like '2024-01-15' into a tuple (year, month, day) of ints.",
            starter: "import re\n\ndef parse_date(s):\n    # TODO\n    pass\n",
            check: `import re
assert parse_date("2024-01-15") == (2024, 1, 15)
assert parse_date("1999-12-31") == (1999, 12, 31)
assert parse_date("2000-02-29") == (2000, 2, 29)
print("CHECK_OK")`,
            hints: ["Match with three capture groups", "Convert each group to int"],
            solution: 'import re\n\ndef parse_date(s):\n    m = re.match(r"(\\d{4})-(\\d{2})-(\\d{2})", s)\n    y, mo, d = m.groups()\n    return (int(y), int(mo), int(d))\n\nprint(parse_date("2024-12-25"))'
          }
        ],
      },
      {
        id: "l-text-json",
        title: "JSON",
        summary: "Reading and writing JSON — the universal data format.",
        prose: `
# JSON

Every API on the internet speaks JSON. Python's \`json\` module turns it into
plain dicts and lists.

\`\`\`python
import json

# String → Python
data = json.loads('{"name": "Alice", "age": 30}')
print(data["name"])   # "Alice"

# Python → string
out = json.dumps({"x": 1, "y": [2, 3]})
print(out)            # '{"x": 1, "y": [2, 3]}'

# Pretty-print with indentation
print(json.dumps(data, indent=2))
\`\`\`

Naming gotcha: \`json.loads\` (load **s**tring) vs \`json.load\` (load from a **f**ile).
        `,
        exercises: [
          {
            prompt: "Given a JSON string of an array of user objects with name and age fields, write adults(text) returning the list of names where age >= 18, in original order.",
            starter: "import json\n\ndef adults(text):\n    # TODO\n    pass\n",
            check: `import json
assert adults('[{"name":"Alice","age":30},{"name":"Bob","age":15}]') == ["Alice"]
assert adults('[{"name":"Carol","age":18}]') == ["Carol"]
assert adults('[]') == []
assert adults('[{"name":"Dan","age":17},{"name":"Eve","age":40},{"name":"Frank","age":17}]') == ["Eve"]
print("CHECK_OK")`,
            hints: ["json.loads(text) gives you a list of dicts", "A list comprehension over the parsed list"],
            solution: 'import json\n\ndef adults(text):\n    users = json.loads(text)\n    return [u["name"] for u in users if u["age"] >= 18]\n\nprint(adults(\'[{"name":"Alice","age":30}]\'))'
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
