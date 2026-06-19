// ============================================================
// CHALLENGES — standalone coding exercises with auto-grading.
// Difficulty: easy | medium | hard
// XP varies by difficulty.
// ============================================================

window.CHALLENGES = [
  // ----- EASY -----
  {
    id: "c-fizzbuzz",
    title: "FizzBuzz",
    summary: "The classic — print 1..30 with Fizz/Buzz substitutions.",
    difficulty: "easy", xp: 10,
    tags: ["loops", "conditionals"],
    description: `For each number 1 through 30 (inclusive), print:
- "Fizz" if divisible by 3
- "Buzz" if divisible by 5
- "FizzBuzz" if divisible by both
- otherwise the number itself

One per line.`,
    starter: '',
    stdoutEquals: Array.from({length:30}, (_,i) => {
      const n = i + 1;
      if (n % 15 === 0) return "FizzBuzz";
      if (n % 3 === 0) return "Fizz";
      if (n % 5 === 0) return "Buzz";
      return String(n);
    }).join("\n") + "\n",
    hints: ["Check divisible-by-15 first.", "Use n % 3 and n % 5."],
    solution: 'for n in range(1, 31):\n    if n % 15 == 0: print("FizzBuzz")\n    elif n % 3 == 0: print("Fizz")\n    elif n % 5 == 0: print("Buzz")\n    else: print(n)'
  },
  {
    id: "c-reverse-string",
    title: "Reverse a string",
    summary: "Write reverse(s) -> str.",
    difficulty: "easy", xp: 10, tags: ["strings"],
    description: 'Define `reverse(s)` that returns `s` reversed.',
    check: `assert reverse("hello") == "olleh"
assert reverse("") == ""
assert reverse("a") == "a"
print("CHECK_OK")`,
    hints: ["Slicing: s[::-1]"],
    solution: 'def reverse(s):\n    return s[::-1]'
  },
  {
    id: "c-sum-list",
    title: "Sum a list",
    summary: "Without using sum().",
    difficulty: "easy", xp: 10, tags: ["loops"],
    description: 'Define `total(xs)` that returns the sum of a list of numbers without calling Python\'s built-in `sum`.',
    check: `assert total([1,2,3,4]) == 10
assert total([]) == 0
assert total([-1, 1]) == 0
print("CHECK_OK")`,
    hints: ["Accumulator in a for loop."],
    solution: 'def total(xs):\n    t = 0\n    for x in xs: t += x\n    return t'
  },
  {
    id: "c-count-vowels",
    title: "Count vowels",
    summary: "How many vowels in a string?",
    difficulty: "easy", xp: 10, tags: ["strings"],
    description: 'Define `count_vowels(s)` returning the number of `a, e, i, o, u` (case-insensitive) in `s`.',
    check: `assert count_vowels("Hello") == 2
assert count_vowels("xyz") == 0
assert count_vowels("AEIOU") == 5
print("CHECK_OK")`,
    hints: ["Use a set of vowels.", "Compare s.lower()[i] to that set."],
    solution: 'def count_vowels(s):\n    return sum(1 for c in s.lower() if c in "aeiou")'
  },
  {
    id: "c-max-list",
    title: "Find the max",
    summary: "Without using max().",
    difficulty: "easy", xp: 10, tags: ["loops"],
    description: 'Define `biggest(xs)` returning the largest element of a non-empty list, without using `max`.',
    check: `assert biggest([3,1,4,1,5,9,2,6]) == 9
assert biggest([-7,-3,-9]) == -3
assert biggest([42]) == 42
print("CHECK_OK")`,
    hints: ["Start with xs[0]."],
    solution: 'def biggest(xs):\n    m = xs[0]\n    for x in xs[1:]:\n        if x > m: m = x\n    return m'
  },
  {
    id: "c-celsius",
    title: "Celsius → Fahrenheit",
    summary: "Convert temperatures.",
    difficulty: "easy", xp: 5, tags: ["math"],
    description: 'Define `to_f(c)` returning `c * 9/5 + 32` as a number.',
    check: `assert abs(to_f(0) - 32) < 1e-9
assert abs(to_f(100) - 212) < 1e-9
assert abs(to_f(-40) - (-40)) < 1e-9
print("CHECK_OK")`,
    hints: ["return c * 9/5 + 32"],
    solution: 'def to_f(c):\n    return c * 9/5 + 32'
  },
  {
    id: "c-palindrome",
    title: "Is it a palindrome?",
    summary: "Ignore case and spaces.",
    difficulty: "easy", xp: 10, tags: ["strings"],
    description: 'Define `is_palin(s)` -> bool. Ignore case and spaces.',
    check: `assert is_palin("Race car")
assert is_palin("noon")
assert not is_palin("python")
print("CHECK_OK")`,
    hints: ["Lowercase, remove spaces, compare to reverse."],
    solution: 'def is_palin(s):\n    t = s.lower().replace(" ", "")\n    return t == t[::-1]'
  },

  // ----- MEDIUM -----
  {
    id: "c-fib",
    title: "Fibonacci",
    summary: "Nth Fibonacci number, iteratively.",
    difficulty: "medium", xp: 20, tags: ["recursion", "loops"],
    description: 'Define `fib(n)` returning the nth Fibonacci number. fib(0)=0, fib(1)=1, fib(2)=1, …',
    check: `assert fib(0) == 0
assert fib(1) == 1
assert fib(10) == 55
assert fib(20) == 6765
print("CHECK_OK")`,
    hints: ["Two-variable rolling update."],
    solution: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a'
  },
  {
    id: "c-anagram",
    title: "Anagram check",
    summary: "Same letters, any order.",
    difficulty: "medium", xp: 15, tags: ["strings"],
    description: 'Define `anagram(a, b)` returning True if `a` and `b` are anagrams (same letters, ignoring spaces and case).',
    check: `assert anagram("listen", "silent")
assert anagram("Astronomer", "Moon starer")
assert not anagram("hello", "olleh!")
print("CHECK_OK")`,
    hints: ["Compare sorted lowercase versions."],
    solution: 'def anagram(a, b):\n    norm = lambda s: sorted(s.lower().replace(" ", ""))\n    return norm(a) == norm(b)'
  },
  {
    id: "c-flatten",
    title: "Flatten one level",
    summary: "List of lists -> list.",
    difficulty: "medium", xp: 15, tags: ["lists"],
    description: 'Define `flatten(xs)` taking a list of lists and returning a single flat list (one level only).',
    check: `assert flatten([[1,2],[3,4],[5]]) == [1,2,3,4,5]
assert flatten([]) == []
assert flatten([[]]) == []
print("CHECK_OK")`,
    hints: ["Nested loop, or sum(xs, [])."],
    solution: 'def flatten(xs):\n    out = []\n    for sub in xs:\n        for v in sub: out.append(v)\n    return out'
  },
  {
    id: "c-uniq",
    title: "Unique preserving order",
    summary: "Dedupe but keep first-seen order.",
    difficulty: "medium", xp: 15, tags: ["sets", "lists"],
    description: 'Define `uniq(xs)` returning the elements of `xs` in their first-seen order with duplicates removed.',
    check: `assert uniq([1,2,2,3,1,4]) == [1,2,3,4]
assert uniq([]) == []
assert uniq(["a","b","a"]) == ["a","b"]
print("CHECK_OK")`,
    hints: ["Track a 'seen' set."],
    solution: 'def uniq(xs):\n    seen = set(); out = []\n    for x in xs:\n        if x not in seen:\n            seen.add(x); out.append(x)\n    return out'
  },
  {
    id: "c-fizzbuzz-fn",
    title: "FizzBuzz, generalised",
    summary: "Return a list, not print.",
    difficulty: "medium", xp: 15, tags: ["loops"],
    description: 'Define `fizzbuzz(n)` that returns a list of length `n` with FizzBuzz substitutions for 1..n.',
    check: `assert fizzbuzz(5) == ["1","2","Fizz","4","Buzz"]
assert fizzbuzz(15)[-1] == "FizzBuzz"
assert len(fizzbuzz(30)) == 30
print("CHECK_OK")`,
    hints: ["Use a list comprehension or for-loop."],
    solution: 'def fizzbuzz(n):\n    out = []\n    for i in range(1, n+1):\n        if i % 15 == 0: out.append("FizzBuzz")\n        elif i % 3 == 0: out.append("Fizz")\n        elif i % 5 == 0: out.append("Buzz")\n        else: out.append(str(i))\n    return out'
  },
  {
    id: "c-two-sum",
    title: "Two sum",
    summary: "Find a pair summing to target.",
    difficulty: "medium", xp: 20, tags: ["dicts"],
    description: 'Define `two_sum(xs, target)` returning a tuple of two indices (i, j) with i<j such that xs[i] + xs[j] == target, or None if none exists.',
    check: `assert two_sum([2,7,11,15], 9) == (0,1)
assert two_sum([3,2,4], 6) == (1,2)
assert two_sum([1,2,3], 100) is None
print("CHECK_OK")`,
    hints: ["Walk through the list; remember each value's index in a dict."],
    solution: 'def two_sum(xs, target):\n    seen = {}\n    for i, x in enumerate(xs):\n        if target - x in seen:\n            return (seen[target - x], i)\n        seen[x] = i\n    return None'
  },
  {
    id: "c-word-count",
    title: "Word counter",
    summary: "Build a frequency dict.",
    difficulty: "medium", xp: 15, tags: ["strings", "dicts"],
    description: 'Define `wc(s)` returning a dict mapping each whitespace-separated word in `s` (lowercased) to its count.',
    check: `r = wc("the quick brown fox jumps over the lazy dog the the")
assert r["the"] == 4
assert r["fox"] == 1
assert wc("") == {}
print("CHECK_OK")`,
    hints: ["s.lower().split()", "dict.get(w, 0) + 1"],
    solution: 'def wc(s):\n    out = {}\n    for w in s.lower().split():\n        out[w] = out.get(w, 0) + 1\n    return out'
  },
  {
    id: "c-roman",
    title: "Roman numerals",
    summary: "Convert int → Roman.",
    difficulty: "medium", xp: 25, tags: ["strings", "math"],
    description: 'Define `to_roman(n)` for 1 ≤ n ≤ 3999.',
    check: `assert to_roman(1) == "I"
assert to_roman(4) == "IV"
assert to_roman(9) == "IX"
assert to_roman(58) == "LVIII"
assert to_roman(1994) == "MCMXCIV"
print("CHECK_OK")`,
    hints: ["Pair values and symbols in descending order, including 4/9/40/90/etc."],
    solution: 'def to_roman(n):\n    pairs = [(1000,"M"),(900,"CM"),(500,"D"),(400,"CD"),(100,"C"),(90,"XC"),(50,"L"),(40,"XL"),(10,"X"),(9,"IX"),(5,"V"),(4,"IV"),(1,"I")]\n    out = ""\n    for v, s in pairs:\n        while n >= v: out += s; n -= v\n    return out'
  },

  // ----- HARD -----
  {
    id: "c-balanced",
    title: "Balanced brackets",
    summary: "Validate (), [], {} pairing.",
    difficulty: "hard", xp: 30, tags: ["stacks", "strings"],
    description: 'Define `balanced(s)` returning True if every opening bracket has a matching closing bracket of the same kind, in the right order.',
    check: `assert balanced("()[]{}")
assert balanced("({[]})")
assert not balanced("(]")
assert not balanced("([)]")
assert balanced("")
print("CHECK_OK")`,
    hints: ["Push openers onto a stack; pop on closers and verify match."],
    solution: 'def balanced(s):\n    pairs = {")":"(", "]":"[", "}":"{"}\n    stack = []\n    for c in s:\n        if c in "([{": stack.append(c)\n        elif c in ")]}":\n            if not stack or stack.pop() != pairs[c]: return False\n    return not stack'
  },
  {
    id: "c-merge-sort",
    title: "Merge sort",
    summary: "Implement merge sort.",
    difficulty: "hard", xp: 35, tags: ["recursion", "algorithms"],
    description: 'Define `merge_sort(xs)` returning a sorted copy of the list. Don\'t use list.sort or sorted.',
    check: `assert merge_sort([]) == []
assert merge_sort([1]) == [1]
assert merge_sort([3,1,4,1,5,9,2,6]) == [1,1,2,3,4,5,6,9]
assert merge_sort([5,4,3,2,1]) == [1,2,3,4,5]
print("CHECK_OK")`,
    hints: ["Split, recurse, merge two sorted lists with two pointers."],
    solution: 'def merge_sort(xs):\n    if len(xs) <= 1: return xs[:]\n    m = len(xs) // 2\n    a, b = merge_sort(xs[:m]), merge_sort(xs[m:])\n    out, i, j = [], 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n    out += a[i:] + b[j:]\n    return out'
  },
  {
    id: "c-prime-sieve",
    title: "Sieve of Eratosthenes",
    summary: "All primes up to n.",
    difficulty: "hard", xp: 30, tags: ["math", "algorithms"],
    description: 'Define `primes_to(n)` returning a list of all prime numbers ≤ n.',
    check: `assert primes_to(1) == []
assert primes_to(2) == [2]
assert primes_to(20) == [2,3,5,7,11,13,17,19]
assert len(primes_to(100)) == 25
print("CHECK_OK")`,
    hints: ["Boolean array of length n+1.", "Mark multiples of each prime."],
    solution: 'def primes_to(n):\n    if n < 2: return []\n    s = [True] * (n + 1)\n    s[0] = s[1] = False\n    for i in range(2, int(n**0.5) + 1):\n        if s[i]:\n            for j in range(i*i, n+1, i): s[j] = False\n    return [i for i, p in enumerate(s) if p]'
  },
  {
    id: "c-caesar",
    title: "Caesar cipher",
    summary: "Shift letters by k.",
    difficulty: "hard", xp: 25, tags: ["strings"],
    description: 'Define `caesar(s, k)` shifting only letters by `k` positions (wrap around), preserving case and non-letters.',
    check: `assert caesar("abc", 1) == "bcd"
assert caesar("xyz", 3) == "abc"
assert caesar("Hello, World!", 13) == "Uryyb, Jbeyq!"
assert caesar("ABC", -1) == "ZAB"
print("CHECK_OK")`,
    hints: ["Map each letter using ord(...) and modulo 26."],
    solution: 'def caesar(s, k):\n    out = []\n    for c in s:\n        if "a" <= c <= "z":\n            out.append(chr((ord(c) - 97 + k) % 26 + 97))\n        elif "A" <= c <= "Z":\n            out.append(chr((ord(c) - 65 + k) % 26 + 65))\n        else: out.append(c)\n    return "".join(out)'
  },
];

// Merge in AI-generated challenges saved to localStorage.
try {
  const ai = JSON.parse(localStorage.getItem("pylab.aiChallenges") || "[]");
  if (Array.isArray(ai)) for (const c of ai) if (!CHALLENGES.find(x => x.id === c.id)) CHALLENGES.push(c);
} catch {}

window.findChallenge = id => CHALLENGES.find(c => c.id === id);
