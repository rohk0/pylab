// ============================================================
// Language registry — every supported language is described here.
//
// Each entry:
//   id        slug used in URLs and storage
//   name      human label
//   ext       file extension (no dot)
//   runner    "pyodide" | "iframe" | "js" | "ai"
//   keywords  highlighter keyword set
//   builtins  highlighter built-in set
//   starter   code shown in a fresh playground tab
//   docsURL   official-ish docs (open in new tab)
//
// Code blocks, editor, runtime, lessons, and challenges all read
// from this registry. Adding a new language ≈ adding an entry.
// ============================================================

window.LANGUAGES = [
  {
    id: "python",
    name: "Python",
    ext: "py",
    runner: "pyodide",
    docsURL: "https://docs.python.org/3/",
    starter: `# Welcome to pylab.
# Press Ctrl-Enter to run.

for i in range(5):
    print("hi", i)
`,
    keywords: ["False","None","True","and","as","assert","async","await","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","nonlocal","not","or","pass","raise","return","try","while","with","yield","match","case"],
    builtins: ["print","len","range","input","int","float","str","list","dict","set","tuple","bool","abs","min","max","sum","sorted","reversed","enumerate","zip","map","filter","open","isinstance","type","repr","round","any","all","chr","ord","hex","bin","oct"],
    comment: { line: "#" },
  },
  {
    id: "javascript",
    name: "JavaScript",
    ext: "js",
    runner: "js",
    docsURL: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    starter: `// Welcome to pylab — JavaScript mode.
// Press Ctrl-Enter to run.

for (let i = 0; i < 5; i++) {
  console.log("hi", i);
}
`,
    keywords: ["abstract","async","await","break","case","catch","class","const","continue","debugger","default","delete","do","else","enum","export","extends","false","finally","for","from","function","if","implements","import","in","instanceof","interface","let","new","null","of","package","private","protected","public","return","static","super","switch","this","throw","true","try","typeof","undefined","var","void","while","with","yield"],
    builtins: ["console","log","error","warn","Math","JSON","Array","Object","String","Number","Boolean","Promise","Map","Set","Symbol","parseInt","parseFloat","isNaN","setTimeout","setInterval","fetch","window","document"],
    comment: { line: "//", blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "typescript",
    name: "TypeScript",
    ext: "ts",
    runner: "ai",
    docsURL: "https://www.typescriptlang.org/docs/",
    starter: `// TypeScript runs via AI evaluation here.
// Real execution would need a compiler — ask the AI to trace it.

function greet(name: string): string {
  return \`hi \${name}\`;
}

console.log(greet("pylab"));
`,
    keywords: ["abstract","any","as","async","await","boolean","break","case","catch","class","const","constructor","continue","debugger","declare","default","delete","do","else","enum","export","extends","false","finally","for","from","function","get","if","implements","import","in","infer","instanceof","interface","is","keyof","let","module","namespace","never","new","null","number","of","package","private","protected","public","readonly","return","set","static","string","super","switch","symbol","this","throw","true","try","type","typeof","undefined","unknown","var","void","while","with","yield"],
    builtins: ["console","log","error","warn","Math","JSON","Array","Object","String","Number","Boolean","Promise","Map","Set","Symbol","Record","Partial","Pick","Omit"],
    comment: { line: "//", blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "java",
    name: "Java",
    ext: "java",
    runner: "ai",
    docsURL: "https://docs.oracle.com/en/java/",
    starter: `// Java runs via AI evaluation here.
// Real execution would need a JVM — ask the AI to trace it.

public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.println("hi " + i);
        }
    }
}
`,
    keywords: ["abstract","assert","boolean","break","byte","case","catch","char","class","const","continue","default","do","double","else","enum","exports","extends","final","finally","float","for","goto","if","implements","import","instanceof","int","interface","long","module","native","new","null","package","private","protected","public","requires","return","short","static","strictfp","super","switch","synchronized","this","throw","throws","transient","true","false","try","var","void","volatile","while","yield","record","sealed","permits"],
    builtins: ["System","String","Integer","Long","Double","Float","Boolean","Character","Math","List","Map","Set","ArrayList","HashMap","HashSet","Object","Class","Exception","RuntimeException","Thread","Runnable"],
    comment: { line: "//", blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "c",
    name: "C",
    ext: "c",
    runner: "ai",
    docsURL: "https://en.cppreference.com/w/c",
    starter: `// C runs via AI evaluation here.

#include <stdio.h>

int main(void) {
    for (int i = 0; i < 5; i++) {
        printf("hi %d\\n", i);
    }
    return 0;
}
`,
    keywords: ["auto","break","case","char","const","continue","default","do","double","else","enum","extern","float","for","goto","if","inline","int","long","register","restrict","return","short","signed","sizeof","static","struct","switch","typedef","union","unsigned","void","volatile","while","_Bool","_Complex"],
    builtins: ["printf","scanf","malloc","free","memcpy","memset","strlen","strcpy","strcmp","strncmp","strchr","strcat","NULL","stdin","stdout","stderr","FILE","size_t","ptrdiff_t","int32_t","int64_t","uint8_t","uint32_t","uint64_t"],
    comment: { line: "//", blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "cpp",
    name: "C++",
    ext: "cpp",
    runner: "ai",
    docsURL: "https://en.cppreference.com/w/cpp",
    starter: `// C++ runs via AI evaluation here.

#include <iostream>

int main() {
    for (int i = 0; i < 5; ++i) {
        std::cout << "hi " << i << "\\n";
    }
    return 0;
}
`,
    keywords: ["alignas","alignof","and","asm","auto","bool","break","case","catch","char","char16_t","char32_t","class","const","constexpr","const_cast","continue","decltype","default","delete","do","double","dynamic_cast","else","enum","explicit","export","extern","false","float","for","friend","goto","if","inline","int","long","mutable","namespace","new","noexcept","nullptr","operator","or","private","protected","public","register","reinterpret_cast","return","short","signed","sizeof","static","static_assert","static_cast","struct","switch","template","this","thread_local","throw","true","try","typedef","typeid","typename","union","unsigned","using","virtual","void","volatile","wchar_t","while","xor"],
    builtins: ["std","cout","cin","endl","string","vector","map","set","array","unique_ptr","shared_ptr","make_unique","make_shared","nullptr","size_t","int32_t","int64_t","uint8_t","uint32_t","uint64_t"],
    comment: { line: "//", blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "sql",
    name: "SQL",
    ext: "sql",
    runner: "ai",
    docsURL: "https://www.postgresql.org/docs/current/sql.html",
    starter: `-- SQL runs via AI evaluation here.
-- Try modifying this query and click Run to ask the AI to trace it.

SELECT name, COUNT(*) AS orders
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE c.country = 'US'
GROUP BY name
ORDER BY orders DESC
LIMIT 10;
`,
    keywords: ["SELECT","FROM","WHERE","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS","ON","USING","GROUP","BY","ORDER","ASC","DESC","HAVING","LIMIT","OFFSET","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","INDEX","VIEW","ALTER","DROP","ADD","COLUMN","PRIMARY","KEY","FOREIGN","REFERENCES","NOT","NULL","DEFAULT","UNIQUE","CHECK","AS","AND","OR","IN","LIKE","BETWEEN","IS","UNION","ALL","DISTINCT","CASE","WHEN","THEN","ELSE","END","WITH","RETURNING","TRUE","FALSE","CAST","BEGIN","COMMIT","ROLLBACK","TRANSACTION"],
    builtins: ["COUNT","SUM","AVG","MAX","MIN","COALESCE","NULLIF","LENGTH","UPPER","LOWER","TRIM","SUBSTRING","CONCAT","NOW","CURRENT_DATE","CURRENT_TIMESTAMP","EXTRACT","DATE","INTERVAL","INT","INTEGER","BIGINT","VARCHAR","TEXT","BOOLEAN","TIMESTAMP","JSONB"],
    comment: { line: "--", blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "html",
    name: "HTML",
    ext: "html",
    runner: "iframe",
    docsURL: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    starter: `<!doctype html>
<html>
  <head>
    <title>pylab playground</title>
    <style>
      body { font-family: system-ui; background: #1e1e1e; color: #d4d4d4; padding: 24px; }
      h1 { color: #5eb1ff; }
      button { padding: 6px 14px; }
    </style>
  </head>
  <body>
    <h1>Hi from HTML</h1>
    <p>Edit this and click <b>Run</b> to see the preview.</p>
    <button onclick="alert('Pylab!')">Click me</button>
  </body>
</html>
`,
    keywords: [],
    builtins: [],
    comment: { blockOpen: "<!--", blockClose: "-->" },
  },
  {
    id: "css",
    name: "CSS",
    ext: "css",
    runner: "iframe",
    docsURL: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    starter: `/* CSS runs alongside an HTML preview.
   Switch to HTML to edit the markup, then come back to style it. */

body {
  font-family: system-ui;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 24px;
}

h1 {
  color: #5eb1ff;
  border-bottom: 2px solid #5eb1ff;
  padding-bottom: 6px;
}

button {
  background: #0e639c;
  color: white;
  border: 0;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover { background: #1177bb; }
`,
    keywords: ["important","inherit","initial","unset","auto","none","solid","dashed","dotted","absolute","relative","fixed","sticky","static","block","inline","inline-block","flex","grid","hidden","visible","center","left","right","top","bottom","middle","baseline","wrap","nowrap","row","column","space-between","space-around","space-evenly","stretch","start","end"],
    builtins: ["rgb","rgba","hsl","hsla","var","calc","url","linear-gradient","radial-gradient","translate","rotate","scale","skew","matrix","px","em","rem","vh","vw","%"],
    comment: { blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "rust",
    name: "Rust",
    ext: "rs",
    runner: "ai",
    docsURL: "https://doc.rust-lang.org/book/",
    starter: `// Rust runs via AI evaluation here.

fn main() {
    for i in 0..5 {
        println!("hi {}", i);
    }
}
`,
    keywords: ["as","async","await","break","const","continue","crate","dyn","else","enum","extern","false","fn","for","if","impl","in","let","loop","match","mod","move","mut","pub","ref","return","Self","self","static","struct","super","trait","true","type","union","unsafe","use","where","while","yield"],
    builtins: ["Vec","String","str","i8","i16","i32","i64","i128","u8","u16","u32","u64","u128","f32","f64","bool","char","Option","Result","Some","None","Ok","Err","Box","Rc","Arc","HashMap","HashSet","println","print","format","vec","Default","Clone","Copy","Debug","Display"],
    comment: { line: "//", blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "go",
    name: "Go",
    ext: "go",
    runner: "ai",
    docsURL: "https://go.dev/doc/",
    starter: `// Go runs via AI evaluation here.

package main

import "fmt"

func main() {
    for i := 0; i < 5; i++ {
        fmt.Println("hi", i)
    }
}
`,
    keywords: ["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"],
    builtins: ["bool","byte","complex64","complex128","error","float32","float64","int","int8","int16","int32","int64","rune","string","uint","uint8","uint16","uint32","uint64","uintptr","true","false","iota","nil","append","cap","close","copy","delete","len","make","new","panic","print","println","recover","fmt","strings","strconv","io","os","time","sync"],
    comment: { line: "//", blockOpen: "/*", blockClose: "*/" },
  },
  {
    id: "ruby",
    name: "Ruby",
    ext: "rb",
    runner: "ai",
    docsURL: "https://www.ruby-lang.org/en/documentation/",
    starter: `# Ruby runs via AI evaluation here.

5.times do |i|
  puts "hi #{i}"
end
`,
    keywords: ["BEGIN","END","alias","and","begin","break","case","class","def","defined?","do","else","elsif","end","ensure","false","for","if","in","module","next","nil","not","or","redo","rescue","retry","return","self","super","then","true","undef","unless","until","when","while","yield"],
    builtins: ["puts","print","p","pp","gets","require","require_relative","attr_accessor","attr_reader","attr_writer","Array","Hash","String","Integer","Float","Range","Symbol","Proc","Lambda","Numeric","Object","Class","Module","Comparable","Enumerable","raise","Exception","StandardError"],
    comment: { line: "#", blockOpen: "=begin", blockClose: "=end" },
  },
];

window.findLanguage = (id) => LANGUAGES.find(l => l.id === id) || LANGUAGES[0];

window.activeLanguage = () => {
  const id = (typeof State !== "undefined" && State.data && State.data.lang) || "python";
  return findLanguage(id);
};

window.setActiveLanguage = (id) => {
  if (typeof State !== "undefined" && State.data) {
    State.data.lang = id;
    State.save?.();
  }
};
