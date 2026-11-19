// Neon Grid Cover Studio — editor wiring.
// Connects the controls to the cover engine, handles photo uploads, export
// to PNG, and the ?shot= modes the maker uses for screenshots: ?shot=editor
// loads a sample photo into every panel, ?shot=cover draws one exported
// cover full-frame (size/layout/grade/title as query params).
"use strict";

const NEON_SIZES = {
  "1080x1080": [1080, 1080],
  "1080x1350": [1080, 1350],
  "1920x1080": [1920, 1080],
};

const neonState = neonDefaultState();
neonState.panels = [];
for (let i = 0; i < 9; i++) {
  neonState.panels.push({ img: null, zoom: 1, panX: 0, panY: 0 });
}
let neonActivePanel = 0;
let neonSceneIndex = 0;

const coverCanvas = document.getElementById("coverCanvas");
const titleInput = document.getElementById("titleInput");
const subtitleInput = document.getElementById("subtitleInput");
const badgeInput = document.getElementById("badgeInput");
const grainToggle = document.getElementById("grainToggle");
const zoomSlider = document.getElementById("zoomSlider");
const panXSlider = document.getElementById("panXSlider");
const panYSlider = document.getElementById("panYSlider");

function neonPreviewSize() {
  const dims = NEON_SIZES[neonState.size] || NEON_SIZES["1080x1350"];
  const scale = 540 / dims[0];
  return [Math.round(dims[0] * scale), Math.round(dims[1] * scale)];
}

function renderNeonCover() {
  const size = neonPreviewSize();
  coverCanvas.width = size[0];
  coverCanvas.height = size[1];
  const ctx = coverCanvas.getContext("2d");
  drawNeonCover(ctx, neonState, size[0], size[1]);
}

function neonSyncPanelControls() {
  const panel = neonState.panels[neonActivePanel];
  zoomSlider.value = String(panel.zoom);
  panXSlider.value = String(panel.panX);
  panYSlider.value = String(panel.panY);
  document.getElementById("zoomVal").textContent = panel.zoom.toFixed(2) + "×";
  document.getElementById("panXVal").textContent = String(panel.panX);
  document.getElementById("panYVal").textContent = String(panel.panY);
  document.querySelectorAll("#panelPicker .panel-chip").forEach(function (chip) {
    chip.classList.toggle("active", Number(chip.dataset.panel) === neonActivePanel);
  });
}

function neonBuildPanelPicker() {
  const picker = document.getElementById("panelPicker");
  picker.innerHTML = "";
  const count = neonPanelCount(neonState.layout);
  for (let i = 0; i < count; i++) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "panel-chip" + (i === neonActivePanel ? " active" : "");
    chip.dataset.panel = String(i);
    chip.textContent = "Panel " + (i + 1);
    chip.addEventListener("click", function () {
      neonActivePanel = i;
      neonSyncPanelControls();
    });
    picker.appendChild(chip);
  }
}

function neonLoadSampleIntoAll() {
  const scene = NEON_SAMPLE_SCENES[neonSceneIndex % NEON_SAMPLE_SCENES.length];
  const img = paintNeonSampleScene(scene, 900, 900);
  neonState.panels.forEach(function (panel) {
    panel.img = img;
    panel.zoom = 1;
    panel.panX = 0;
    panel.panY = 0;
  });
  neonSyncPanelControls();
  renderNeonCover();
}

// Cover shots show the grid at its best: a different scene in each panel,
// with a little zoom and pan variety so no two panels read the same.
function neonLoadSampleVaried() {
  neonState.panels.forEach(function (panel, i) {
    const scene = NEON_SAMPLE_SCENES[i % NEON_SAMPLE_SCENES.length];
    panel.img = paintNeonSampleScene(scene, 900, 900);
    panel.zoom = 1 + (i % 3) * 0.12;
    panel.panX = ((i * 37) % 41) - 20;
    panel.panY = ((i * 23) % 31) - 15;
  });
  neonSyncPanelControls();
  renderNeonCover();
}

function neonExportCover() {
  const dims = NEON_SIZES[neonState.size] || NEON_SIZES["1080x1350"];
  const out = document.createElement("canvas");
  out.width = dims[0];
  out.height = dims[1];
  drawNeonCover(out.getContext("2d"), neonState, dims[0], dims[1]);
  out.toBlob(function (blob) {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neon-grid-cover-" + neonState.size + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }, "image/png");
}

function neonBindControls() {
  document.getElementById("photoInput").addEventListener("change", function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        neonState.panels[neonActivePanel].img = img;
        renderNeonCover();
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  });

  document.getElementById("fillAllBtn").addEventListener("click", function () {
    const src = neonState.panels[neonActivePanel];
    neonState.panels.forEach(function (panel) {
      panel.img = src.img;
      panel.zoom = src.zoom;
      panel.panX = src.panX;
      panel.panY = src.panY;
    });
    renderNeonCover();
  });

  document.getElementById("sampleBtn").addEventListener("click", function () {
    neonSceneIndex = (neonSceneIndex + 1) % NEON_SAMPLE_SCENES.length;
    neonLoadSampleIntoAll();
  });

  document.getElementById("exportBtn").addEventListener("click", neonExportCover);

  zoomSlider.addEventListener("input", function () {
    neonState.panels[neonActivePanel].zoom = Number(zoomSlider.value);
    document.getElementById("zoomVal").textContent = Number(zoomSlider.value).toFixed(2) + "×";
    renderNeonCover();
  });
  panXSlider.addEventListener("input", function () {
    neonState.panels[neonActivePanel].panX = Number(panXSlider.value);
    document.getElementById("panXVal").textContent = panXSlider.value;
    renderNeonCover();
  });
  panYSlider.addEventListener("input", function () {
    neonState.panels[neonActivePanel].panY = Number(panYSlider.value);
    document.getElementById("panYVal").textContent = panYSlider.value;
    renderNeonCover();
  });

  document.querySelectorAll("#layoutRow .choice-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      neonState.layout = btn.dataset.layout;
      if (neonActivePanel >= neonPanelCount(neonState.layout)) neonActivePanel = 0;
      document.querySelectorAll("#layoutRow .choice-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      neonBuildPanelPicker();
      neonSyncPanelControls();
      renderNeonCover();
    });
  });

  document.querySelectorAll("#gradeRow .choice-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      neonState.grade = btn.dataset.grade;
      document.querySelectorAll("#gradeRow .choice-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      renderNeonCover();
    });
  });

  document.querySelectorAll(".size-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      neonState.size = btn.dataset.size;
      document.querySelectorAll(".size-btn").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      renderNeonCover();
    });
  });

  titleInput.addEventListener("input", function () {
    neonState.title = titleInput.value;
    renderNeonCover();
  });
  subtitleInput.addEventListener("input", function () {
    neonState.subtitle = subtitleInput.value;
    renderNeonCover();
  });
  badgeInput.addEventListener("input", function () {
    neonState.badge = badgeInput.value;
    renderNeonCover();
  });
  grainToggle.addEventListener("change", function () {
    neonState.grain = grainToggle.checked;
    renderNeonCover();
  });
}

// Screenshot modes. ?shot=cover draws one exported cover full-frame;
// ?shot=editor shows the editor with a sample photo loaded in every panel.
function neonApplyShotMode() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get("shot");
  if (!shot) return;
  if (shot === "cover") {
    document.body.classList.add("shot-cover");
    if (params.get("size") && NEON_SIZES[params.get("size")]) neonState.size = params.get("size");
    if (params.get("layout") && NEON_LAYOUTS.indexOf(params.get("layout")) >= 0) {
      neonState.layout = params.get("layout");
    }
    if (params.get("grade") && NEON_GRADES[params.get("grade")]) neonState.grade = params.get("grade");
    if (params.get("title")) { neonState.title = params.get("title"); }
    if (params.get("subtitle")) { neonState.subtitle = params.get("subtitle"); }
    if (params.get("scene")) {
      neonSceneIndex = NEON_SAMPLE_SCENES.indexOf(params.get("scene"));
      if (neonSceneIndex < 0) neonSceneIndex = 0;
    }
    neonLoadSampleVaried();
    const dims = NEON_SIZES[neonState.size];
    coverCanvas.width = dims[0];
    coverCanvas.height = dims[1];
    drawNeonCover(coverCanvas.getContext("2d"), neonState, dims[0], dims[1]);
    return;
  }
  if (shot === "editor") {
    if (params.get("layout") && NEON_LAYOUTS.indexOf(params.get("layout")) >= 0) {
      neonState.layout = params.get("layout");
      document.querySelectorAll("#layoutRow .choice-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.layout === neonState.layout);
      });
    }
    if (params.get("grade") && NEON_GRADES[params.get("grade")]) {
      neonState.grade = params.get("grade");
      document.querySelectorAll("#gradeRow .choice-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.grade === neonState.grade);
      });
    }
    if (params.get("scene")) {
      neonSceneIndex = NEON_SAMPLE_SCENES.indexOf(params.get("scene"));
      if (neonSceneIndex < 0) neonSceneIndex = 0;
    }
    neonBuildPanelPicker();
    neonLoadSampleIntoAll();
  }
}

neonBuildPanelPicker();
neonBindControls();
neonSyncPanelControls();
neonApplyShotMode();
if (!new URLSearchParams(window.location.search).get("shot")) {
  neonLoadSampleIntoAll();
}

window.NeonGrid = {
  state: neonState,
  render: renderNeonCover,
  exportCover: neonExportCover,
  drawCover: drawNeonCover,
};
