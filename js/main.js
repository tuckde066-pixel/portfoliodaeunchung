// 화면을 그리는 코드입니다. 보통은 고칠 필요가 없습니다.
// 내용 수정은 js/site.js, js/works.js, js/exhibitions.js, js/texts.js, cv.html 에서 하세요.

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const byYear = (arr) => [...arr].sort((a, b) => (b.year || 0) - (a.year || 0));
const page = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
const params = new URLSearchParams(location.search);
const currentId = params.get("id");
const yearParam = params.get("year") ? Number(params.get("year")) : null;
const yearsOf = (arr) => [...new Set(arr.map((x) => x.year).filter(Boolean))].sort((a, b) => b - a);
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
  const sub = typeof SIDEBAR_SUBLIST !== "undefined" ? SIDEBAR_SUBLIST : { text: true };

  // Works: Works 쪽 페이지에 있을 때만 연도가 펼쳐짐
  const inWorks = page === "index" || page === "work";
  const curWork = page === "work" ? WORKS_.find((w) => w.slug === currentId) : null;
  const workYear = yearParam || (curWork && curWork.year);
  const worksYears = inWorks ? yearsOf(WORKS_).map((y) =>
    sideLink(`index.html?year=${y}`, y, workYear === y)).join("") : "";

  // Exhibition: Exhibition 페이지에 있을 때만 연도가 펼쳐짐
  const inEx = page === "exhibition";
  const curEx = inEx && currentId ? EXHIBITIONS_.find((e) => e.slug === currentId) : null;
  const exYear = yearParam || (curEx && curEx.year);
  const exYears = inEx ? yearsOf(EXHIBITIONS_).map((y) =>
    sideLink(`exhibition.html?year=${y}`, y, exYear === y)).join("") : "";

  const textSub = sub.text && page === "text" ? byYear(TEXTS_).map((t) =>
    sideLink(`text.html?id=${encodeURIComponent(t.slug)}`, t.title, t.slug === currentId)).join("") : "";

  root.innerHTML = `
    <a class="side-name" href="index.html">${esc(SITE.name)}${SITE.nameEn ? `<br><span>${esc(SITE.nameEn)}</span>` : ""}</a>
    <nav>
      <div class="side-section">
        ${sideLink("index.html", "Works", inWorks && !workYear)}
        ${worksYears ? `<div class="side-sub side-years">${worksYears}</div>` : ""}
      </div>
      <div class="side-section">
        ${sideLink("exhibition.html", "Exhibitions", inEx && !exYear)}
        ${exYears ? `<div class="side-sub side-years">${exYears}</div>` : ""}
      </div>
      <div class="side-section">
        ${sideLink("text.html", "Texts", page === "text" && !currentId)}
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
  // index.html → 전체(연도별), index.html?year=2026 → 그 연도만
  const years = yearParam ? [yearParam] : yearsOf(WORKS_);
  root.innerHTML = years.map((y) => `
    <section class="year-block">
      <h2 class="year-label">${y}</h2>
      ${WORKS_.filter((w) => w.year === y).map((w) => `
        <a class="work-item" href="work.html?id=${encodeURIComponent(w.slug)}">
          <img src="${esc(w.images[0].src)}" alt="${esc(w.title)}" loading="lazy">
          <div class="caption"><div class="title">${esc(w.title)}</div><div class="meta">${esc(workMeta(w))}</div></div>
        </a>`).join("") || "<p class=\"meta\">이 연도의 작품이 없습니다.</p>"}
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

/* ───────── Exhibition ───────── */
const exMeta = (e) => [e.venue, e.date].filter(Boolean).join(", ");
function renderExhibitionIndex(root) {
  // exhibition.html → 전체(연도별), exhibition.html?year=2025 → 그 연도만
  // 각 전시는 [포스터 썸네일 | 제목·장소·기간] 한 줄. 누르면 전시 상세(서문 + 전경)로 이동
  const years = yearParam ? [yearParam] : yearsOf(EXHIBITIONS_);
  const row = (e) => {
    const cover = e.poster || (e.images && e.images[0] && e.images[0].src);
    const hasDetail = (e.images && e.images.length) || e.text;
    const inner = `
      <div class="ex-thumb">${cover ? `<img src="${esc(cover)}" alt="${esc(e.title)} 포스터" loading="lazy">` : ""}</div>
      <div class="ex-info">
        <div class="title">${esc(e.title)}</div>
        ${e.titleEn ? `<div class="meta">${esc(e.titleEn)}</div>` : ""}
        <div class="ex-meta">${esc([e.type ? `${e.type} Exhibition` : "", e.venue, e.date].filter(Boolean).join("\n"))}</div>
      </div>`;
    return hasDetail
      ? `<a class="ex-row" href="exhibition.html?id=${encodeURIComponent(e.slug)}">${inner}</a>`
      : `<div class="ex-row">${inner}</div>`;
  };
  root.innerHTML = years.map((y) => `
    <section class="year-block">
      <h2 class="year-label">${y}</h2>
      ${EXHIBITIONS_.filter((e) => e.year === y).map(row).join("") || "<p class=\"meta\">이 연도의 전시가 없습니다.</p>"}
    </section>`).join("") || "<p>준비 중입니다.</p>";
}
function renderExhibition(root) {
  const arr = byYear(EXHIBITIONS_), i = arr.findIndex((e) => e.slug === currentId);
  if (i < 0) { root.innerHTML = notFound("exhibition.html", "Exhibitions"); return; }
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

/* ───────── Text ───────── */
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
  if (i < 0) { root.innerHTML = notFound("text.html", "Texts"); return; }
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
