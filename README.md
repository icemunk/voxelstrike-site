# The VoxelStrike website

A static site: plain HTML, CSS and JavaScript modules over two generated JSON files. No framework, no build
step for the page itself. What you edit and what a tool writes are kept in separate files, so a regeneration
never overwrites an edit.

## What is what

| File | What it is | Who changes it |
|---|---|---|
| `index.html` | The page: header, trailer block, nav, every section's heading and copy, the card `<template>` | you |
| `style.css` | All styling | you |
| `site.json` | Settings: the trailer's YouTube id / link, `hide_sections` (section ids to leave out) | you |
| `js/main.js` | Boot: loads `site.json` + the data, fills every `data-render` container, wires the features | you, rarely |
| `js/sections.js` | One render function per list, keyed by the name a container asks for | you, to add or change a list |
| `js/ui.js` | Building blocks every list uses: `card`, `table`, `figure`, `h`, number formatting | you, rarely |
| `js/trailer.js`, `js/filter.js`, `js/lightbox.js` | One feature each | you, rarely |
| `data/game.json` | **Generated** from the game's tables by `sitedata.py` (`python sitegen.py --data`) | tools only |
| `data/trailer.json` | **Generated** by `python trailer.py --site` | tools only |
| `media/` | **Generated** renders (`python sitegen.py`, `python trailer.py --site`) | tools only |
| `manifest.json` | The build's own bookkeeping (source hashes, facts) | tools only |

## Common edits

- **Change text**: edit it in `index.html`.
- **Change the look**: `style.css`. The card markup is the `<template id="t-card">` at the bottom of `index.html`.
- **Swap the trailer video**: put the YouTube id in `site.json` (`trailer.youtube`, `trailer.youtube_url`).
- **Hide a section**: add its id to `hide_sections` in `site.json` (e.g. `["campaign"]`).
- **Add a list**: put `<div data-render="my-list"></div>` in `index.html`, and add `"my-list": (el, data) => ...` to
  `sections` in `js/sections.js`. If it needs new facts from the game, add them in `sitedata.py`.
- **Change what a card says** (a stat, a tag): `sitedata.py`, then `python sitegen.py --data`.

## Preview

    python -m http.server 8842 --directory site

then open http://localhost:8842 (the page uses JavaScript modules, which browsers do not load from `file://`).

## Before publishing

    python site_check.py          # the gate: every file referenced exists, every module import resolves, sizes fit
    python publish_site.py        # where it stands; add --mirror --yes to publish to GitHub Pages
