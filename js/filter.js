// filter.js -- the one search box: hides cards, strips, world tiles, silhouettes and table rows that do not match,
// and any section left with nothing in it. Table header rows are never hidden.

const ITEMS = "[data-s], .strip, .world, .sil figure";

export function initFilter(input, counter) {
  if (!input) return;
  const rows = [...document.querySelectorAll("table tr")].filter((r) => !r.querySelector("th"));
  const items = [
    ...[...document.querySelectorAll("[data-s]")].map((e) => [e, e.dataset.s]),
    ...[...document.querySelectorAll(".strip, .world, .sil figure")].map((e) => [e, e.textContent.toLowerCase()]),
    ...rows.map((e) => [e, e.textContent.toLowerCase()]),
  ];
  const run = () => {
    const t = input.value.trim().toLowerCase();
    let n = 0;
    for (const [el, text] of items) {
      const hit = !t || text.includes(t);
      el.hidden = !hit;
      if (hit) n++;
    }
    counter.textContent = t ? `${n} shown` : "";
    for (const s of document.querySelectorAll("section")) {
      const owns = s.querySelector(ITEMS) || s.querySelector("table tr");
      if (!owns) { s.hidden = s.hidden && s.dataset.off === "1"; continue; }
      const any = s.querySelector(ITEMS.split(", ").map((x) => x + ":not([hidden])").join(", ")) ||
        [...s.querySelectorAll("table tr")].some((r) => !r.hidden && !r.querySelector("th"));
      s.hidden = s.dataset.off === "1" || (!!t && !any);
    }
  };
  input.addEventListener("input", run);
  input.addEventListener("keydown", (e) => { if (e.key === "Escape") { input.value = ""; run(); } });
}
