// ============================================================
// FLASHCARDS — concept review with optional code snippets.
// Categories let users review by topic.
// Spaced repetition uses a simple SM-0 style schedule.
// ============================================================

window.FLASHCARDS = [
  // Basics
  { id: "fc-len",      cat: "Basics",   term: "len()",          def: "Returns the number of items: <code>len([1,2,3]) == 3</code>" },
  { id: "fc-print",    cat: "Basics",   term: "print()",        def: "Writes to stdout. <code>print('a', 'b', sep='-')</code> → <code>a-b</code>" },
  { id: "fc-input",    cat: "Basics",   term: "input()",        def: "Reads a line of text from stdin. Always returns a string." },
  { id: "fc-fstring",  cat: "Basics",   term: "f-string",       def: "<code>f'hi {name}'</code> embeds expressions inside a string literal." },
  { id: "fc-type",     cat: "Basics",   term: "type()",         def: "Returns the type of a value: <code>type(3.14) == float</code>" },

  // Strings
  { id: "fc-strip",    cat: "Strings",  term: ".strip()",       def: "Removes leading/trailing whitespace from a string." },
  { id: "fc-split",    cat: "Strings",  term: ".split(sep)",    def: "Splits a string by separator, returning a list of pieces." },
  { id: "fc-join",     cat: "Strings",  term: "sep.join(seq)",  def: "Joins iterable of strings with separator: <code>'-'.join(['a','b']) == 'a-b'</code>" },
  { id: "fc-slice",    cat: "Strings",  term: "slicing",        def: "<code>s[a:b:step]</code> — half-open. Negative indices count from the end." },
  { id: "fc-replace",  cat: "Strings",  term: ".replace(a,b)",  def: "Returns a new string with every occurrence of a replaced by b." },

  // Lists
  { id: "fc-append",   cat: "Lists",    term: ".append(x)",     def: "Adds x to the end of the list (mutates)." },
  { id: "fc-extend",   cat: "Lists",    term: ".extend(it)",    def: "Adds every element of iterable it to the list." },
  { id: "fc-pop",      cat: "Lists",    term: ".pop(i=-1)",     def: "Removes and returns the element at index i (default last)." },
  { id: "fc-sort",     cat: "Lists",    term: ".sort()",        def: "Sorts in-place. Use <code>sorted(xs)</code> for a new list." },
  { id: "fc-listcomp", cat: "Lists",    term: "list comp",      def: "<code>[expr for x in it if cond]</code> builds a list inline." },

  // Dicts / Sets
  { id: "fc-get",      cat: "Dicts",    term: ".get(k, d)",     def: "Returns d[k] if present, otherwise default d (no KeyError)." },
  { id: "fc-items",    cat: "Dicts",    term: ".items()",       def: "Iterates (key, value) pairs: <code>for k, v in d.items()</code>" },
  { id: "fc-setops",   cat: "Sets",     term: "set ops",        def: "<code>a | b</code> union · <code>a & b</code> intersection · <code>a - b</code> difference" },

  // Functions
  { id: "fc-def",      cat: "Funcs",    term: "def",            def: "Defines a function: <code>def name(args):</code>" },
  { id: "fc-default",  cat: "Funcs",    term: "defaults",       def: "Parameter defaults: <code>def f(x, k=0):</code>. Avoid mutable defaults!" },
  { id: "fc-args",     cat: "Funcs",    term: "*args / **kwargs", def: "<code>*args</code> packs positional, <code>**kwargs</code> packs keyword arguments." },
  { id: "fc-lambda",   cat: "Funcs",    term: "lambda",         def: "Anonymous one-expression function: <code>lambda x: x*2</code>" },

  // Control
  { id: "fc-range",    cat: "Control",  term: "range",          def: "<code>range(stop)</code> · <code>range(start, stop[, step])</code>. stop is exclusive." },
  { id: "fc-enum",     cat: "Control",  term: "enumerate",      def: "<code>for i, x in enumerate(xs):</code> — index + value pairs." },
  { id: "fc-zip",      cat: "Control",  term: "zip",            def: "Pairs elements from multiple iterables, stops at the shortest." },

  // Errors
  { id: "fc-try",      cat: "Errors",   term: "try/except",     def: "Catch exceptions: <code>try: ... except ValueError as e: ...</code>" },
  { id: "fc-raise",    cat: "Errors",   term: "raise",          def: "Raise an exception: <code>raise ValueError('bad input')</code>" },

  // Classes
  { id: "fc-init",     cat: "Classes",  term: "__init__",       def: "Instance constructor. First parameter is <code>self</code>." },
  { id: "fc-self",     cat: "Classes",  term: "self",           def: "Reference to the current instance inside instance methods." },
  { id: "fc-inherit",  cat: "Classes",  term: "inheritance",    def: "<code>class Dog(Animal):</code> — Dog inherits from Animal." },
];

window.FLASH_CATS = Array.from(new Set(FLASHCARDS.map(f => f.cat)));
