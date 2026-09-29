// ui.js -- the page's building blocks. Every list on the page is made of these, so a change here (a card's
// markup lives in index.html's <template id="t-card">; its behaviour lives here) changes every section at once.

export const fmt = {
  int: (v) => (v == null ? "—" : Number(v).toLocaleString("en")),
  num: (v, d = 2) => (v == null ? "—" : Number(v).toFixed(d)),
};

// h("td", {class: "num"}, "12") -- a small element builder; text is always set as text, never as HTML
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

// a card: {key, name, desc, media, bars:[[label, pct, value]], tags:[text], accent, tall}
export function card(d) {
  const node = document.getElementById("t-card").content.firstElementChild.cloneNode(true);
  if (d.tall) node.classList.add("tall");
  if (d.accent) node.style.setProperty("--accent", d.accent);
  const img = node.querySelector(".shot");
  if (d.media) {
    img.src = d.media;
    img.alt = d.name || d.key;
    img.dataset.full = d.media;
  } else {
    img.remove();
  }
  node.querySelector(".nm").textContent = d.name || d.key;
  node.querySelector(".key").textContent = d.key || "";
  const ds = node.querySelector(".ds");
  if (d.desc) ds.textContent = d.desc; else ds.remove();
  const bars = node.querySelector(".bars");
  if (d.bars && d.bars.length) {
    for (const [label, pct, value] of d.bars) {
      bars.append(h("div", {class: "bar"}, h("span", {}, label.toUpperCase()),
        h("span", {class: "t"}, h("i", {style: {width: pct + "%"}})), h("span", {class: "v"}, value)));
    }
  } else bars.remove();
  const tags = node.querySelector(".tags");
  if (d.tags && d.tags.length) tags.append(...d.tags.map((t) => h("span", {class: "tag"}, t)));
  else tags.remove();
  // what the filter matches: the card's own content, so nothing is tagged twice
  node.dataset.s = [d.key, d.name, d.desc, ...(d.tags || [])].filter(Boolean).join(" ").toLowerCase();
  return node;
}

// a table: columns [{label, value: row => text, num: bool, cls}] over rows
export function table(columns, rows, attrs = {}) {
  const head = h("tr", {}, columns.map((c) => h("th", {class: c.num ? "num" : null}, c.label)));
  const body = rows.map((r) => h("tr", {}, columns.map((c, i) => {
    const v = c.value(r);
    return h("td", {class: [c.num ? "num" : "", i === 0 ? "k" : "", c.cls || ""].join(" ").trim() || null},
      v instanceof Node ? v : String(v ?? "—"));
  })));
  return h("table", attrs, head, body);
}

export function figure(cls, media, alt, caption) {
  return h("figure", {class: cls},
    h("img", {src: media, alt, loading: "lazy", decoding: "async", "data-full": media}),
    h("figcaption", {}, caption));
}
