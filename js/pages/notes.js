// Notes — local-only personal notes, searchable, auto-saved.

function renderNotes() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  if (State.data.notes.length === 0) {
    State.data.notes.push({
      id: "n-" + Date.now(),
      title: "Welcome",
      body: "Use this page to jot down concepts you want to remember.\n\nNotes are saved to your browser's local storage. They never leave your machine.\n",
      updated: Date.now(),
    });
    State.save();
  }
  let activeId = State.data.notes[0].id;
  let query = "";

  function paintSidebar() {
    sidebar.innerHTML = `
      <div style="padding:8px 10px;border-bottom:1px solid var(--border);display:flex;gap:6px;">
        <input id="note-search" placeholder="Search notes…" value="${escapeHTML(query)}" style="flex:1;" />
        <button class="btn" id="new-note">＋</button>
      </div>
      <div class="notes-list">
        ${State.data.notes
          .filter(n => !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.body.toLowerCase().includes(query.toLowerCase()))
          .sort((a, b) => b.updated - a.updated)
          .map(n => `
            <div class="nitem ${n.id === activeId ? "active" : ""}" data-id="${n.id}">
              <div class="title">${escapeHTML(n.title || "(untitled)")}</div>
              <div class="preview">${escapeHTML(n.body.replace(/\n/g, " ").slice(0, 60))}</div>
            </div>
          `).join("") || `<div style="padding:16px;color:var(--fg-mute);font-size:12px;text-align:center;">No matches.</div>`}
      </div>
    `;
    sidebar.querySelector("#note-search").oninput = e => { query = e.target.value; paintSidebar(); };
    sidebar.querySelector("#new-note").onclick = () => {
      const id = "n-" + Date.now();
      State.data.notes.unshift({ id, title: "New note", body: "", updated: Date.now() });
      activeId = id; State.save();
      paintSidebar(); paintEditor();
    };
    sidebar.querySelectorAll("[data-id]").forEach(el => el.onclick = () => {
      activeId = el.dataset.id;
      paintSidebar(); paintEditor();
    });
  }

  function paintEditor() {
    const n = State.data.notes.find(x => x.id === activeId);
    if (!n) { main.innerHTML = `<div class="page"><div class="empty"><h3>No note selected.</h3></div></div>`; return; }

    main.innerHTML = `
      <div class="tabs"><div class="tab active">${escapeHTML(n.title || "untitled")}.md</div></div>
      <div class="notes-editor" style="height:calc(100% - 32px);">
        <input class="title-input" id="title-input" value="${escapeHTML(n.title)}" />
        <div class="subtle" style="font-family:var(--font-mono);font-size:11px;margin-bottom:6px;">
          updated ${new Date(n.updated).toLocaleString()} · ${n.body.length} chars
          <span style="float:right;">
            <button class="btn ghost" id="export-note">Export</button>
            <button class="btn danger" id="delete-note">Delete</button>
          </span>
        </div>
        <textarea id="body-input" placeholder="Write your note…">${escapeHTML(n.body)}</textarea>
      </div>
    `;
    const titleEl = document.getElementById("title-input");
    const bodyEl = document.getElementById("body-input");
    function save() {
      n.title = titleEl.value;
      n.body = bodyEl.value;
      n.updated = Date.now();
      State.save();
      paintSidebar();
    }
    let timer;
    titleEl.oninput = bodyEl.oninput = () => { clearTimeout(timer); timer = setTimeout(save, 200); };

    document.getElementById("export-note").onclick = () => {
      const blob = new Blob([`# ${n.title}\n\n${n.body}`], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${n.title || "note"}.md`;
      a.click(); URL.revokeObjectURL(url);
    };
    document.getElementById("delete-note").onclick = () => {
      if (!confirm("Delete this note?")) return;
      State.data.notes = State.data.notes.filter(x => x.id !== activeId);
      if (State.data.notes.length === 0) State.data.notes.push({ id: "n-" + Date.now(), title: "Untitled", body: "", updated: Date.now() });
      activeId = State.data.notes[0].id;
      State.save();
      paintSidebar(); paintEditor();
    };
  }

  paintSidebar();
  paintEditor();
}
