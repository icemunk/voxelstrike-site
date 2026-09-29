// trailer.js -- the trailer at the top of the page.
// With a YouTube id in site.json: the poster with a play button, swapped for the YouTube player on a click (nothing is
// fetched from YouTube until then). Without one: the page's own copy (data/trailer.json) plays in place.

import {h} from "./ui.js";

export function renderTrailer(frame, links, site, trailer) {
  const yt = site.trailer && site.trailer.youtube;
  if (!yt && !(trailer && trailer.video)) {
    frame.closest("section").hidden = true;
    return;
  }
  if (yt) {
    const btn = h("button", {class: "yt", "aria-label": "Play the VoxelStrike trailer"},
      h("img", {src: trailer && trailer.poster ? trailer.poster : `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`,
        alt: "VoxelStrike trailer"}),
      h("span", {class: "play"}));
    btn.addEventListener("click", () => {
      btn.replaceWith(h("iframe", {src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`,
        title: "VoxelStrike trailer", allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
        allowfullscreen: true}));
    });
    frame.append(btn);
  } else {
    frame.append(h("video", {src: trailer.video, poster: trailer.poster, controls: true, playsinline: true,
      preload: "metadata", "aria-label": "VoxelStrike trailer"}));
  }
  if (site.trailer && site.trailer.youtube_url) {
    links.append(h("a", {href: site.trailer.youtube_url, rel: "noopener"}, "Watch in 1080p60 on YouTube"));
  }
  if (trailer && trailer.video) {
    links.append(" ", h("a", {href: trailer.video, download: true}, "Download (720p, MP4)"));
  }
}
