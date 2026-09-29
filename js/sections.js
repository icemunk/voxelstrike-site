// sections.js -- ONE FUNCTION PER LIST ON THE PAGE, keyed by the name a container asks for with data-render="...".
// Each receives (el, data, ctx): the container, the whole of data/game.json, and {site, trailer} settings.
// To add a list: write a function here and put a <div data-render="its-name"> where it should appear.

import {h, card, table, figure, fmt} from "./ui.js";

function clipFigure(c, cls) {
  const v = h("video", {src: c.video, poster: c.poster, autoplay: true, muted: true, loop: true, playsinline: true,
    preload: cls.includes("hero") ? "metadata" : "none", "data-full": c.video, "aria-label": c.title});
  v.muted = true;                                  // the attribute alone does not satisfy autoplay policies
  return h("figure", {class: cls}, v, h("figcaption", {class: "cap"}, h("b", {}, c.title), h("span", {}, c.note)));
}

export const sections = {
  "clips-hero": (el, d) => d.clips.filter((c) => c.hero).forEach((c) => el.append(clipFigure(c, "clip hero"))),
  "clips": (el, d) => d.clips.filter((c) => !c.hero).forEach((c) => el.append(clipFigure(c, "clip"))),

  "fleet": (el, d) => {
    const group = d.fleet.find((g) => g.cls === el.dataset.cls);
    if (group) el.append(...group.cards.map(card));
  },

  "mechs": (el, d) => el.append(...d.mechs.cards.map(card)),
  "mech-turning": (el, d) => el.append(...d.mechs.turning.map((m) =>
    figure("", m.media, m.name + " turning", m.name))),

  "arsenal": (el, d) => el.append(table([
    {label: "Weapon", value: (w) => w.name},
    {label: "Kind", value: (w) => w.kind},
    {label: "Guidance", value: (w) => w.guidance},
    {label: "DPS", num: true, value: (w) => fmt.int(w.dps)},
    {label: "Reach", num: true, value: (w) => fmt.int(w.reach)},
    {label: "Blast", num: true, value: (w) => fmt.int(w.blast)},
    {label: "Ammo", num: true, value: (w) => (w.ammo == null ? "inf" : w.ammo)},
    {label: "Engages", value: (w) => w.engages.join(", ")},
  ], d.arsenal)),

  "ordnance": (el, d) => el.append(...d.ordnance.cards.map((o) => card({...o,
    desc: o.flown_by.length ? `Flown by ${o.flown_by.length} weapon${o.flown_by.length === 1 ? "" : "s"}.`
                            : "The generic fallback shape. Nothing in the arsenal currently selects it."}))),
  "tracers": (el, d) => {
    const t = d.ordnance.tracers;
    if (!t.length) return el.remove();
    el.append(h("b", {}, `${t.length} weapons have no round model, deliberately.`),
      " A tracer round and a beam ARE their glowing streak — a model fights the look. Those weapons are: ",
      t.join(", "), ".");
  },

  "opposition": (el, d) => el.append(...d.opposition.map(card)),

  "campaign": (el, d) => el.append(table([
    {label: "Mission", value: (m) => m.name},
    {label: "Machine", value: (m) => m.machine},
    {label: "Objective", value: (m) => m.objective},
    {label: "Stages", num: true, value: (m) => m.stages},
    {label: "Weather", value: (m) => m.weather},
  ], d.campaign)),

  "world-table": (el, d) => el.append(table([
    {label: "Preset", value: (p) => p.key},
    {label: "Water", num: true, value: (p) => fmt.num(p.water)},
    {label: "Mountains", num: true, value: (p) => fmt.num(p.mountains)},
    {label: "Relief", num: true, value: (p) => fmt.num(p.relief)},
    {label: "Forest", num: true, value: (p) => fmt.num(p.forest)},
    {label: "Theme", value: (p) => p.theme},
  ], d.worlds.presets)),
  "world-tiles": (el, d) => el.append(...d.worlds.tiles.map((w) => {
    const f = w.facts, bits = [];
    if (f.size) bits.push(`${f.size}²`);
    if (f.relief) bits.push(`${Math.round(f.relief)} relief`);
    for (const [k, lbl] of [["props", "props"], ["trees", "trees"], ["roads", "roads"], ["bridges", "bridges"],
                            ["powerlines", "lines"]]) if (f[k]) bits.push(`${fmt.int(f[k])} ${lbl}`);
    return figure("world", w.media, `${w.key} from above`,
      [h("b", {}, w.key), h("span", {class: "wt"}, w.label), h("span", {class: "wf"}, bits.join(" · "))]);
  })),

  "biomes": (el, d) => {
    const band = (v) => (v ? `${v[0].toFixed(2)}–${v[1].toFixed(2)}` : "—");
    el.append(table([
      {label: "Biome", value: (b) => b.key},
      {label: "Palette", cls: "sw", value: (b) => h("span", {},
        b.palette.map((c) => h("i", {style: {background: `rgb(${c.join(",")})`}})))},
      {label: "Temp", num: true, value: (b) => band(b.climate.temp)},
      {label: "Moist", num: true, value: (b) => band(b.climate.moist)},
      {label: "Elev", num: true, value: (b) => band(b.climate.elev)},
      {label: "What grows there", cls: "gr", value: (b) => b.grows.join(", ") || "—"},
    ], d.biomes, {class: "biomes"}));
  },

  "scenery": (el, d) => {
    const group = d.scenery.find((g) => g.group === el.dataset.group);
    if (group) el.append(...group.cards.map(card));
  },

  "flora": (el, d) => el.append(...d.flora.map((f) => figure("strip", f.media, `${f.name} variants`, [
    h("b", {}, f.name), h("span", {class: "key"}, f.key),
    h("span", {class: "vn"}, `${f.variants} variant${f.variants === 1 ? "" : "s"}`),
    f.where ? h("span", {class: "wh"}, f.where) : null]))),

  "gate": (el, d) => {
    const fx = d.numbers.facts;
    if (!fx.checks) return el.remove();
    const pc = (100 * (fx.checks_pass || 0)) / Math.max(1, fx.checks);
    const fig = (v, label, note) => h("div", {class: "fig"}, h("b", {}, v), h("span", {}, label), h("i", {}, note));
    el.append(fig(fmt.int(fx.checks), "Checks in the battery", "each one drives the game"),
      fig(pc.toFixed(1) + "%", "Passing", `${fmt.int(fx.checks_pass)} of ${fmt.int(fx.checks)}`),
      fig(((fx.checks_secs || 0) / 3600).toFixed(1) + " h", "Of gate per full run", "sharded across workers"));
    if (fx.lessons) el.append(fig(fmt.int(fx.lessons), "Recorded lessons",
      `${fmt.int(fx.log_lines || 0)} lines of evidence behind them`));
  },
  "checks": (el, d) => el.append(...d.numbers.sample_checks.map((n) => h("li", {}, n))),
  "work": (el, d) => el.append(...d.numbers.work.map((w) =>
    h("li", {}, h("code", {}, w.sha), h("time", {}, w.date), h("span", {}, w.subject)))),
  "stamp": (el, d) => { el.textContent = [d.build.stamp, d.build.commit].filter(Boolean).join(" · "); },
};
