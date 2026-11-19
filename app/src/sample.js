// Neon Grid Cover Studio — procedural sample photos.
// The app's built-in demo pictures are painted here with canvas paths, so
// the entry ships its own art and needs no photo files. Each scene returns
// a canvas the cover engine can draw like any loaded photo.
"use strict";

function neonSampleCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function paintNeonPalm(ctx, x, y, s, lean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean || 0);
  ctx.strokeStyle = "#1c0b26";
  ctx.lineWidth = 7 * s;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(6 * s, -70 * s, 2 * s, -130 * s);
  ctx.stroke();
  ctx.fillStyle = "#1c0b26";
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * 0.08 - (i * Math.PI) / 7;
    ctx.beginPath();
    ctx.moveTo(2 * s, -130 * s);
    ctx.quadraticCurveTo(
      2 * s + Math.cos(a) * 55 * s,
      -130 * s + Math.sin(a) * 30 * s - 18 * s,
      2 * s + Math.cos(a) * 95 * s,
      -130 * s + Math.sin(a) * 55 * s + 26 * s,
    );
    ctx.quadraticCurveTo(
      2 * s + Math.cos(a) * 50 * s,
      -130 * s + Math.sin(a) * 45 * s + 8 * s,
      2 * s, -130 * s,
    );
    ctx.fill();
  }
  ctx.restore();
}

function paintNeonConvertible(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = "#2a0a1e";
  ctx.beginPath();
  ctx.moveTo(-150, 0);
  ctx.lineTo(-140, -28);
  ctx.quadraticCurveTo(-100, -44, -60, -44);
  ctx.lineTo(-30, -46);
  ctx.quadraticCurveTo(10, -48, 60, -40);
  ctx.lineTo(130, -26);
  ctx.quadraticCurveTo(150, -12, 148, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ff9a3d";
  ctx.fillRect(-28, -40, 84, 8);
  ctx.fillStyle = "#1c0b26";
  ctx.beginPath();
  ctx.arc(-88, 0, 26, 0, Math.PI * 2);
  ctx.arc(88, 0, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3b1d5e";
  ctx.beginPath();
  ctx.arc(-88, 0, 12, 0, Math.PI * 2);
  ctx.arc(88, 0, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintSampleBoulevard(w, h) {
  const c = neonSampleCanvas(w, h);
  const ctx = c.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, "#ffb347");
  sky.addColorStop(0.45, "#ff5e62");
  sky.addColorStop(0.8, "#c026d3");
  sky.addColorStop(1, "#4c1d95");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.72);
  ctx.save();
  ctx.shadowColor = "#ffdf8a";
  ctx.shadowBlur = 60;
  ctx.fillStyle = "#fff3c4";
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, h * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#2a1245";
  let bx = 0;
  while (bx < w) {
    const bw = w * (0.06 + ((bx * 7) % 10) / 90);
    const bh = h * (0.10 + ((bx * 13) % 10) / 70);
    ctx.fillRect(bx, h * 0.72 - bh, bw, bh);
    bx += bw + w * 0.015;
  }
  paintNeonPalm(ctx, w * 0.12, h * 0.74, h / 480, -0.06);
  paintNeonPalm(ctx, w * 0.88, h * 0.74, h / 520, 0.08);
  paintNeonPalm(ctx, w * 0.04, h * 0.76, h / 640, -0.12);
  const road = ctx.createLinearGradient(0, h * 0.72, 0, h);
  road.addColorStop(0, "#3d1a4d");
  road.addColorStop(1, "#160a24");
  ctx.fillStyle = road;
  ctx.fillRect(0, h * 0.72, w, h * 0.28);
  ctx.fillStyle = "#ffd166";
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(w * 0.5 - 4, h * (0.74 + i * 0.045), 8, h * 0.022);
  }
  paintNeonConvertible(ctx, w * 0.5, h * 0.88, h / 620);
  return c;
}

function paintSampleNeonStreet(w, h) {
  const c = neonSampleCanvas(w, h);
  const ctx = c.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#0a0a2e");
  sky.addColorStop(0.6, "#1a0b2e");
  sky.addColorStop(1, "#2a0a2e");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  // Dark building blocks with lit windows fill the upper half.
  ctx.fillStyle = "#0d0714";
  let bx = 0;
  while (bx < w) {
    const bw = w * (0.14 + ((bx * 5) % 10) / 80);
    const bh = h * (0.34 + ((bx * 11) % 10) / 60);
    ctx.fillRect(bx, h * 0.62 - bh, bw, bh);
    ctx.fillStyle = "rgba(255, 209, 102, 0.75)";
    for (let wy = 0; wy < 3; wy++) {
      for (let wx = 0; wx < 2; wx++) {
        if (((bx + wy * 3 + wx * 7) % 5) < 3) {
          ctx.fillRect(bx + bw * (0.2 + wx * 0.45), h * 0.62 - bh + 12 + wy * h * 0.08, bw * 0.16, h * 0.03);
        }
      }
    }
    ctx.fillStyle = "#0d0714";
    bx += bw + w * 0.02;
  }
  const signs = [
    { x: 0.05, y: 0.06, w: 0.20, h: 0.30, color: "#ff2d95", label: "DINER" },
    { x: 0.30, y: 0.04, w: 0.17, h: 0.38, color: "#22d3ee", label: "HOTEL" },
    { x: 0.54, y: 0.07, w: 0.21, h: 0.28, color: "#ffd166", label: "PIZZA" },
    { x: 0.80, y: 0.05, w: 0.15, h: 0.36, color: "#a78bfa", label: "BAR" },
  ];
  signs.forEach(function (s) {
    const x = s.x * w;
    const y = s.y * h;
    const sw = s.w * w;
    const sh = s.h * h;
    ctx.save();
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 30;
    ctx.fillStyle = s.color;
    ctx.fillRect(x, y, sw, sh);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#0d0714";
    ctx.font = "900 " + Math.round(sh * 0.30) + 'px "Arial Black", Impact, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s.label, x + sw / 2, y + sh / 2);
    ctx.restore();
  });
  // Wet street with neon reflections.
  ctx.fillStyle = "#12081f";
  ctx.fillRect(0, h * 0.62, w, h * 0.38);
  signs.forEach(function (s, i) {
    const grad = ctx.createLinearGradient(0, h * 0.62, 0, h);
    grad.addColorStop(0, s.color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.globalAlpha = 0.5 - i * 0.05;
    ctx.fillStyle = grad;
    ctx.fillRect(s.x * w, h * 0.62, s.w * w, h * 0.38);
    ctx.restore();
  });
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(w * (0.08 + i * 0.11), h * 0.94, w * 0.05, 3);
  }
  function neonPerson(px, py, s, coat) {
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(s, s);
    ctx.fillStyle = "#0d0714";
    ctx.beginPath();
    ctx.arc(0, -52, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = coat;
    ctx.beginPath();
    ctx.moveTo(-16, -38);
    ctx.quadraticCurveTo(0, -46, 16, -38);
    ctx.lineTo(20, 30);
    ctx.lineTo(-20, 30);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#0d0714";
    ctx.fillRect(-18, 30, 12, 42);
    ctx.fillRect(6, 30, 12, 42);
    ctx.restore();
  }
  neonPerson(w * 0.40, h * 0.88, h / 480, "#ff2d95");
  neonPerson(w * 0.60, h * 0.88, h / 480, "#22d3ee");
  return c;
}

function paintSamplePier(w, h) {
  const c = neonSampleCanvas(w, h);
  const ctx = c.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  sky.addColorStop(0, "#7dd3fc");
  sky.addColorStop(0.55, "#fbbf24");
  sky.addColorStop(1, "#f97316");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.6);
  ctx.save();
  ctx.shadowColor = "#fff7cc";
  ctx.shadowBlur = 46;
  ctx.fillStyle = "#fff7cc";
  ctx.beginPath();
  ctx.arc(w * 0.68, h * 0.34, h * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const sea = ctx.createLinearGradient(0, h * 0.6, 0, h);
  sea.addColorStop(0, "#0e7490");
  sea.addColorStop(1, "#164e63");
  ctx.fillStyle = sea;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    const y = h * (0.64 + i * 0.05);
    ctx.beginPath();
    ctx.moveTo(w * (0.05 + (i % 3) * 0.06), y);
    ctx.lineTo(w * (0.55 + (i % 2) * 0.2), y);
    ctx.stroke();
  }
  ctx.fillStyle = "#5b3a1e";
  ctx.beginPath();
  ctx.moveTo(w * 0.30, h);
  ctx.lineTo(w * 0.44, h * 0.58);
  ctx.lineTo(w * 0.56, h * 0.58);
  ctx.lineTo(w * 0.66, h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#3f2712";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const y = h * (0.62 + i * 0.075);
    ctx.beginPath();
    ctx.moveTo(w * (0.32 + i * 0.02), y);
    ctx.lineTo(w * (0.64 - i * 0.02), y);
    ctx.stroke();
  }
  ctx.save();
  ctx.translate(w * 0.5, h * 0.56);
  ctx.fillStyle = "#12081f";
  ctx.beginPath();
  ctx.arc(0, -58, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-14, -46, 28, 46);
  ctx.fillRect(-14, 0, 10, 40);
  ctx.fillRect(4, 0, 10, 40);
  ctx.strokeStyle = "#12081f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(10, -34);
  ctx.lineTo(120, -120);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(120, -120);
  ctx.quadraticCurveTo(90, -40, 70, 60);
  ctx.stroke();
  ctx.restore();
  return c;
}

const NEON_SAMPLE_SCENES = ["boulevard", "neon-street", "pier"];

function paintNeonSampleScene(scene, w, h) {
  if (scene === "neon-street") return paintSampleNeonStreet(w, h);
  if (scene === "pier") return paintSamplePier(w, h);
  return paintSampleBoulevard(w, h);
}
