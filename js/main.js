// 화면을 그리는 코드입니다. 보통은 고칠 필요가 없습니다.
// 내용 수정은 js/site.js, js/works.js, js/exhibitions.js, js/texts.js, cv.html 에서 하세요.

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const byYear = (arr) => [...arr].sort((a, b) => (b.year || 0) - (a.year || 0));
const page = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
const currentId = new URLSearchParams(location.search).get("id");
const paras = (t) => String(t || "").split(/\n\s*\n/).map((p) => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");

const WORKS_ = typeof WORKS !== "undefined" ? WORKS : [];
const EXHIBITIONS_ = typeof EXHIBITIONS !== "undefined" ? EXHIBITIONS : [];
const TEXTS_ = typeof TEXTS !== "undefined" ? TEXTS : [];

/* ───────── 왼쪽 메뉴 ───────── */
function sideLink(href, label, active) {
  return `<a href="${href}"${active ? ' class="active"' : ""}>${esc(label)}</a>`;
}
function workGroups() {
  if (typeof SIDEBAR_GROUP_BY !== "undefined" && SIDEBAR_GROUP_BY === "category") {
    const order = typeof CATEGORY_ORDER !== "undefined" ? CATEGORY_ORDER : [];
    const rank = (c) => { const i = order.indexOf(c); return i < 0 ? 999 : i; };
    return [...new Set(WORKS_.map((w) => w.category || "Etc."))].sort((a, b) => rank(a) - rank(b))
      .map((c) => ({ label: c, items: byYear(WORKS_.filter((w) => (w.category || "Etc.") === c)) }));
  }
  return [...new Set(WORKS_.map((w) => w.year))].sort((a, b) => b - a)
    .map((y) => ({ label: y, items: WORKS_.filter((w) => w.year === y) }));
}
function renderSidebar() {
  const root = document.getElementById("sidebar");
  if (!root) return;
  const sub = typeof SIDEBAR_SUBLIST !== "undefined" ? SIDEBAR_SUBLIST : { works: true, exhibition: true, text: true };

  const worksSub = sub.works ? workGroups().map((g) => `
      <div class="side-sublabel">${esc(g.label)}</div>
      ${g.items.map((w) => sideLink(`work.html?id=${encodeURIComponent(w.slug)}`, w.title, page === "work" && w.slug === currentId)).join("")}`).join("") : "";

  const types = [...new Set(EXHIBITIONS_.map((e) => e.type || ""))];
  const exSub = sub.exhibition ? types.map((t) => `
      ${t ? `<div class="side-sublabel">${esc(t)}</div>` : ""}
      ${byYear(EXHIBITIONS_.filter((e) => (e.type || "") === t)).map((e) => sideLink(`exhibition.html?id=${encodeURIComponent(e.slug)}`, e.title, page === "exhibition" && e.slug === currentId)).join("")}`).join("") : "";

  const textSub = sub.text ? byYear(TEXTS_).map((t) => sideLink(`text.html?id=${encodeURIComponent(t.slug)}`, t.title, page === "text" && t.slug === currentId)).join("") : "";

  root.innerHTML = `
    <a class="side-name" href="index.html">${esc(SITE.name)}${SITE.nameEn ? `<br><span>${esc(SITE.nameEn)}</span>` : ""}</a>
    <nav>
      <div class="side-section">
        ${sideLink("index.html", "Works", page === "index")}
        ${worksSub ? `<div class="side-sub">${worksSub}</div>` : ""}
      </div>
      <div class="side-section">
        ${sideLink("exhibition.html", "Exhibition", page === "exhibition" && !currentId)}
        ${exSub ? `<div class="side-sub">${exSub}</div>` : ""}
      </div>
      <div class="side-section">
        ${sideLink("text.html", "Text", page === "text" && !currentId)}
        ${textSub ? `<div class="side-sub">${textSub}</div>` : ""}
      </div>
      <div class="side-section">
        ${sideLink("cv.html", "CV", page === "cv")}
      </div>
    </nav>
    <div class="side-contact">
      ${SITE.email ? `<button type="button" class="email-btn" id="email-btn">Email</button>
      <div class="email-reveal" id="email-reveal" hidden>
        <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
        <span class="email-note" id="email-note"></span>
      </div>` : ""}
      ${SITE.instagram ? `<a href="${esc(SITE.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ""}
    </div>`;
}

/* ───────── 공통: 이미지 묶음, 이전/다음 ───────── */
const figures = (imgs, alt) => (imgs || []).map((im) => `
  <figure class="figure">
    <img src="${esc(im.src)}" alt="${esc(alt)} ${esc(im.caption)}" loading="lazy">
    ${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ""}
  </figure>`).join("");
function pager(arr, i, file) {
  const prev = arr[i - 1], next = arr[i + 1];
  return `<nav class="pager">
    <span>${prev ? `<a href="${file}?id=${encodeURIComponent(prev.slug)}">← ${esc(prev.title)}</a>` : ""}</span>
    <span>${next ? `<a href="${file}?id=${encodeURIComponent(next.slug)}">${esc(next.title)} →</a>` : ""}</span>
  </nav>`;
}
const notFound = (file, label) => `<p>찾을 수 없습니다. <a href="${file}">← ${label}</a></p>`;

/* ───────── Works ───────── */
const workMeta = (w) => [w.medium, w.size, w.year].filter(Boolean).join(", ");
function renderWorksIndex(root) {
  const years = [...new Set(WORKS_.map((w) => w.year))].sort((a, b) => b - a);
  root.innerHTML = years.map((y) => `
    <section class="year-block">
      <h2 class="year-label">${y}</h2>
      ${WORKS_.filter((w) => w.year === y).map((w) => `
        <a class="work-item" href="work.html?id=${encodeURIComponent(w.slug)}">
          <img src="${esc(w.images[0].src)}" alt="${esc(w.title)}" loading="lazy">
          <div class="caption"><div class="title">${esc(w.title)}</div><div class="meta">${esc(workMeta(w))}</div></div>
        </a>`).join("")}
    </section>`).join("");
}
function renderWork(root) {
  const arr = byYear(WORKS_), i = arr.findIndex((w) => w.slug === currentId);
  if (i < 0) { root.innerHTML = notFound("index.html", "Works"); return; }
  const w = arr[i];
  document.title = `${w.title} — ${SITE.name}`;
  root.innerHTML = `
    <div class="detail-head">
      <h1>${esc(w.title)}</h1>
      ${w.titleEn ? `<div class="en">${esc(w.titleEn)}</div>` : ""}
      <div class="meta">${esc(workMeta(w))}</div>
      ${w.mediumEn ? `<div class="en">${esc(w.mediumEn)}</div>` : ""}
    </div>
    ${figures(w.images, w.title)}
    ${w.text ? `<div class="body-text">${paras(w.text)}</div>` : ""}
    ${pager(arr, i, "work.html")}`;
}

/* ───────── Exhibitions ───────── */
const exMeta = (e) => [e.venue, e.date].filter(Boolean).join(", ");
function renderExhibitionIndex(root) {
  root.innerHTML = byYear(EXHIBITIONS_).map((e) => `
    <a class="work-item" href="exhibition.html?id=${encodeURIComponent(e.slug)}">
      ${e.images && e.images[0] ? `<img src="${esc(e.images[0].src)}" alt="${esc(e.title)}" loading="lazy">` : ""}
      <div class="caption">
        <div class="title">${esc(e.title)}${e.type ? ` <span class="meta">(${esc(e.type)})</span>` : ""}</div>
        <div class="meta">${esc(exMeta(e))}</div>
      </div>
    </a>`).join("") || "<p>준비 중입니다.</p>";
}
function renderExhibition(root) {
  const arr = byYear(EXHIBITIONS_), i = arr.findIndex((e) => e.slug === currentId);
  if (i < 0) { root.innerHTML = notFound("exhibition.html", "Exhibition"); return; }
  const e = arr[i];
  document.title = `${e.title} — ${SITE.name}`;
  root.innerHTML = `
    <div class="detail-head">
      <h1>${esc(e.title)}</h1>
      ${e.titleEn ? `<div class="en">${esc(e.titleEn)}</div>` : ""}
      <div class="meta">${esc([e.type ? `${e.type} Exhibition` : "", e.venue, e.date].filter(Boolean).join(", "))}</div>
    </div>
    ${e.text ? `<div class="body-text">${paras(e.text)}</div>` : ""}
    ${figures(e.images, e.title)}
    ${pager(arr, i, "exhibition.html")}`;
}

/* ───────── Texts ───────── */
const textMeta = (t) => [t.author, t.source, t.year].filter(Boolean).join(", ");
function renderTextIndex(root) {
  root.innerHTML = `<div class="text-list">${byYear(TEXTS_).map((t) => `
    <a class="text-row" href="text.html?id=${encodeURIComponent(t.slug)}">
      <span class="title">${esc(t.title)}</span>
      <span class="meta">${esc(textMeta(t))}</span>
    </a>`).join("")}</div>` || "<p>준비 중입니다.</p>";
}
function renderText(root) {
  const arr = byYear(TEXTS_), i = arr.findIndex((t) => t.slug === currentId);
  if (i < 0) { root.innerHTML = notFound("text.html", "Text"); return; }
  const t = arr[i];
  document.title = `${t.title} — ${SITE.name}`;
  root.innerHTML = `
    <div class="detail-head">
      <h1>${esc(t.title)}</h1>
      ${t.titleEn ? `<div class="en">${esc(t.titleEn)}</div>` : ""}
      <div class="meta">${esc(textMeta(t))}</div>
    </div>
    ${t.body ? `<div class="body-text">${paras(t.body)}</div>` : ""}
    ${t.pdf ? `<p class="body-text"><a class="underline" href="${esc(t.pdf)}" target="_blank" rel="noopener">PDF 보기 ↗</a></p>` : ""}
    ${pager(arr, i, "text.html")}`;
}

/* ───────── Email: 누르면 주소가 펼쳐지고 자동으로 복사됨 ───────── */
function setupEmail() {
  const btn = document.getElementById("email-btn");
  if (!btn) return;
  const box = document.getElementById("email-reveal");
  const note = document.getElementById("email-note");
  btn.addEventListener("click", async () => {
    const opening = box.hidden;
    box.hidden = !opening;
    if (!opening) return;
    try {
      await navigator.clipboard.writeText(SITE.email);
      note.textContent = "복사되었습니다";
    } catch {
      note.textContent = "";
    }
  });
}

/* ───────── 실행 ───────── */
renderSidebar();
setupEmail();
const content = document.getElementById("content");
if (content) {
  const routes = {
    index: () => renderWorksIndex(content),
    work: () => renderWork(content),
    exhibition: () => (currentId ? renderExhibition(content) : renderExhibitionIndex(content)),
    text: () => (currentId ? renderText(content) : renderTextIndex(content))
  };
  (routes[page] || routes.index)();
}
