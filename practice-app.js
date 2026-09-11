/* English Flow — 30-day practice engine */
(function () {
  const KEY = "english_flow_30";
  const XP_PER_Q = 10;
  const XP_BONUS = 30;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
      return {};
    }
  }
  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function todayStr() {
    return new Date().toDateString();
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[“”"]/g, ""));
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }

  function confetti() {
    const layer = document.createElement("div");
    layer.className = "burst";
    const colors = ["#087e83", "#ff725e", "#ffc83d", "#e6defe", "#fff"];
    for (let i = 0; i < 42; i++) {
      const d = document.createElement("i");
      d.style.left = Math.random() * 100 + "%";
      d.style.background = colors[i % colors.length];
      d.style.animationDelay = Math.random() * 0.25 + "s";
      d.style.animationDuration = 0.9 + Math.random() * 0.5 + "s";
      layer.appendChild(d);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 1600);
  }

  const state = Object.assign(
    { xp: 0, streak: 0, last: "", completed: {}, unlocked: 1 },
    load()
  );

  function refreshStreak() {
    if (state.last && state.last !== todayStr()) {
      const last = new Date(state.last);
      const now = new Date();
      const diff = (now - last) / 86400000;
      if (diff > 1.8) {
        /* streak kept unless long gap — still show current */
      }
    }
  }
  refreshStreak();

  function unlockedUntil() {
    const done = Object.keys(state.completed).map(Number);
    const maxDone = done.length ? Math.max(...done) : 0;
    return Math.min(30, Math.max(state.unlocked || 1, maxDone + 1));
  }

  function renderStats() {
    const n = Object.keys(state.completed).length;
    const xpEl = $("#stat-xp");
    const stEl = $("#stat-streak");
    const dEl = $("#stat-days");
    if (xpEl) xpEl.textContent = state.xp;
    if (stEl) stEl.textContent = state.streak;
    if (dEl) dEl.textContent = n + "/30";
    const bar = $("#xp-bar");
    if (bar) bar.style.width = Math.min(100, (n / 30) * 100) + "%";
  }

  function renderPath() {
    const root = $("#day-path");
    if (!root || !window.FLOW_DAYS) return;
    root.innerHTML = "";
    const cap = unlockedUntil();
    const weeks = [
      [1, "WEEK 1 · START SPEAKING"],
      [8, "WEEK 2 · DAILY LIFE"],
      [15, "WEEK 3 · REAL CONVERSATIONS"],
      [22, "WEEK 4 · KEEP THE FLOW"],
    ];
    window.FLOW_DAYS.forEach((day) => {
      const w = weeks.find((x) => x[0] === day.day);
      if (w) {
        const tag = document.createElement("p");
        tag.className = "week-tag";
        tag.textContent = w[1];
        root.appendChild(tag);
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-node";
      const done = Boolean(state.completed[day.day]);
      const locked = false;
      const isNow = day.day === cap && !done;
      if (done) btn.classList.add("is-done");
      if (isNow) btn.classList.add("is-now");
      if (locked) btn.classList.add("is-locked");
      btn.innerHTML = `<span class="node-ring">${done ? "✓" : String(day.day).padStart(2, "0")}</span><span class="node-label">${day.title}</span>`;
      if (!locked) {
        btn.addEventListener("click", () => openDay(day.day));
      }
      root.appendChild(btn);
    });
  }

  let currentDay = null;
  let qIndex = 0;
  let score = 0;
  let lockedAns = false;

  function openDay(n) {
    currentDay = window.FLOW_DAYS.find((d) => d.day === n);
    if (!currentDay) return;
    qIndex = 0;
    score = 0;
    lockedAns = false;
    $("#lesson-layer").classList.add("is-open");
    $("#lesson-kicker").textContent = `DAY ${String(n).padStart(2, "0")} · ${currentDay.theme.toUpperCase()}`;
    $("#lesson-title").textContent = currentDay.title;
    $("#lesson-phrase").textContent = currentDay.phrase;
    $("#lesson-meaning").textContent = currentDay.meaning;
    $("#lesson-tip").textContent = "Tip: " + currentDay.tip;
    $("#speak-prompt").textContent = currentDay.speak;
    $("#quiz-stage").hidden = false;
    $("#celebrate-stage").hidden = true;
    renderQuestion();
  }

  function closeDay() {
    $("#lesson-layer").classList.remove("is-open");
  }

  function letters() {
    return "ABCDEFGH";
  }

  function renderQuestion() {
    const box = $("#quiz-stage");
    const q = currentDay.quiz[qIndex];
    const total = currentDay.quiz.length;
    $("#q-count").textContent = `${String(qIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    $("#q-bar").style.width = ((qIndex + 1) / total) * 100 + "%";
    $("#q-feed").className = "q-feed";
    $("#q-feed").textContent = "Take your time. Say it in your head first.";
    const next = $("#q-next");
    next.disabled = true;
    next.textContent = "Check";
    lockedAns = false;

    const body = $("#q-body");
    body.innerHTML = `<p class="q-prompt">${q.prompt}</p>`;

    if (q.type === "mcq") {
      q.options.forEach((opt, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.dataset.ok = opt.ok ? "1" : "0";
        b.innerHTML = `<b>${letters()[i]}</b> ${opt.t}`;
        b.addEventListener("click", () => pick(b));
        body.appendChild(b);
      });
    } else if (q.type === "natural") {
      const card = document.createElement("div");
      card.className = "nat-card";
      card.textContent = "“" + q.sentence + "”";
      body.appendChild(card);
      const row = document.createElement("div");
      row.className = "nat-actions";
      [
        ["Sounds natural", q.ok],
        ["Sounds off", !q.ok],
      ].forEach(([label, ok]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.dataset.ok = ok ? "1" : "0";
        b.innerHTML = `<b>•</b> ${label}`;
        b.addEventListener("click", () => pick(b));
        row.appendChild(b);
      });
      body.appendChild(row);
    } else if (q.type === "order") {
      const line = document.createElement("div");
      line.className = "build-line";
      line.id = "build-line";
      line.textContent = "";
      body.appendChild(line);
      const tiles = document.createElement("div");
      tiles.className = "tiles";
      const shuffled = q.words
        .map((w, i) => ({ w, i, r: Math.random() }))
        .sort((a, b) => a.r - b.r);
      shuffled.forEach((item) => {
        const t = document.createElement("button");
        t.type = "button";
        t.className = "tile";
        t.textContent = item.w;
        t.addEventListener("click", () => {
          if (lockedAns || t.classList.contains("is-used")) return;
          t.classList.add("is-used");
          const cur = line.textContent ? line.textContent + " " : "";
          line.textContent = (cur + item.w).replace(/\s+/g, " ").trim();
          next.disabled = false;
          $("#q-feed").textContent = "Tap Check when the sentence feels right.";
        });
        tiles.appendChild(t);
      });
      body.appendChild(tiles);
      const undo = document.createElement("button");
      undo.type = "button";
      undo.className = "opt";
      undo.textContent = "Clear tiles";
      undo.addEventListener("click", () => {
        if (lockedAns) return;
        line.textContent = "";
        $$(".tile", body).forEach((x) => x.classList.remove("is-used"));
        next.disabled = true;
      });
      body.appendChild(undo);
    }
  }

  function pick(btn) {
    if (lockedAns) return;
    $$(".opt", $("#q-body")).forEach((b) => b.classList.remove("is-pick"));
    btn.classList.add("is-pick");
    $("#q-next").disabled = false;
    $("#q-feed").textContent = "Ready to check?";
  }

  function norm(s) {
    return s
      .toLowerCase()
      .replace(/[^\w\s']/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function check() {
    const q = currentDay.quiz[qIndex];
    const next = $("#q-next");
    if (!lockedAns) {
      lockedAns = true;
      let good = false;
      if (q.type === "order") {
        const built = $("#build-line").textContent;
        good = norm(built) === norm(q.answer);
        $("#build-line").style.background = good ? "#e8f7e9" : "#fff0eb";
      } else {
        const chosen = $(".opt.is-pick", $("#q-body"));
        if (!chosen) {
          lockedAns = false;
          return;
        }
        good = chosen.dataset.ok === "1";
        chosen.classList.add(good ? "is-good" : "is-bad");
        $$(".opt", $("#q-body")).forEach((b) => {
          if (b.dataset.ok === "1") b.classList.add("is-good");
        });
      }
      if (good) {
        score += 1;
        state.xp += XP_PER_Q;
        $("#q-feed").className = "q-feed ok";
        $("#q-feed").textContent = "✦ Nice. " + q.why;
      } else {
        $("#q-feed").className = "q-feed no";
        $("#q-feed").textContent = "Notice the difference: " + q.why;
      }
      next.textContent = qIndex < currentDay.quiz.length - 1 ? "Next" : "Finish day";
      save(state);
      renderStats();
    } else {
      if (qIndex < currentDay.quiz.length - 1) {
        qIndex += 1;
        renderQuestion();
      } else {
        finishDay();
      }
    }
  }

  function finishDay() {
    const total = currentDay.quiz.length;
    const firstTime = !state.completed[currentDay.day];
    state.completed[currentDay.day] = { score, total, date: todayStr() };
    if (firstTime) {
      state.xp += XP_BONUS;
      if (state.last !== todayStr()) {
        state.streak = (state.streak || 0) + 1;
        state.last = todayStr();
      }
      state.unlocked = Math.min(30, Math.max(unlockedUntil(), currentDay.day + 1));
    }
    save(state);
    renderStats();
    renderPath();
    $("#quiz-stage").hidden = true;
    $("#celebrate-stage").hidden = false;
    $("#cele-title").textContent = firstTime ? "Day complete." : "Practised again.";
    $("#cele-copy").textContent = `You got ${score} of ${total} right. Phrase to keep: “${currentDay.phrase}”`;
    $("#cele-xp").textContent = firstTime ? `+${score * XP_PER_Q + XP_BONUS} XP` : `+${score * XP_PER_Q} XP`;
    confetti();
    speak(currentDay.phrase);
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderStats();
    renderPath();

    $("#q-next")?.addEventListener("click", check);
    $("#close-lesson")?.addEventListener("click", closeDay);
    $("#lesson-layer")?.addEventListener("click", (e) => {
      if (e.target.id === "lesson-layer") closeDay();
    });
    $("#btn-listen")?.addEventListener("click", () => {
      if (currentDay) speak(currentDay.phrase);
    });
    $("#btn-print-day")?.addEventListener("click", () => {
      if (!currentDay) return;
      window.open("worksheets.html#day-" + currentDay.day, "_blank");
    });
    $("#btn-continue")?.addEventListener("click", closeDay);
    $("#start-today")?.addEventListener("click", () => {
      openDay(unlockedUntil());
    });

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
