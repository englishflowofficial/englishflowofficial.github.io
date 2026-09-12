const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const context = { window: {} };
for (const file of ["days-data.js", "practice-core.js"]) vm.runInNewContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context);
const C = context.window.FlowCore, DAYS = context.window.FLOW_DAYS;
const json = value => JSON.parse(JSON.stringify(value));

test("30 original lessons have valid, solvable exercises", () => {
  assert.equal(DAYS.length, 30);
  DAYS.forEach((day, i) => {
    assert.equal(day.day, i + 1); assert.equal(day.quiz.length, 6);
    for (const key of ["title", "theme", "phrase", "meaning", "tip", "speak"]) assert.ok(day[key], `lesson ${day.day} ${key}`);
    day.quiz.forEach(q => {
      assert.ok(q.prompt); assert.ok(q.why);
      if (q.type === "mcq") assert.equal(q.options.filter(o => o.ok).length, 1);
      else if (q.type === "order") assert.equal(C.norm(q.words.join(" ")), C.norm(q.answer), `lesson ${day.day} order`);
      else { assert.equal(q.type, "natural"); assert.equal(typeof q.ok, "boolean"); }
    });
  });
});
test("malformed saved progress is sanitised", () => {
  for (const input of [null, 7, "bad", [], {}]) assert.equal(C.clean(input).xp, 0);
  const s = C.clean({ xp: -12, gems: Infinity, completed: { "0": {}, "31": {}, "2": { score: 900 }, "no": {} }, activity: { "2026-02-31": 1, "2026-09-11": 1 }, reviews: { "-1": "2026-09-11" } });
  assert.equal(s.xp, 0); assert.equal(s.gems, 0); assert.deepEqual(Object.keys(s.completed), ["2"]);
  assert.equal(s.completed[2].score, 6); assert.deepEqual(Object.keys(s.activity), ["2026-09-11"]);
});
test("legacy scores and genuine dates migrate without inventing streaks", () => {
  const s = C.migrate({ xp: 150, streak: 999, completed: { 1: { score: 4, date: "Thu Sep 10 2026" }, 3: { score: 6, date: "Fri Sep 11 2026" } } });
  assert.equal(s.xp, 150); assert.equal(s.completed[1].score, 4); assert.equal(C.streak(s, "2026-09-11"), 2);
  assert.equal(C.nextDay(s), 2); assert.equal(C.canOpen(s, 3), true); assert.equal(C.canOpen(s, 4), false);
});
test("local calendar streaks handle gaps, leap years and year boundaries", () => {
  const s = C.blank(); s.activity = { "2025-12-31": 1, "2026-01-01": 8, "2026-01-02": 1 };
  assert.equal(C.streak(s, "2026-01-02"), 3); assert.equal(C.streak(s, "2026-01-03"), 3); assert.equal(C.streak(s, "2026-01-04"), 0);
  assert.equal(C.shiftDate("2024-03-01", -1), "2024-02-29"); assert.equal(C.shiftDate("2026-01-01", -1), "2025-12-31");
  assert.equal(C.shiftDate("2026-03-08", 1), "2026-03-09"); assert.equal(C.shiftDate("2026-11-01", 1), "2026-11-02");
});
test("perfect lesson awards 110 XP and 20 gems, with no same-day replay farming", () => {
  let r = C.finish(C.blank(), 1, 6, "2026-09-11"); assert.equal(r.xp, 110); assert.equal(r.gems, 20);
  r = C.finish(r.state, 1, 6, "2026-09-11"); assert.equal(r.xp, 0); assert.equal(r.gems, 0); assert.equal(r.state.xp, 110);
  r = C.finish(r.state, 1, 4, "2026-09-12"); assert.equal(r.xp, 15); assert.equal(r.state.completed[1].score, 6); assert.equal(C.streak(r.state, "2026-09-12"), 2);
  r = C.finish(r.state, 1, 6, "2026-09-12"); assert.equal(r.xp, 0);
});
test("imperfect lesson completion rewards effort and unlocks only the next lesson", () => {
  const r = C.finish(C.blank(), 1, 3, "2026-09-11"); assert.equal(r.xp, 60); assert.equal(r.gems, 15);
  assert.equal(C.canOpen(r.state, 2), true); assert.equal(C.canOpen(r.state, 3), false);
  for (const day of [0, 31, -1, 2.5, "2"]) assert.equal(C.finish(r.state, day, 6).valid, false);
  assert.equal(C.finish(C.blank(), 2, 6).valid, false);
});
test("all 30 lessons and persistent badges work", () => {
  let s = C.blank(); for (let n = 1; n <= 30; n++) s = C.finish(s, n, 6, C.shiftDate("2026-08-01", n - 1)).state;
  assert.equal(Object.keys(s.completed).length, 30); assert.equal(s.xp, 3300); assert.equal(s.gems, 600);
  assert.equal(C.nextDay(s), 30); assert.equal(C.streak(s, "2026-10-01"), 0);
  assert.equal(C.badges(s, "2026-10-01").filter(b => b.earned).length, 4);
});
test("normalisation handles apostrophes and duplicate words", () => {
  assert.equal(C.norm("I’m ready!"), C.norm("I'm ready."));
  assert.notEqual(C.norm("I see what you mean"), C.norm("I see you mean"));
});
