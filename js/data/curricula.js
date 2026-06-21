// ============================================================
// Default curricula for non-Python languages.
//
// Each entry is a unit/lesson skeleton — title, summary, topics.
// The full lesson body (prose + exercise) is still AI-generated on
// first open and cached in localStorage. This file exists so every
// language tab shows a populated lesson list immediately, instead
// of an empty "Generate curriculum" placeholder.
//
// Users can still regenerate via the "Regenerate" button on the
// lessons page; that path replaces this default with an AI-authored
// one.
//
// Adding a new language ≈ adding a key here. Adding a unit/lesson ≈
// pushing onto the arrays. No code changes needed.
// ============================================================

window.DEFAULT_CURRICULA = {

  javascript: [
    { id: "js-basics", icon: "01", title: "JavaScript basics", summary: "Variables, types, and operators.", lessons: [
      { id: "js-vars",       title: "let, const, var",        summary: "Declaration keywords and scope.",          topics: ["let", "const", "var", "block scope"] },
      { id: "js-types",      title: "Types & coercion",       summary: "Strings, numbers, booleans, null, undefined.", topics: ["typeof", "==", "===", "coercion"] },
      { id: "js-operators",  title: "Operators",              summary: "Arithmetic, comparison, logical.",         topics: ["?? ||", "ternary", "short-circuit"] },
    ]},
    { id: "js-control", icon: "02", title: "Control flow", summary: "if, switch, loops.", lessons: [
      { id: "js-if",         title: "if / else",              summary: "Branching with conditions.",              topics: ["if", "else", "truthy/falsy"] },
      { id: "js-loops",      title: "Loops",                  summary: "for, while, for…of, for…in.",             topics: ["for", "while", "for...of", "break/continue"] },
      { id: "js-switch",     title: "switch",                 summary: "Multi-way branching.",                    topics: ["switch", "case", "fallthrough"] },
    ]},
    { id: "js-functions", icon: "03", title: "Functions", summary: "Definitions, arrows, closures.", lessons: [
      { id: "js-fn-decl",    title: "Declaring functions",    summary: "function vs arrow vs expression.",         topics: ["function", "arrow", "hoisting"] },
      { id: "js-params",     title: "Parameters & defaults",  summary: "Defaults, rest, destructuring args.",      topics: ["default params", "rest", "destructuring"] },
      { id: "js-closures",   title: "Closures",               summary: "Functions that remember their scope.",     topics: ["closure", "lexical scope"] },
    ]},
    { id: "js-arrays", icon: "04", title: "Arrays", summary: "Modern array methods.", lessons: [
      { id: "js-arr-basics", title: "Array basics",           summary: "push, pop, length, indexing.",            topics: ["push", "pop", "length"] },
      { id: "js-arr-map",    title: "map, filter, reduce",    summary: "The functional trio.",                    topics: ["map", "filter", "reduce"] },
      { id: "js-spread",     title: "Spread & rest",          summary: "The ... operator in arrays.",              topics: ["spread", "rest"] },
    ]},
    { id: "js-objects", icon: "05", title: "Objects", summary: "Properties, methods, destructuring.", lessons: [
      { id: "js-obj-basics", title: "Object basics",          summary: "Literals, keys, dynamic access.",          topics: ["object literal", "dot vs bracket"] },
      { id: "js-destructure",title: "Destructuring",          summary: "Pull values out cleanly.",                topics: ["destructuring", "renaming", "defaults"] },
      { id: "js-this",       title: "this keyword",           summary: "The mysteries of `this` simplified.",      topics: ["this", "binding", "arrow vs function"] },
    ]},
    { id: "js-strings", icon: "06", title: "Strings", summary: "Templates and string methods.", lessons: [
      { id: "js-template",   title: "Template literals",      summary: "Backtick strings with interpolation.",    topics: ["template literal", "interpolation"] },
      { id: "js-str-methods",title: "Common string methods",  summary: "split, join, includes, trim, replace.",    topics: ["split", "join", "includes", "trim"] },
    ]},
    { id: "js-async", icon: "07", title: "Asynchronous JS", summary: "Promises and async/await.", lessons: [
      { id: "js-promises",   title: "Promises",               summary: "then, catch, finally.",                    topics: ["Promise", "then", "catch"] },
      { id: "js-async-await",title: "async / await",          summary: "Promises with cleaner syntax.",            topics: ["async", "await", "try/catch"] },
      { id: "js-fetch",      title: "fetch & APIs",           summary: "Calling REST APIs from the browser.",      topics: ["fetch", "Response", "JSON"] },
    ]},
    { id: "js-modern", icon: "08", title: "Modern JS", summary: "ES6+ features you'll see daily.", lessons: [
      { id: "js-modules",    title: "Modules",                summary: "import / export, ESM vs CJS.",             topics: ["import", "export", "ESM"] },
      { id: "js-classes",    title: "Classes",                summary: "Constructors, methods, inheritance.",      topics: ["class", "constructor", "extends"] },
      { id: "js-iterators",  title: "Iterators & generators", summary: "Yield, for…of, custom iterables.",         topics: ["iterator", "generator", "yield"] },
    ]},
  ],

  java: [
    { id: "java-basics", icon: "01", title: "Java basics", summary: "Hello world, types, and printing.", lessons: [
      { id: "java-hello",     title: "Hello, world",          summary: "Your first Java program.",                 topics: ["class", "main", "System.out.println"] },
      { id: "java-types",     title: "Primitive types",       summary: "int, long, double, boolean, char.",         topics: ["int", "double", "boolean", "char"] },
      { id: "java-vars",      title: "Variables & constants", summary: "Declaring, assigning, and final.",         topics: ["final", "type inference (var)"] },
    ]},
    { id: "java-control", icon: "02", title: "Control flow", summary: "if, switch, loops.", lessons: [
      { id: "java-if",        title: "if / else",             summary: "Branching in Java.",                       topics: ["if", "else", "boolean expressions"] },
      { id: "java-loops",     title: "for and while",         summary: "Counted and conditional loops.",           topics: ["for", "while", "do-while", "break"] },
      { id: "java-switch",    title: "switch (modern)",       summary: "switch expressions in modern Java.",       topics: ["switch", "yield", "case ->"] },
    ]},
    { id: "java-oop", icon: "03", title: "Object-oriented Java", summary: "Classes, fields, methods.", lessons: [
      { id: "java-classes",   title: "Classes & objects",     summary: "Defining your own types.",                 topics: ["class", "new", "constructor"] },
      { id: "java-encapsulation", title: "Encapsulation",     summary: "Private fields and getters/setters.",      topics: ["private", "public", "getters"] },
      { id: "java-inheritance",   title: "Inheritance",       summary: "extends, super, overriding.",              topics: ["extends", "super", "@Override"] },
      { id: "java-interfaces",    title: "Interfaces",        summary: "Contracts and polymorphism.",              topics: ["interface", "implements"] },
    ]},
    { id: "java-collections", icon: "04", title: "Collections", summary: "ArrayList, HashMap, HashSet.", lessons: [
      { id: "java-arraylist", title: "ArrayList",             summary: "Dynamic arrays.",                          topics: ["ArrayList", "add", "get", "size"] },
      { id: "java-hashmap",   title: "HashMap",               summary: "Key-value storage.",                       topics: ["HashMap", "put", "get", "containsKey"] },
      { id: "java-streams",   title: "Streams",               summary: "Functional pipelines for collections.",    topics: ["stream", "filter", "map", "collect"] },
    ]},
    { id: "java-generics", icon: "05", title: "Generics", summary: "Type-safe containers.", lessons: [
      { id: "java-gen-intro", title: "Why generics?",         summary: "Type safety without casts.",               topics: ["<T>", "generic class"] },
      { id: "java-gen-methods", title: "Generic methods",     summary: "Methods that work on multiple types.",     topics: ["generic method"] },
    ]},
    { id: "java-exceptions", icon: "06", title: "Exceptions", summary: "Throwing and catching.", lessons: [
      { id: "java-try",       title: "try / catch / finally", summary: "Handling errors gracefully.",              topics: ["try", "catch", "finally", "throw"] },
      { id: "java-checked",   title: "Checked exceptions",    summary: "Java's compile-time error contract.",      topics: ["checked", "unchecked", "throws"] },
    ]},
    { id: "java-modern", icon: "07", title: "Modern Java", summary: "Records, sealed classes, pattern matching.", lessons: [
      { id: "java-records",   title: "Records",               summary: "Concise immutable data carriers.",          topics: ["record"] },
      { id: "java-lambdas",   title: "Lambdas",               summary: "Anonymous functions in Java.",             topics: ["lambda", "Function", "Predicate"] },
      { id: "java-pattern",   title: "Pattern matching",      summary: "switch and instanceof patterns.",          topics: ["pattern matching", "sealed"] },
    ]},
    { id: "java-files", icon: "08", title: "I/O & concurrency", summary: "Files and threads.", lessons: [
      { id: "java-files",     title: "Reading files",         summary: "Files.readAllLines and friends.",          topics: ["Files", "Path", "BufferedReader"] },
      { id: "java-threads",   title: "Threads basics",        summary: "Thread, Runnable, ExecutorService.",       topics: ["Thread", "Runnable", "ExecutorService"] },
    ]},
  ],

  html: [
    { id: "html-basics", icon: "01", title: "HTML basics", summary: "Document structure and tags.", lessons: [
      { id: "html-doc",       title: "Document structure",    summary: "doctype, html, head, body.",                topics: ["<!doctype>", "<html>", "<head>", "<body>"] },
      { id: "html-text",      title: "Text elements",         summary: "Headings, paragraphs, emphasis.",          topics: ["h1-h6", "p", "strong", "em"] },
      { id: "html-lists",     title: "Lists",                 summary: "Ordered, unordered, description lists.",   topics: ["ul", "ol", "li", "dl"] },
    ]},
    { id: "html-links", icon: "02", title: "Links & media", summary: "Anchors, images, video.", lessons: [
      { id: "html-anchors",   title: "Links",                 summary: "Anchor tags and URLs.",                    topics: ["<a>", "href", "target"] },
      { id: "html-images",    title: "Images",                summary: "img tag, alt text, formats.",              topics: ["<img>", "alt", "srcset"] },
      { id: "html-media",     title: "Audio & video",         summary: "Embedding media.",                        topics: ["<audio>", "<video>", "controls"] },
    ]},
    { id: "html-forms", icon: "03", title: "Forms", summary: "Input fields and submission.", lessons: [
      { id: "html-form-basic",title: "Form basics",           summary: "form, input, label, button.",              topics: ["<form>", "<input>", "<label>"] },
      { id: "html-input-types",title: "Input types",          summary: "text, email, number, date, radio.",        topics: ["type=", "input types"] },
      { id: "html-validation",title: "Built-in validation",   summary: "required, pattern, min/max.",              topics: ["required", "pattern", "min", "max"] },
    ]},
    { id: "html-tables", icon: "04", title: "Tables", summary: "Tabular data done right.", lessons: [
      { id: "html-table-basic", title: "Table structure",     summary: "table, tr, td, th.",                       topics: ["<table>", "<tr>", "<td>", "<th>"] },
      { id: "html-table-adv",   title: "Accessible tables",   summary: "thead, tbody, scope, caption.",            topics: ["<thead>", "<tbody>", "scope"] },
    ]},
    { id: "html-semantics", icon: "05", title: "Semantic HTML", summary: "Tags with meaning.", lessons: [
      { id: "html-sectioning", title: "Sectioning elements",   summary: "header, nav, main, section, article, footer.", topics: ["semantic", "header", "main", "footer"] },
      { id: "html-figure",    title: "figure & figcaption",   summary: "Captioned content.",                       topics: ["<figure>", "<figcaption>"] },
    ]},
    { id: "html-meta", icon: "06", title: "Head & metadata", summary: "Title, meta, links.", lessons: [
      { id: "html-meta-tags", title: "Meta tags",             summary: "viewport, description, charset.",          topics: ["<meta>", "viewport", "description"] },
      { id: "html-og",        title: "Open Graph & SEO",      summary: "Social media previews.",                   topics: ["og:", "twitter:", "SEO"] },
    ]},
    { id: "html-accessibility", icon: "07", title: "Accessibility", summary: "Make pages usable by everyone.", lessons: [
      { id: "html-aria",      title: "ARIA basics",           summary: "role, aria-label, aria-live.",             topics: ["aria-label", "role"] },
      { id: "html-keyboard",  title: "Keyboard navigation",   summary: "tabindex and focus order.",                topics: ["tabindex", "focus"] },
    ]},
    { id: "html-advanced", icon: "08", title: "Advanced", summary: "Templates, custom elements, modern HTML.", lessons: [
      { id: "html-template",  title: "<template> tag",        summary: "Inert, reusable markup.",                  topics: ["<template>", "<slot>"] },
      { id: "html-iframe",    title: "iframe",                summary: "Embedding other documents.",               topics: ["<iframe>", "sandbox"] },
      { id: "html-dialog",    title: "<dialog>",              summary: "Native modal dialogs.",                    topics: ["<dialog>", "showModal"] },
    ]},
  ],

  css: [
    { id: "css-basics", icon: "01", title: "CSS basics", summary: "Selectors, properties, the cascade.", lessons: [
      { id: "css-syntax",     title: "Syntax",                summary: "Rules, selectors, declarations.",          topics: ["selector", "property", "value"] },
      { id: "css-selectors",  title: "Selectors",             summary: "Type, class, id, attribute, pseudo.",      topics: [".class", "#id", ":hover", "[attr]"] },
      { id: "css-cascade",    title: "Cascade & specificity", summary: "Which rule wins.",                          topics: ["cascade", "specificity", "!important"] },
    ]},
    { id: "css-box", icon: "02", title: "Box model", summary: "Sizing, spacing, borders.", lessons: [
      { id: "css-box-model",  title: "The box model",         summary: "content, padding, border, margin.",        topics: ["box-sizing", "padding", "margin"] },
      { id: "css-display",    title: "display & visibility",  summary: "block, inline, inline-block, none.",       topics: ["display", "visibility"] },
    ]},
    { id: "css-flexbox", icon: "03", title: "Flexbox", summary: "One-dimensional layout.", lessons: [
      { id: "css-flex-basic", title: "Flex container",        summary: "display:flex and flex-direction.",         topics: ["display:flex", "flex-direction"] },
      { id: "css-flex-align", title: "Alignment",             summary: "justify-content, align-items.",            topics: ["justify-content", "align-items"] },
      { id: "css-flex-grow",  title: "flex-grow & shrink",    summary: "Distributing available space.",            topics: ["flex-grow", "flex-shrink", "flex-basis"] },
    ]},
    { id: "css-grid", icon: "04", title: "Grid", summary: "Two-dimensional layout.", lessons: [
      { id: "css-grid-basic", title: "Grid container",        summary: "display:grid and template areas.",         topics: ["display:grid", "grid-template-columns"] },
      { id: "css-grid-areas", title: "Named areas",           summary: "grid-template-areas.",                     topics: ["grid-template-areas"] },
    ]},
    { id: "css-typography", icon: "05", title: "Typography", summary: "Web fonts and text styling.", lessons: [
      { id: "css-font",       title: "Font properties",       summary: "family, size, weight, style.",             topics: ["font-family", "font-size", "font-weight"] },
      { id: "css-line",       title: "Line height & spacing", summary: "Readable body text.",                       topics: ["line-height", "letter-spacing"] },
      { id: "css-webfonts",   title: "Web fonts",             summary: "@font-face and Google Fonts.",             topics: ["@font-face", "font-display"] },
    ]},
    { id: "css-color", icon: "06", title: "Color & backgrounds", summary: "Colors, gradients, images.", lessons: [
      { id: "css-color",      title: "Color formats",         summary: "hex, rgb, hsl, named.",                    topics: ["#hex", "rgb()", "hsl()"] },
      { id: "css-background", title: "Backgrounds",           summary: "color, image, gradient, position.",        topics: ["background-color", "background-image", "linear-gradient"] },
    ]},
    { id: "css-responsive", icon: "07", title: "Responsive design", summary: "Layouts that work on any screen.", lessons: [
      { id: "css-media",      title: "Media queries",         summary: "@media (max-width: …).",                   topics: ["@media", "breakpoint"] },
      { id: "css-fluid",      title: "Fluid units",           summary: "%, vw, vh, clamp.",                        topics: ["%", "vw", "vh", "clamp()"] },
    ]},
    { id: "css-effects", icon: "08", title: "Effects", summary: "Transforms, transitions, animations.", lessons: [
      { id: "css-transform",  title: "Transforms",            summary: "translate, rotate, scale.",                topics: ["transform", "translate", "rotate"] },
      { id: "css-transition", title: "Transitions",           summary: "Animating between states.",                topics: ["transition", "ease"] },
      { id: "css-animation",  title: "@keyframes",            summary: "Keyframe animations.",                     topics: ["@keyframes", "animation"] },
    ]},
  ],

  cpp: [
    { id: "cpp-basics", icon: "01", title: "C++ basics", summary: "Hello world and types.", lessons: [
      { id: "cpp-hello",      title: "Hello, world",          summary: "main, cout, return 0.",                    topics: ["#include", "main", "std::cout"] },
      { id: "cpp-types",      title: "Primitive types",       summary: "int, double, char, bool.",                 topics: ["int", "double", "char", "bool"] },
      { id: "cpp-io",         title: "cin / cout",            summary: "Standard I/O streams.",                    topics: ["cout", "cin", "endl"] },
    ]},
    { id: "cpp-control", icon: "02", title: "Control flow", summary: "if, switch, loops.", lessons: [
      { id: "cpp-if",         title: "if / else",             summary: "Branches and conditions.",                 topics: ["if", "else if"] },
      { id: "cpp-loops",      title: "Loops",                 summary: "for, while, range-for.",                   topics: ["for", "while", "range-for"] },
    ]},
    { id: "cpp-functions", icon: "03", title: "Functions", summary: "Declarations, references, defaults.", lessons: [
      { id: "cpp-fn-decl",    title: "Function declarations", summary: "Prototypes and definitions.",              topics: ["function declaration", "definition"] },
      { id: "cpp-refs",       title: "References & pointers", summary: "& and * — when each makes sense.",         topics: ["reference", "pointer", "nullptr"] },
      { id: "cpp-overload",   title: "Overloading",           summary: "Same name, different signatures.",         topics: ["function overload"] },
    ]},
    { id: "cpp-classes", icon: "04", title: "Classes & objects", summary: "Constructors, members, destructors.", lessons: [
      { id: "cpp-class",      title: "Class basics",          summary: "Defining classes.",                        topics: ["class", "struct", "public/private"] },
      { id: "cpp-ctor",       title: "Constructors & destructors", summary: "RAII and cleanup.",                topics: ["constructor", "destructor", "RAII"] },
      { id: "cpp-inheritance",title: "Inheritance",           summary: "public/private inheritance, virtual.",     topics: ["inheritance", "virtual", "override"] },
    ]},
    { id: "cpp-templates", icon: "05", title: "Templates", summary: "Generic programming.", lessons: [
      { id: "cpp-tpl-fn",     title: "Function templates",    summary: "One function, many types.",                topics: ["template", "typename"] },
      { id: "cpp-tpl-class",  title: "Class templates",       summary: "Reusable type-safe containers.",           topics: ["class template"] },
    ]},
    { id: "cpp-stl", icon: "06", title: "STL", summary: "vector, map, algorithm.", lessons: [
      { id: "cpp-vector",     title: "std::vector",           summary: "Dynamic arrays.",                          topics: ["vector", "push_back", "size"] },
      { id: "cpp-map",        title: "std::map",              summary: "Ordered key-value.",                       topics: ["map", "unordered_map"] },
      { id: "cpp-algorithm",  title: "<algorithm>",           summary: "sort, find, transform.",                   topics: ["sort", "find", "transform"] },
    ]},
    { id: "cpp-memory", icon: "07", title: "Memory & smart pointers", summary: "Manage lifetimes safely.", lessons: [
      { id: "cpp-raii",       title: "RAII pattern",          summary: "Resource acquisition is initialization.",  topics: ["RAII", "scope"] },
      { id: "cpp-unique",     title: "unique_ptr & shared_ptr", summary: "Modern memory management.",            topics: ["unique_ptr", "shared_ptr", "make_unique"] },
    ]},
    { id: "cpp-modern", icon: "08", title: "Modern C++", summary: "C++11/14/17/20 essentials.", lessons: [
      { id: "cpp-auto",       title: "auto & lambdas",        summary: "Type inference and inline functions.",     topics: ["auto", "lambda", "decltype"] },
      { id: "cpp-move",       title: "Move semantics",        summary: "rvalue references and std::move.",         topics: ["rvalue", "std::move", "&&"] },
      { id: "cpp-concepts",   title: "Concepts (C++20)",      summary: "Constraints on templates.",                topics: ["concept", "requires"] },
    ]},
  ],

};
