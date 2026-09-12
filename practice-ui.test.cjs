/* DOM integration tests. Run with jsdom installed in the test environment. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const source = file => fs.readFileSync(path.join(__dirname, file), "utf8");
function setup(saved = {}, blocked = false) {
  const dom = new JSDOM(source("practice.html"), { url: "https://englishflowofficial.github.io/practice.html", runScripts: "outside-only", pretendToBeVisual: true });
  const w = dom.window;
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  w.confirm = () => true;
  for (const [key, value] of Object.entries(saved)) w.localStorage.setItem(key, JSON.stringify(value));
  if (blocked) Object.defineProperty(w, "localStorage", { get() { throw new Error("Storage blocked"); } });
  for (const file of ["days-data.js", "practice-core.js", "practice-app.js"]) w.eval(source(file));
  const $ = s => w.document.querySelector(s);
  const click = s => { const el = $(s); assert.ok(el, `missing ${s}`); assert.equal(el.disabled, false, `disabled ${s}`); el.click(); };
  return { dom, w, $, click, close: () => w.close() };
}
function solve(t, day, index, wrong = false) {
  const q = t.w.FLOW_DAYS[day - 1].quiz[index];
  if (q.type === "order") {
    const ids = q.words.map((_, i) => i); if (wrong) ids.reverse();
    ids.forEach(i => t.click(`#word-bank [data-word="${i}"]`));
  } else {
    const correct = q.type === "mcq" ? q.options.findIndex(o => o.ok) : q.ok ? 0 : 1;
    t.click(`[data-option="${wrong ? (correct + 1) % (q.options?.length || 2) : correct}"]`);
  }
  t.click("#next-step");
}
function finishSpeaking(t) {
  const input = t.$("#spoken-check"); assert.ok(input); input.checked = true; input.dispatchEvent(new t.w.Event("change", { bubbles: true })); t.click("#next-step");
}
test("dashboard renders 30 lesson path in four units, preserving locked lessons", () => {
  const t = setup();
  try {
    assert.equal(t.$("#day-path").children.length, 7);
    assert.equal(t.$('[data-day="1"]').disabled, false); assert.equal(t.$('[data-day="2"]').disabled, true);
    t.click('[data-unit="3"]'); assert.equal(t.$("#day-path").children.length, 9); assert.ok(t.$('[data-day="30"]'));
    assert.equal(t.$("#stat-xp").textContent, "0");
  } finally { t.close(); }
});
test("tap reveal, multiple choice, word tiles, natural checks and completion award real rewards", () => {
  const t = setup();
  try {
    t.click("#start-today"); assert.equal(t.$("#lesson-dialog").open, true); assert.equal(t.$("#next-step").disabled, true);
    t.click("#reveal-phrase"); assert.match(t.$("#reveal-phrase").textContent, /how's it going/); t.click("#next-step");
    for (let i = 0; i < 6; i++) { assert.equal(t.$("#next-step").disabled, true); solve(t, 1, i); assert.match(t.$("#feedback").textContent, /Nice work/); t.click("#next-step"); }
    finishSpeaking(t);
    assert.match(t.$("#exercise").textContent, /110/); assert.match(t.$("#exercise").textContent, /100%/);
    assert.equal(t.$("#stat-xp").textContent, "110"); assert.equal(t.$("#stat-gems").textContent, "20");
    assert.equal(t.$('[data-day="2"]').disabled, false); assert.equal(t.w.localStorage.getItem(t.w.FlowCore.DRAFT_KEY), null);
    t.click("#next-step"); assert.equal(t.$("#lesson-dialog").open, false);
  } finally { t.close(); }
});
test("incorrect answers are revisited before completion and cannot earn first-try bonus", () => {
  const t = setup();
  try {
    t.click("#start-today"); t.click("#reveal-phrase"); t.click("#next-step");
    for (let i = 0; i < 6; i++) { solve(t, 1, i, i === 0); t.click("#next-step"); }
    assert.match(t.$("#step-label").textContent, /SECOND CHANCE/);
    solve(t, 1, 0, true); assert.equal(t.$("#next-step").textContent, "Try again"); t.click("#next-step");
    solve(t, 1, 0); t.click("#next-step"); finishSpeaking(t);
    assert.equal(t.$("#stat-xp").textContent, "80"); assert.equal(t.$("#stat-gems").textContent, "15");
  } finally { t.close(); }
});
test("unfinished checked question resumes across reload without duplicate scoring", () => {
  const t = setup(); let saved;
  try { t.click("#start-today"); t.click("#reveal-phrase"); t.click("#next-step"); solve(t, 1, 0); t.click("#close-lesson"); saved = JSON.parse(t.w.localStorage.getItem(t.w.FlowCore.DRAFT_KEY)); assert.equal(saved.answers[0], true); }
  finally { t.close(); }
  const r = setup({ english_flow_practice_draft_v2: saved });
  try { assert.match(r.$("#start-today").textContent, /Resume/); r.click("#start-today"); assert.equal(r.$("#next-step").textContent, "Continue"); assert.match(r.$("#feedback").textContent, /Nice work/); r.click("#next-step"); assert.match(r.$("#step-label").textContent, /02 \/ 06/); }
  finally { r.close(); }
});
test("word tiles support undo, keyboard reorder and actual pointer drops", () => {
  const t = setup();
  try {
    t.click("#start-today"); t.click("#reveal-phrase"); t.click("#next-step");
    for (let i = 0; i < 2; i++) { solve(t, 1, i); t.click("#next-step"); }
    t.click('#word-bank [data-word="0"]'); t.click('#word-bank [data-word="1"]');
    t.$('#build-line [data-word="1"]').dispatchEvent(new t.w.KeyboardEvent("keydown", { key: "ArrowLeft", altKey: true, bubbles: true }));
    assert.equal(t.$("#build-line").firstChild.dataset.word, "1");
    t.click('#build-line [data-word="1"]'); assert.equal(t.$("#build-line").children.length, 1);
    t.click("#clear-words"); assert.equal(t.$("#build-line").children.length, 0);
    const tile = t.$('#word-bank [data-word="0"]'), zone = t.$("#build-line");
    t.w.document.elementFromPoint = () => zone;
    const pointer = (type, x, y) => { const e = new t.w.Event(type, { bubbles: true, cancelable: true }); for (const [k, v] of Object.entries({ clientX: x, clientY: y, pointerId: 1, button: 0 })) Object.defineProperty(e, k, { value: v }); tile.dispatchEvent(e); };
    pointer("pointerdown", 10, 10); pointer("pointermove", 100, 50); pointer("pointerup", 100, 50);
    assert.equal(t.$("#build-line").children.length, 1); assert.equal(t.$("#build-line").firstChild.dataset.word, "0"); assert.equal(t.$(".drag-ghost"), null);
  } finally { t.close(); }
});
test("storage denial does not prevent learning or falsely promise persisted rewards", () => {
  const t = setup({}, true);
  try {
    assert.equal(t.$("#storage-warning").hidden, false); t.click("#start-today"); t.click("#reveal-phrase"); t.click("#next-step");
    for (let i = 0; i < 6; i++) { solve(t, 1, i); t.click("#next-step"); } finishSpeaking(t);
    assert.equal(t.$("#stat-xp").textContent, "110"); assert.match(t.$("#feedback").textContent, /tab only/);
  } finally { t.close(); }
});
test("legacy user progress migrates and sound preference persists", () => {
  const t = setup({ english_flow_30: { xp: 90, completed: { 1: { score: 6, date: "Fri Sep 11 2026" } } } });
  try {
    assert.equal(t.$("#stat-xp").textContent, "90"); assert.equal(t.$('[data-day="2"]').disabled, false);
    t.click("#sound-toggle"); assert.equal(t.$("#sound-toggle").getAttribute("aria-pressed"), "false");
    assert.equal(JSON.parse(t.w.localStorage.getItem(t.w.FlowCore.KEY)).sound, false);
  } finally { t.close(); }
});
test("all 30 lessons run from reveal through every exercise and unlock the full path", () => {
  const t = setup();
  try {
    for (let day = 1; day <= 30; day++) {
      t.click("#start-today"); t.click("#reveal-phrase"); t.click("#next-step");
      for (let i = 0; i < 6; i++) { solve(t, day, i); assert.match(t.$("#feedback").textContent, /Nice work/); t.click("#next-step"); }
      finishSpeaking(t); t.click("#next-step");
    }
    const state = JSON.parse(t.w.localStorage.getItem(t.w.FlowCore.KEY));
    assert.equal(state.xp, 3300); assert.equal(state.gems, 600);
    assert.equal(Object.keys(state.completed).length, 30); assert.equal(t.$("#path-count").textContent, "30 of 30 complete");
    assert.match(t.$("#start-today").textContent, /Review/);
  } finally { t.close(); }
});
test("malformed draft is discarded and native dialog cancel saves progress", () => {
  const t = setup({ english_flow_practice_draft_v2: { day: 99, version: 1 } });
  try { assert.doesNotMatch(t.$("#start-today").textContent, /Resume/); t.click("#start-today"); t.$("#lesson-dialog").dispatchEvent(new t.w.Event("cancel", { cancelable: true })); assert.equal(t.$("#lesson-dialog").open, false); assert.match(t.$("#start-today").textContent, /Resume/); }
  finally { t.close(); }
});
