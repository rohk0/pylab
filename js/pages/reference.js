// Reference — searchable cheat sheets.

function renderReference() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  let query = "";
  let activeId = location.hash.slice(1) || REFERENCE[0].id;

  function buildSidebar() {
    const byCat = {};
    REFERENCE.forEach(r => { (byCat[r.category] = byCat[r.category] || []).push(r); });

    sidebar.innerHTML = `
      <div style="padding:8px 10px;border-bottom:1px solid var(--border);">
        <input id="ref-search" placeholder="Filter…" value="${escapeHTML(query)}" style="width:100%;" />
      </div>
      <div class="ref-nav" id="ref-nav">
        ${Object.keys(byCat).map(cat => `
          <div class="rcat">${escapeHTML(cat)}</div>
          ${byCat[cat]
            .filter(r => !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.body.toLowerCase().includes(query.toLowerCase()))
            .map(r => `<div class="ritem ${r.id === activeId ? "active" : ""}" data-id="${r.id}">${escapeHTML(r.title)}</div>`)
            .join("")}
        `).join("")}
      </div>
    `;

    document.getElementById("ref-search").oninput = e => { query = e.target.value; buildSidebar(); paint(); };
    sidebar.querySelectorAll(".ritem").forEach(el => el.onclick = () => {
      activeId = el.dataset.id;
      history.replaceState({}, "", "#" + activeId);
      buildSidebar();
      paint();
    });
  }

  function paint() {
    const r = REFERENCE.find(x => x.id === activeId) || REFERENCE[0];
    if (!r) { main.innerHTML = `<div class="empty"><h3>No match.</h3></div>`; return; }
    main.innerHTML = `
      <div class="tabs"><div class="tab active">${escapeHTML(r.title)}</div></div>
      <div class="ref-content">
        <div class="subtle" style="font-family:var(--font-mono);font-size:11px;">${escapeHTML(r.category)}</div>
        <div class="h1" style="margin-top:0;">${escapeHTML(r.title)}</div>
        ${renderRefMarkdown(r.body)}
      </div>
    `;
  }

  buildSidebar();
  paint();
}

// Markdown with table support for reference docs.
// Uses a non-printable marker so placeholder substitution can't collide
// with literal digits in tables or text.
function renderRefMarkdown(src) {
  const blocks = [];
  const MARK = "";  // SOH — never appears in normal source
  src = src.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    blocks.push(`<pre><code>${highlightPython(code.trim())}</code></pre>`);
    return MARK + (blocks.length - 1) + MARK;
  });

  const lines = src.split("\n");
  let html = "", inList = false, inOL = false, inTbl = false;
  const flush = () => {
    if (inList) { html += "</ul>"; inList = false; }
    if (inOL)   { html += "</ol>"; inOL = false; }
    if (inTbl)  { html += "</tbody></table>"; inTbl = false; }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (/^\|.*\|$/.test(line)) {
      const cells = line.slice(1, -1).split("|").map(c => c.trim());
      const isSep = cells.every(c => /^:?-+:?$/.test(c.replace(/\s/g, "")));
      if (isSep) continue;
      if (!inTbl) {
        if (inList) { html += "</ul>"; inList = false; }
        if (inOL) { html += "</ol>"; inOL = false; }
        html += `<table><thead><tr>${cells.map(c => `<th>${inlineRef(c)}</th>`).join("")}</tr></thead><tbody>`;
        inTbl = true;
      } else {
        html += `<tr>${cells.map(c => `<td>${inlineRef(c)}</td>`).join("")}</tr>`;
      }
      continue;
    } else if (inTbl) {
      html += "</tbody></table>"; inTbl = false;
    }

    if (/^#{1,6} /.test(line)) {
      flush();
      const level = line.match(/^#+/)[0].length;
      html += `<h${level}>${inlineRef(line.replace(/^#+\s*/, ""))}</h${level}>`;
    } else if (/^[-*] /.test(line)) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inlineRef(line.replace(/^[-*]\s*/, ""))}</li>`;
    } else if (line.trim() === "") {
      flush();
    } else {
      flush();
      html += `<p>${inlineRef(line)}</p>`;
    }
  }
  flush();

  const re = new RegExp(MARK + "(\\d+)" + MARK, "g");
  return html.replace(re, (_, i) => blocks[+i]);
}

function inlineRef(text) {
  return escapeHTML(text)
    .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\\\|/g, "|");
}
