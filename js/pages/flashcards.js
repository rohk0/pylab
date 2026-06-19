// Flashcards — study mode with flip, favorites, spaced-ish review.

function renderFlashcards() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  let cat = "All";
  let mode = "study"; // "study" | "review" | "favs"
  let idx = 0;
  let flipped = false;

  const counts = FLASH_CATS.reduce((acc, c) => (acc[c] = FLASHCARDS.filter(f => f.cat === c).length, acc), {});

  sidebar.innerHTML = `
    <div class="sb-header">Categories</div>
    <div class="sb-item" data-cat="All">All <span class="badge">${FLASHCARDS.length}</span></div>
    ${FLASH_CATS.map(c => `<div class="sb-item" data-cat="${escapeHTML(c)}">${escapeHTML(c)} <span class="badge">${counts[c]}</span></div>`).join("")}
    <div class="sb-section"></div>
    <div class="sb-header">Mode</div>
    <div class="sb-item" data-mode="study">Study (sequential)</div>
    <div class="sb-item" data-mode="review">Review (shuffled)</div>
    <div class="sb-item" data-mode="favs">Favorites <span class="badge" id="fav-count"></span></div>
  `;

  sidebar.querySelectorAll("[data-cat]").forEach(el => el.onclick = () => { cat = el.dataset.cat; idx = 0; setActive("[data-cat]", el); paint(); });
  sidebar.querySelectorAll("[data-mode]").forEach(el => el.onclick = () => { mode = el.dataset.mode; idx = 0; setActive("[data-mode]", el); paint(); });
  sidebar.querySelector("[data-cat=All]").classList.add("active");
  sidebar.querySelector("[data-mode=study]").classList.add("active");
  document.getElementById("fav-count").textContent = Object.keys(State.data.flashFavs).length || "";

  function setActive(sel, el) { sidebar.querySelectorAll(sel).forEach(e => e.classList.toggle("active", e === el)); }

  let deck = [];
  function buildDeck() {
    let list = cat === "All" ? FLASHCARDS.slice() : FLASHCARDS.filter(f => f.cat === cat);
    if (mode === "favs") list = list.filter(f => State.data.flashFavs[f.id]);
    if (mode === "review") list = list.slice().sort(() => Math.random() - 0.5);
    deck = list;
  }

  function paint() {
    buildDeck();
    if (deck.length === 0) {
      main.innerHTML = `<div class="tabs"><div class="tab active">Flashcards</div></div><div class="page-narrow"><div class="empty"><h3>No cards in this view.</h3><div class="subtle">Try a different category or favorite some cards first.</div></div></div>`;
      return;
    }
    idx = Math.max(0, Math.min(deck.length - 1, idx));
    const card = deck[idx];
    const fav = !!State.data.flashFavs[card.id];

    main.innerHTML = `
      <div class="tabs"><div class="tab active">Flashcards · ${escapeHTML(cat)} · ${mode}</div></div>
      <div class="page-narrow" style="display:flex;flex-direction:column;height:100%;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div class="h1">Flashcards</div>
            <div class="subtle">${idx + 1} / ${deck.length} · ${escapeHTML(card.cat)}</div>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="btn" id="fav-btn" title="Favorite">${fav ? "★ Favorited" : "☆ Favorite"}</button>
          </div>
        </div>

        <div class="flashcard ${flipped ? "flipped" : ""}" id="card">
          <div class="flashcard-inner">
            <div class="flashcard-face">
              <div class="label">term · click to flip</div>
              <div class="term">${card.term}</div>
            </div>
            <div class="flashcard-face back">
              <div class="label">definition</div>
              <div class="definition">${card.def}</div>
            </div>
          </div>
        </div>

        <div class="flashcard-controls">
          <button class="btn" id="prev">←</button>
          <button class="btn primary" id="flip">Flip</button>
          <button class="btn" id="next">→</button>
        </div>

        <div style="text-align:center;margin-top:12px;" class="subtle">
          <kbd class="kbd">Space</kbd> flip · <kbd class="kbd">←</kbd> <kbd class="kbd">→</kbd> navigate · <kbd class="kbd">F</kbd> favorite
        </div>

        <div style="margin-top:24px;">
          <div class="h2">Self-rate</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn danger" data-rate="again">Again</button>
            <button class="btn" data-rate="hard">Hard</button>
            <button class="btn" data-rate="good">Good</button>
            <button class="btn success" data-rate="easy">Easy</button>
          </div>
          <div class="subtle" style="margin-top:6px;">Your rating informs the review queue.</div>
        </div>
      </div>
    `;

    document.getElementById("card").onclick = flip;
    document.getElementById("flip").onclick = flip;
    document.getElementById("prev").onclick = () => { idx = (idx - 1 + deck.length) % deck.length; flipped = false; paint(); };
    document.getElementById("next").onclick = () => { idx = (idx + 1) % deck.length; flipped = false; paint(); };
    document.getElementById("fav-btn").onclick = () => {
      if (fav) delete State.data.flashFavs[card.id]; else State.data.flashFavs[card.id] = true;
      State.save();
      document.getElementById("fav-count").textContent = Object.keys(State.data.flashFavs).length || "";
      paint();
    };
    main.querySelectorAll("[data-rate]").forEach(b => b.onclick = () => {
      const rate = b.dataset.rate;
      const days = { again: 0, hard: 1, good: 3, easy: 7 }[rate];
      State.data.flashReview[card.id] = { next: Date.now() + days * 86400000, ease: rate };
      State.save();
      State.toast(`Marked ${rate}`, "ok");
      idx = (idx + 1) % deck.length; flipped = false; paint();
    });
  }

  function flip() { flipped = !flipped; paint(); }

  document.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea")) return;
    if (e.code === "Space") { e.preventDefault(); flip(); }
    if (e.code === "ArrowLeft") document.getElementById("prev")?.click();
    if (e.code === "ArrowRight") document.getElementById("next")?.click();
    if (e.code === "KeyF") document.getElementById("fav-btn")?.click();
  });

  paint();
}
