/* Pure progress rules; no DOM, network, clock timers or build step required. */
(function (root) {
  "use strict";
  const KEY = "english_flow_practice_v2";
  const DRAFT_KEY = "english_flow_practice_draft_v2";
  const UNITS = [
    { start: 1, end: 7, title: "Small words. New beginnings.", description: "Say hello, find your words, and start speaking." },
    { start: 8, end: 14, title: "English for your everyday.", description: "Shops, work, and all the little moments in between." },
    { start: 15, end: 21, title: "Make a real connection.", description: "Share a plan, tell a story, and keep a conversation going." },
    { start: 22, end: 30, title: "Find your own flow.", description: "More natural replies. More confidence in your voice." }
  ];
  const number = (n, max = 100000000) => typeof n === "number" && Number.isFinite(n) ? Math.max(0, Math.min(max, Math.floor(n))) : 0;
  const object = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};
  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function validDate(s) {
    if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d = new Date(`${s}T12:00:00`);
    return Number.isFinite(d.getTime()) && dateKey(d) === s;
  }
  function shiftDate(key, delta) {
    const d = new Date(`${key}T12:00:00`);
    d.setDate(d.getDate() + delta);
    return dateKey(d);
  }
  function blank() { return { version: 2, xp: 0, gems: 0, completed: {}, activity: {}, reviews: {}, sound: true }; }
  function clean(raw) {
    const value = object(raw), state = blank();
    state.xp = number(value.xp); state.gems = number(value.gems);
    state.sound = value.sound !== false;
    for (const [id, item] of Object.entries(object(value.completed))) {
      const n = Number(id), r = object(item);
      if (!Number.isInteger(n) || n < 1 || n > 30 || !Object.keys(r).length) continue;
      state.completed[n] = { score: number(r.score, 6), total: 6, date: validDate(r.date) ? r.date : "" };
    }
    for (const [key, count] of Object.entries(object(value.activity))) {
      if (validDate(key) && number(count) > 0) state.activity[key] = number(count, 1000);
    }
    for (const [key, when] of Object.entries(object(value.reviews))) {
      if (/^(?:[1-9]|[12]\d|30)$/.test(key) && validDate(when)) state.reviews[key] = when;
    }
    return state;
  }
  function migrate(raw) {
    const old = object(raw), converted = { ...old, completed: {}, activity: {} };
    for (const [id, item] of Object.entries(object(old.completed))) {
      const record = object(item), date = new Date(record.date);
      const key = Number.isFinite(date.getTime()) ? dateKey(date) : "";
      converted.completed[id] = { ...record, date: key };
      if (validDate(key)) converted.activity[key] = (converted.activity[key] || 0) + 1;
    }
    return clean(converted);
  }
  function streak(state, today = dateKey()) {
    let day = state.activity[today] ? today : shiftDate(today, -1), count = 0;
    while (state.activity[day] && count < 10000) { count++; day = shiftDate(day, -1); }
    return count;
  }
  function nextDay(state) {
    for (let n = 1; n <= 30; n++) if (!state.completed[n]) return n;
    return 30;
  }
  function canOpen(state, day) { return Number.isInteger(day) && day >= 1 && day <= 30 && (Boolean(state.completed[day]) || day === nextDay(state)); }
  function norm(s) { return String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[^\w\s']/g, "").replace(/\s+/g, " ").trim(); }
  function badges(state, today = dateKey()) {
    const count = Object.keys(state.completed).length;
    return [
      { name: "First words", hint: "Finish 1 lesson", symbol: "✦", earned: count >= 1 },
      { name: "In the rhythm", hint: "3-day streak", symbol: "ϟ", earned: bestStreak(state) >= 3 },
      { name: "A little braver", hint: "Finish 7 lessons", symbol: "◇", earned: count >= 7 },
      { name: "Flow finder", hint: "Finish all 30", symbol: "✧", earned: count >= 30 }
    ];
  }
  function bestStreak(state) {
    let best = 0, run = 0, last = "";
    Object.keys(state.activity).sort().forEach(key => { run = last && shiftDate(last, 1) === key ? run + 1 : 1; best = Math.max(best, run); last = key; });
    return best;
  }
  function finish(raw, day, score, today = dateKey()) {
    const state = clean(raw);
    if (!canOpen(state, day) || !validDate(today)) return { state, xp: 0, gems: 0, first: false, valid: false };
    score = number(score, 6);
    const first = !state.completed[day];
    const replayReward = !first && state.reviews[day] !== today && state.completed[day].date !== today;
    const xp = first ? 30 + score * 10 + (score === 6 ? 20 : 0) : replayReward ? 15 : 0;
    const gems = first ? 15 + (score === 6 ? 5 : 0) : 0;
    state.xp += xp; state.gems += gems;
    if (first) state.completed[day] = { score, total: 6, date: today };
    else state.completed[day].score = Math.max(state.completed[day].score, score);
    state.reviews[day] = today;
    state.activity[today] = (state.activity[today] || 0) + 1;
    return { state, xp, gems, first, valid: true };
  }
  root.FlowCore = { KEY, DRAFT_KEY, UNITS, blank, clean, migrate, dateKey, validDate, shiftDate, streak, bestStreak, nextDay, canOpen, norm, badges, finish };
})(typeof window !== "undefined" ? window : globalThis);
