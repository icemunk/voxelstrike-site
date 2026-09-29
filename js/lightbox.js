// lightbox.js -- anything with data-full opens full size on a click: images, and video with controls from the start.

export function initLightbox(box) {
  if (!box) return;
  const img = box.querySelector("img"), vid = box.querySelector("video");
  const shut = () => {
    box.classList.remove("on");
    box.setAttribute("aria-hidden", "true");
    vid.pause(); vid.removeAttribute("src"); vid.load();
    img.removeAttribute("src");
  };
  const open = (src, alt) => {
    const isVideo = /\.(mp4|webm)$/i.test(src);
    img.hidden = isVideo; vid.hidden = !isVideo;
    if (isVideo) { vid.src = src; vid.currentTime = 0; vid.play().catch(() => {}); }
    else { img.src = src; img.alt = alt || ""; }
    box.classList.add("on");
    box.setAttribute("aria-hidden", "false");
  };
  document.addEventListener("click", (e) => {
    const full = e.target.dataset && e.target.dataset.full;
    if (full && !box.contains(e.target)) { open(full, e.target.alt); e.preventDefault(); }
    else if (box.classList.contains("on") && !vid.contains(e.target)) shut();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") shut(); });
}
