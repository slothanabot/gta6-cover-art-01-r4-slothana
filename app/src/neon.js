// Neon Grid Cover Studio — cover rendering engine.
// Draws a multi-panel GTA-style poster on any 2D canvas: photo panels with
// white gutters, a Vice City neon grade, bold outlined caption lettering,
// a tilted title band, grain and vignette. No network, no fonts to fetch.
"use strict";

const NEON_GRADES = {
  "sunset": {
    sky: ["#ff7a18", "#ff2d95", "#7b2ff7"],
    wash: "rgba(255, 110, 30, 0.16)",
    deep: "rgba(123, 47, 247, 0.20)",
    glow: "#ff2d95",
    line: "#ffb347",
  },
  "neon-night": {
    sky: ["#22d3ee", "#2563eb", "#ff2d95"],
    wash: "rgba(34, 211, 238, 0.16)",
    deep: "rgba(255, 45, 149, 0.20)",
    glow: "#22d3ee",
    line: "#ff2d95",
  },
  "vice-pink": {
    sky: ["#ff5da2", "#c026d3", "#4c1d95"],
    wash: "rgba(255, 93, 162, 0.18)",
    deep: "rgba(76, 29, 149, 0.22)",
    glow: "#ff5da2",
    line: "#f0abfc",
  },
  "teal-heat": {
    sky: ["#2dd4bf", "#0ea5e9", "#f97316"],
    wash: "rgba(45, 212, 191, 0.15)",
    deep: "rgba(249, 115, 22, 0.20)",
    glow: "#2dd4bf",
    line: "#fdba74",
  },
  "mono-neon": {
    sky: ["#e5e7eb", "#9ca3af", "#22d3ee"],
    wash: "rgba(229, 231, 235, 0.10)",
    deep: "rgba(34, 211, 238, 0.18)",
    glow: "#22d3ee",
    line: "#ffffff",
  },
};

const NEON_LAYOUTS = ["six", "four", "nine", "solo"];

function neonPanelCount(layout) {
  if (layout === "six") return 4;
  if (layout === "four") return 4;
  if (layout === "nine") return 9;
  return 1;
}

function neonDefaultState() {
  return {
    layout: "six",
    grade: "sunset",
    title: "NEON GRID",
    subtitle: "Vice City Nights",
    badge: "EST. 2026",
    grain: true,
    panels: [],
  };
}

// Panel rectangles for a layout, as fractions of the cover, with a white
// gutter between them. Returns { rects, bandY, bandH } in pixels.
function neonLayoutRects(layout, W, H) {
  const g = Math.max(4, Math.round(W * 0.007));
  const rects = [];
  if (layout === "six") {
    rects.push({ x: 0, y: 0, w: W, h: Math.round(H * 0.5) - g });
    const y = Math.round(H * 0.5) + g;
    const h = H - y;
    const w = Math.round((W - 2 * g) / 3);
    for (let i = 0; i < 3; i++) {
      rects.push({ x: i * (w + g), y: y, w: w, h: h });
    }
    return { rects: rects, bandY: H * 0.40, bandH: H * 0.17, gutter: g };
  }
  if (layout === "four") {
    const w = Math.round((W - g) / 2);
    const h = Math.round((H - g) / 2);
    rects.push({ x: 0, y: 0, w: w, h: h });
    rects.push({ x: w + g, y: 0, w: w, h: h });
    rects.push({ x: 0, y: h + g, w: w, h: h });
    rects.push({ x: w + g, y: h + g, w: w, h: h });
    return { rects: rects, bandY: H * 0.41, bandH: H * 0.17, gutter: g };
  }
  if (layout === "nine") {
    const w = Math.round((W - 2 * g) / 3);
    const h = Math.round((H - 2 * g) / 3);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        rects.push({ x: c * (w + g), y: r * (h + g), w: w, h: h });
      }
    }
    return { rects: rects, bandY: H * 0.40, bandH: H * 0.16, gutter: g };
  }
  rects.push({ x: 0, y: 0, w: W, h: H });
  return { rects: rects, bandY: H * 0.60, bandH: H * 0.20, gutter: g };
}

// Draw one photo into one panel, cover-fit, with the panel's zoom and pan.
function drawNeonPanelPhoto(ctx, img, rect, panel) {
  if (!img) return false;
  const iw = img.width || img.naturalWidth;
  const ih = img.height || img.naturalHeight;
  if (!iw || !ih) return false;
  const zoom = panel && panel.zoom ? panel.zoom : 1;
  const panX = panel && panel.panX ? panel.panX : 0;
  const panY = panel && panel.panY ? panel.panY : 0;
  const scale = Math.max(rect.w / iw, rect.h / ih) * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  let dx = rect.x + (rect.w - dw) / 2 + (panX / 100) * rect.w * 0.35;
  let dy = rect.y + (rect.h - dh) / 2 + (panY / 100) * rect.h * 0.35;
  // Clamp the pan so the photo always covers the whole panel: a shifted
  // photo must never leave a white strip at the panel's edge.
  dx = Math.min(rect.x, Math.max(rect.x + rect.w - dw, dx));
  dy = Math.min(rect.y, Math.max(rect.y + rect.h - dh, dy));
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
  return true;
}

// Empty panel: a neon placeholder so the grid still reads as a poster.
function drawNeonEmptyPanel(ctx, rect, grade, index) {
  const grad = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
  grad.addColorStop(0, "#241040");
  grad.addColorStop(1, "#12081f");
  ctx.fillStyle = grad;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeStyle = grade.glow;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 2;
  ctx.strokeRect(rect.x + 6, rect.y + 6, rect.w - 12, rect.h - 12);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "700 " + Math.max(13, Math.round(rect.w * 0.045)) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PANEL " + (index + 1) + " — ADD PHOTO", rect.x + rect.w / 2, rect.y + rect.h / 2);
}

// Sunset / neon colour grade over the whole cover.
function applyNeonGrade(ctx, grade, W, H) {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, grade.sky[0]);
  sky.addColorStop(0.55, grade.sky[1]);
  sky.addColorStop(1, grade.sky[2]);
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = "soft-light";
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = grade.wash;
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = grade.deep;
  ctx.fillRect(0, H * 0.55, W, H * 0.45);
  ctx.restore();
}

// Shrink the title until it fits the band width.
function fitNeonTitle(ctx, text, maxWidth, startSize) {
  let size = startSize;
  const family = '"Arial Black", Impact, "Franklin Gothic Heavy", sans-serif';
  while (size > 20) {
    ctx.font = "900 " + size + "px " + family;
    if (ctx.measureText(text).width <= maxWidth) break;
    size = Math.floor(size * 0.92);
  }
  return size;
}

// The tilted title band: dark strip, neon edge lines, bold outlined title,
// script-style subtitle and a badge pill.
function drawNeonTitleBand(ctx, state, grade, W, H, bandY, bandH) {
  const cx = W / 2;
  const cy = bandY + bandH / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.03);
  ctx.fillStyle = "rgba(12, 3, 24, 0.86)";
  ctx.fillRect(-W / 2, -bandH / 2, W, bandH);
  ctx.shadowColor = grade.glow;
  ctx.shadowBlur = Math.round(W * 0.012);
  ctx.fillStyle = grade.line;
  ctx.fillRect(-W / 2, -bandH / 2, W, Math.max(2, H * 0.004));
  ctx.fillRect(-W / 2, bandH / 2 - Math.max(2, H * 0.004), W, Math.max(2, H * 0.004));
  ctx.shadowBlur = 0;
  const title = (state.title || "NEON GRID").toUpperCase();
  const size = fitNeonTitle(ctx, title, W * 0.92, Math.round(bandH * 0.52));
  ctx.font = "900 " + size + 'px "Arial Black", Impact, "Franklin Gothic Heavy", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.shadowColor = grade.glow;
  ctx.shadowBlur = Math.round(size * 0.28);
  ctx.strokeStyle = "#0d0714";
  ctx.lineWidth = Math.max(3, Math.round(size * 0.14));
  ctx.strokeText(title, 0, -bandH * 0.08);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 0, -bandH * 0.08);
  ctx.shadowBlur = 0;
  if (state.subtitle) {
    ctx.font = "italic 700 " + Math.round(bandH * 0.22) + 'px Georgia, "Times New Roman", serif';
    ctx.fillStyle = grade.line;
    ctx.fillText(state.subtitle, 0, bandH * 0.30);
  }
  ctx.restore();
  if (state.badge) {
    const pad = Math.round(W * 0.012);
    ctx.font = "700 " + Math.round(H * 0.016) + 'px "Segoe UI", system-ui, sans-serif';
    const tw = ctx.measureText(state.badge).width;
    const bw = tw + pad * 2;
    const bh = Math.round(H * 0.032);
    const bx = W - bw - Math.round(W * 0.02);
    const by = Math.round(H * 0.02);
    ctx.save();
    ctx.fillStyle = "rgba(12, 3, 24, 0.85)";
    ctx.strokeStyle = grade.glow;
    ctx.lineWidth = 2;
    ctx.shadowColor = grade.glow;
    ctx.shadowBlur = 10;
    roundNeonRect(ctx, bx, by, bw, bh, bh / 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(state.badge, bx + bw / 2, by + bh / 2 + 1);
    ctx.restore();
  }
}

function roundNeonRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Deterministic film grain (seeded, so two runs of main.ts match).
function mulberryNeon(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addNeonGrain(ctx, W, H) {
  const rand = mulberryNeon(20261119);
  const count = Math.floor((W * H) / 1100);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const v = rand();
    ctx.globalAlpha = 0.05 + rand() * 0.06;
    ctx.fillStyle = v > 0.5 ? "#ffffff" : "#000000";
    ctx.fillRect(rand() * W, rand() * H, 1.6, 1.6);
  }
  ctx.restore();
}

function drawNeonVignette(ctx, W, H) {
  const grad = ctx.createRadialGradient(
    W / 2, H / 2, Math.min(W, H) * 0.42,
    W / 2, H / 2, Math.max(W, H) * 0.75,
  );
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(5,0,12,0.42)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

// The whole cover. state.panels[i] = { img, zoom, panX, panY } (img may be
// an HTMLImageElement or a canvas). Missing photos get neon placeholders.
function drawNeonCover(ctx, state, W, H) {
  const grade = NEON_GRADES[state.grade] || NEON_GRADES["sunset"];
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  const layout = neonLayoutRects(state.layout || "six", W, H);
  layout.rects.forEach(function (rect, i) {
    const panel = state.panels && state.panels[i];
    const drawn = panel && panel.img ? drawNeonPanelPhoto(ctx, panel.img, rect, panel) : false;
    if (!drawn) drawNeonEmptyPanel(ctx, rect, grade, i);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x + 1, rect.y + 1, rect.w - 2, rect.h - 2);
  });
  applyNeonGrade(ctx, grade, W, H);
  drawNeonTitleBand(ctx, state, grade, W, H, layout.bandY, layout.bandH);
  if (state.grain !== false) addNeonGrain(ctx, W, H);
  drawNeonVignette(ctx, W, H);
  ctx.restore();
}
