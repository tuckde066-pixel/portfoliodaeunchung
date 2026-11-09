// 화면을 그리는 코드입니다. 보통은 고칠 필요가 없습니다.

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const metaLine = (w) => [w.medium, w.size, w.year].filter(Boolean).join(", ");

// 목록 화면: 연도별로 묶어서 최신 연도부터
function renderIndex() {
  const root = document.getElementById("works");
  if (!root) return;
  const years = [...new Set(WORKS.map((w) => w.year))].sort((a, b) => b - a);
  root.innerHTML = years.map((y) => `
    <section class="year-block">
      <h2 class="year-label">${y}</h2>
      ${WORKS.filter((w) => w.year === y).map((w) => `
        <a class="work-item" href="work.html?id=${encodeURIComponent(w.slug)}">
          <img src="${esc(w.images[0].src)}" alt="${esc(w.title)}" loading="lazy">
          <div class="caption">
            <div class="title">${esc(w.title)}</div>
            <div class="meta">${esc(metaLine(w))}</div>
          </div>
        </a>`).join("")}
    </section>`).join("");
}

// 상세 화면: 이미지 여러 장 + 설명 + 이전/다음
function renderDetail() {
  const root = document.getElementById("work");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const order = [...WORKS].sort((a, b) => b.year - a.year);
  const i = order.findIndex((w) => w.slug === id);
  if (i < 0) { root.innerHTML = `<p>작품을 찾을 수 없습니다. <a href="index.html">← 목록</a></p>`; return; }
  const w = order[i], prev = order[i - 1], next = order[i + 1];
  document.title = `${w.title} — ${document.title}`;
  root.innerHTML = `
    <div class="work-head">
      <h1>${esc(w.title)}</h1>
      ${w.titleEn ? `<div class="en">${esc(w.titleEn)}</div>` : ""}
      <div class="meta">${esc(metaLine(w))}</div>
      ${w.mediumEn ? `<div class="en">${esc(w.mediumEn)}</div>` : ""}
    </div>
    ${w.images.map((im) => `
      <figure class="figure">
        <img src="${esc(im.src)}" alt="${esc(w.title)} ${esc(im.caption)}" loading="lazy">
        ${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ""}
      </figure>`).join("")}
    ${w.text ? `<div class="work-text">${esc(w.text)}</div>` : ""}
    <nav class="pager">
      <span>${prev ? `<a href="work.html?id=${encodeURIComponent(prev.slug)}">← ${esc(prev.title)}</a>` : ""}</span>
      <span>${next ? `<a href="work.html?id=${encodeURIComponent(next.slug)}">${esc(next.title)} →</a>` : ""}</span>
    </nav>`;
}

renderIndex();
renderDetail();
