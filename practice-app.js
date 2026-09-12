/* English Flow practice. All learning and persistence run in the browser. */
(function () {
  "use strict";
  const C = window.FlowCore, DAYS = window.FLOW_DAYS;
  if (!C || !Array.isArray(DAYS) || !document.getElementById("practice")) return;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let storageOK = true, state, session = null, activeUnit = 0, returnFocus = null, soundContext, toastTimer;
  const dialog = $("#lesson-dialog"), exercise = $("#exercise"), next = $("#next-step");
  function storageFailure() { storageOK = false; $("#storage-warning").hidden = false; }
  function read(key) {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : null; }
    catch { storageFailure(); return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { storageFailure(); }
  }
  function clearDraft() {
    draft = null;
    try { localStorage.removeItem(C.DRAFT_KEY); } catch { storageFailure(); }
  }
  state = C.clean(read(C.KEY) || C.migrate(read("english_flow_30")));
  let draft = validateDraft(read(C.DRAFT_KEY));
  activeUnit = C.UNITS.findIndex(u => C.nextDay(state) <= u.end);
  function validateDraft(value) {
    if (!value || typeof value !== "object" || value.version !== 1 || !C.canOpen(state, value.day)) return null;
    if (!["intro", "quiz", "review", "speak"].includes(value.stage)) return null;
    if (!Number.isInteger(value.index) || value.index < 0 || value.index > 5) return null;
    if (!Array.isArray(value.answers) || value.answers.length > 6 || value.answers.some(v => v !== true && v !== false && v !== null)) return null;
    if (!Array.isArray(value.review) || value.review.length > 6 || value.review.some(v => !Number.isInteger(v) || v < 0 || v > 5) || new Set(value.review).size !== value.review.length) return null;
    if (!Number.isInteger(value.reviewIndex) || value.reviewIndex < 0 || value.reviewIndex > value.review.length) return null;
    if (value.stage === "review" && value.reviewIndex >= value.review.length) return null;
    if (["review", "speak"].includes(value.stage) && (value.answers.length !== 6 || value.answers.some(v => typeof v !== "boolean"))) return null;
    const q = DAYS[value.day - 1].quiz[value.stage === "review" ? value.review[value.reviewIndex] : value.index];
    const order = Array.isArray(value.order) && q.type === "order" ? value.order.filter(i => Number.isInteger(i) && i >= 0 && i < q.words.length) : [];
    const count = q.type === "mcq" ? q.options.length : 2;
    return { version: 1, day: value.day, stage: value.stage, index: value.index, answers: value.answers,
      review: value.review, reviewIndex: value.reviewIndex, revealed: value.revealed === true,
      spoken: value.spoken === true, selected: Number.isInteger(value.selected) && value.selected >= 0 && value.selected < count ? value.selected : null,
      order: [...new Set(order)], checked: value.checked === true, good: value.good === true };
  }
  function saveDraft() { if (session && session.stage !== "done") { draft = JSON.parse(JSON.stringify(session)); write(C.DRAFT_KEY, draft); } }
  function toast(message) { clearTimeout(toastTimer); $("#toast").textContent = message; $("#toast").hidden = false; toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 4200); }
  function syncState() { if (storageOK) { const saved = read(C.KEY); if (saved) state = C.clean(saved); } }
  function sound(kind) {
    if (!state.sound) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      soundContext = soundContext || new Audio();
      const play = () => {
        const notes = kind === "correct" ? [523.25, 659.25] : kind === "complete" ? [523.25, 659.25, 783.99] : [261.63];
        notes.forEach((frequency, index) => {
          const oscillator = soundContext.createOscillator(), gain = soundContext.createGain(), start = soundContext.currentTime + index * .1;
          oscillator.type = "sine"; oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.055, start + .015); gain.gain.exponentialRampToValueAtTime(.001, start + .19);
          oscillator.connect(gain); gain.connect(soundContext.destination); oscillator.start(start); oscillator.stop(start + .2);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        });
      };
      if (soundContext.state === "suspended") soundContext.resume().then(play).catch(() => {}); else play();
    } catch { /* Visual feedback is always available when audio is blocked. */ }
  }
  function stopSpeech() { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }
  function speak(text) {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) { toast("Pronunciation isn't supported here. Read the phrase aloud instead."); return; }
    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = "en-US"; utterance.rate = .88;
    utterance.onerror = e => { if (!["canceled", "interrupted"].includes(e.error)) toast("Audio isn't available. You can still read the phrase aloud."); };
    window.speechSynthesis.speak(utterance);
  }
  function renderDashboard() {
    const today = C.dateKey(), completed = Object.keys(state.completed).length, day = DAYS[(draft ? draft.day : C.nextDay(state)) - 1];
    $("#stat-xp").textContent = state.xp.toLocaleString(); $("#stat-gems").textContent = state.gems.toLocaleString(); $("#stat-streak").textContent = C.streak(state, today);
    $("#path-count").textContent = `${completed} of 30 complete`;
    $("#today-kicker").textContent = draft ? "PICK UP WHERE YOU LEFT OFF" : state.activity[today] ? "A LITTLE MORE MOMENTUM" : "YOUR DAILY MOMENT";
    $("#today-title").textContent = completed === 30 && !draft ? "Keep your English flowing." : day.day === 1 ? "Ready for your first hello?" : day.title + ".";
    $("#today-description").textContent = day.day === 1 ? "One small conversation. A whole new beginning." : day.speak;
    $("#today-theme").textContent = `Lesson ${day.day} · ${day.theme}`;
    $("#preview-phrase").textContent = day.phrase;
    $("#start-today").innerHTML = `${draft ? "Resume lesson" : completed === 30 ? "Review a lesson" : completed ? "Keep going" : "Let's begin"} <span aria-hidden="true">→</span>`;
    $("#resume-note").textContent = draft ? "Your place is saved. Let's pick it up." : "No pressure. No lost lives. Just learning.";
    const goal = state.activity[today] ? 1 : 0;
    $("#goal-count").textContent = `${goal} / 1 lesson`; $("#goal-bar").value = goal;
    $("#goal-copy").textContent = goal ? "Today's goal? Beautifully done." : "One lesson is all it takes.";
    $("#streak-note").textContent = goal ? "You showed up today. See you tomorrow?" : C.streak(state, today) ? "Finish a lesson to keep your streak going." : "Your next streak starts today.";
    const now = new Date(), monday = C.shiftDate(today, -((now.getDay() + 6) % 7));
    $("#week-dots").innerHTML = ["M", "T", "W", "T", "F", "S", "S"].map((label, i) => {
      const key = C.shiftDate(monday, i), done = Boolean(state.activity[key]);
      return `<div class="week-day ${key === today ? "today" : ""} ${done ? "done" : ""}" aria-label="${key}: ${done ? "practised" : "not practised"}${key === today ? ", today" : ""}"><small>${label}</small><span aria-hidden="true">${done ? "✓" : "·"}</span></div>`;
    }).join("");
    const level = Math.floor(state.xp / 300) + 1, labels = ["Curious beginner", "Finding your feet", "Conversation starter", "Growing confidence", "In your flow"];
    $("#level-copy").textContent = `Level ${level} · ${labels[Math.min(level - 1, 4)]}`;
    $("#level-bar").value = state.xp % 300; $("#level-note").textContent = `${300 - state.xp % 300} XP to your next level`;
    const badges = C.badges(state, today);
    $("#badge-count").textContent = `${badges.filter(b => b.earned).length} / 4`;
    $("#badge-list").innerHTML = badges.map(b => `<div class="badge ${b.earned ? "earned" : ""}" aria-label="${b.name}: ${b.earned ? "earned" : b.hint}"><span class="badge-medal" aria-hidden="true">${b.symbol}</span><strong>${b.name}</strong><small>${b.earned ? "Unlocked" : b.hint}</small></div>`).join("");
    $("#sound-toggle").textContent = state.sound ? "Sound on" : "Sound off";
    $("#sound-toggle").setAttribute("aria-pressed", String(state.sound));
    $("#sound-toggle").setAttribute("aria-label", `Sound feedback ${state.sound ? "on" : "off"}. Toggle sound`);
    renderPath();
  }
  function renderPath() {
    $("#unit-tabs").innerHTML = C.UNITS.map((u, i) => `<button type="button" data-unit="${i}" aria-pressed="${i === activeUnit}" aria-controls="day-path">Unit ${i + 1}</button>`).join("");
    const unit = C.UNITS[activeUnit];
    $("#unit-heading").innerHTML = `<div><h3>${unit.title}</h3><p>${unit.description}</p></div><span aria-hidden="true">✧</span>`;
    $("#day-path").innerHTML = DAYS.filter(d => d.day >= unit.start && d.day <= unit.end).map(day => {
      const done = state.completed[day.day], open = C.canOpen(state, day.day), current = open && !done;
      return `<div class="path-stop ${current ? "current" : ""} ${!open ? "locked" : ""}"><button type="button" class="day-node ${done ? "is-done" : current ? "is-now" : "is-locked"}" data-day="${day.day}" ${!open ? "disabled" : ""} aria-label="Lesson ${day.day}: ${esc(day.title)}. ${done ? "Completed. Review lesson" : current ? "Start lesson" : "Locked. Complete earlier lessons"}" ${current ? 'aria-current="step"' : ""}>${done ? "✓" : current ? "✦" : String(day.day).padStart(2, "0")}</button><div class="node-copy"><small>${current ? "YOU ARE HERE" : `LESSON ${String(day.day).padStart(2, "0")}`}</small><strong>${esc(day.title)}</strong><span>${done ? `Completed · ${done.score}/6 first-check best` : current ? "Your next little win" : "Complete the previous lessons"}</span></div></div>`;
    }).join("");
  }
  function fresh(day) { return { version: 1, day, stage: "intro", index: 0, answers: [], review: [], reviewIndex: 0, revealed: false, spoken: false, selected: null, order: [], checked: false, good: false }; }
  function openLesson(day) {
    syncState();
    if (!C.canOpen(state, day)) { toast("Finish the earlier lessons to unlock this one."); return; }
    if (draft && draft.day !== day && !window.confirm("Starting this lesson will replace your unfinished session. Your completed lessons and XP are safe. Continue?")) return;
    session = draft && draft.day === day ? validateDraft(draft) || fresh(day) : fresh(day);
    returnFocus = document.activeElement; dialog.showModal(); document.body.style.overflow = "hidden";
    saveDraft(); renderSession();
  }
  function closeLesson() {
    if (session && session.stage !== "done") saveDraft();
    stopSpeech(); dialog.close(); document.body.style.overflow = ""; session = null; renderDashboard();
    if (returnFocus && returnFocus.isConnected) returnFocus.focus(); else $("#start-today").focus();
  }
  function currentQuestion() { return DAYS[session.day - 1].quiz[session.stage === "review" ? session.review[session.reviewIndex] : session.index]; }
  function feedback(message, type = "", title = "") {
    $(".session-footer").className = "session-footer" + (type ? " " + type : "");
    $("#feedback").innerHTML = `${title ? `<span class="feedback-title">${esc(title)}</span>` : ""}${esc(message)}`;
  }
  function focusTitle() { $("#lesson-title").focus({ preventScroll: true }); dialog.scrollTop = 0; }
  function renderSession() {
    const day = DAYS[session.day - 1];
    $("#lesson-kicker").textContent = `LESSON ${String(day.day).padStart(2, "0")} · ${day.theme.toUpperCase()}`;
    $("#session-xp").textContent = `${session.answers.filter(v => v === true).length} / 6`;
    $("#session-bar").value = session.stage === "intro" ? 0 : session.stage === "quiz" ? 1 + session.index : session.stage === "done" ? 8 : 7;
    next.disabled = false; next.textContent = "Continue";
    feedback("Take your time. You're here to learn, not to be perfect.");
    if (session.stage === "intro") {
      $("#step-label").textContent = "01 · MEET YOUR PHRASE"; $("#lesson-title").textContent = day.title;
      exercise.innerHTML = `<p class="exercise-subtext">${esc(day.speak)} Think of what you would say, then reveal a natural phrase.</p><button type="button" class="reveal-card ${session.revealed ? "revealed" : ""}" id="reveal-phrase" aria-expanded="${session.revealed}" aria-controls="phrase-meaning"><small>${session.revealed ? "YOUR REAL-LIFE PHRASE" : "A SMALL PHRASE. A NEW POSSIBILITY."}</small><strong>${session.revealed ? esc(day.phrase) : "Tap to find your words"}</strong><small>${session.revealed ? "Say it once, just for yourself." : "Reveal phrase +"}</small></button><div id="phrase-meaning" ${session.revealed ? "" : "hidden"}><p class="meaning">${esc(day.meaning)}</p><button class="quiet-button" type="button" id="hear-phrase">Hear the phrase</button></div>`;
      next.disabled = !session.revealed; next.textContent = "Let's practise";
      if (session.revealed) feedback(day.tip);
    } else if (session.stage === "quiz" || session.stage === "review") {
      const q = currentQuestion(), review = session.stage === "review";
      $("#step-label").textContent = review ? `A SECOND CHANCE · ${session.reviewIndex + 1} OF ${session.review.length}` : `${String(session.index + 1).padStart(2, "0")} / 06 · ${q.type === "order" ? "BUILD A SENTENCE" : q.type === "natural" ? "TRUST YOUR EAR" : "CHOOSE YOUR WORDS"}`;
      $("#lesson-title").textContent = q.prompt;
      if (q.type === "order") {
        exercise.innerHTML = '<p class="exercise-subtext">Put the words in a natural order.</p><div id="build-line" class="build-line" data-zone="answer" role="group" aria-label="Your sentence"></div><div id="word-bank" class="word-bank" data-zone="bank" role="group" aria-label="Available words"></div><p class="tile-hint">Drag or tap words to build. Tap an answer word to remove it. Use Alt + arrow keys to reorder a focused answer word.</p><button type="button" class="quiet-button" id="clear-words">Start the sentence again</button>';
        renderWords(); next.disabled = session.order.length !== q.words.length;
      } else {
        const options = q.type === "mcq" ? q.options : [{ t: "Sounds natural", ok: q.ok }, { t: "Sounds off", ok: !q.ok }];
        exercise.innerHTML = `${q.type === "natural" ? `<div class="natural-quote">“${esc(q.sentence)}”</div>` : '<p class="exercise-subtext">Choose the answer you would use in this moment.</p>'}<div class="options" role="group" aria-label="Answer choices">${options.map((o, i) => `<button type="button" class="option" data-option="${i}" aria-pressed="${session.selected === i}"><b aria-hidden="true">${String.fromCharCode(65 + i)}</b><span>${esc(o.t)}</span></button>`).join("")}</div>`;
        next.disabled = session.selected === null;
      }
      next.textContent = "Check answer";
      if (review) feedback("Let's try that one again. Getting it wrong is part of getting better.");
      if (session.checked) showChecked(q);
    } else if (session.stage === "speak") {
      $("#step-label").textContent = "ONE LAST THING · MAKE IT YOURS"; $("#lesson-title").textContent = "Your voice. Your turn.";
      exercise.innerHTML = `<p class="exercise-subtext">Use the phrase in your own voice. No microphone, no recording, no score. Just a little real practice.</p><div class="speaking-prompt">${esc(day.speak)}</div><p class="summary-phrase">“${esc(day.phrase)}”</p><button type="button" class="quiet-button" id="hear-phrase">Hear it once more</button><label class="check-row"><input type="checkbox" id="spoken-check" ${session.spoken ? "checked" : ""} /><span>I tried the phrase out loud (or silently, if that's better for me).</span></label>`;
      next.disabled = !session.spoken; next.textContent = "Finish lesson";
      feedback("Your progress and rewards are saved when you finish.");
    } else if (session.stage === "done") {
      renderSummary();
    }
    focusTitle();
  }
  function renderWords() {
    const q = currentQuestion();
    const tile = (id, from) => `<button type="button" class="tile" data-word="${id}" data-from="${from}" aria-label="${esc(q.words[id])}. ${from === "answer" ? "Remove from sentence" : "Add to sentence"}" ${session.checked ? "disabled" : ""}>${esc(q.words[id])}</button>`;
    $("#build-line").innerHTML = session.order.map(i => tile(i, "answer")).join("");
    const ids = q.words.map((_, i) => i).filter(i => !session.order.includes(i));
    // Rotate rather than rendering the answer in order; duplicate words keep unique IDs.
    const split = Math.max(1, Math.floor(ids.length / 2));
    $("#word-bank").innerHTML = ids.slice(split).concat(ids.slice(0, split)).map(i => tile(i, "bank")).join("");
    $("#clear-words").disabled = session.checked;
  }
  function chooseOption(index) {
    if (!session || session.checked) return;
    session.selected = index;
    exercise.querySelectorAll("[data-option]").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.option) === index)));
    next.disabled = false; saveDraft();
  }
  function moveWord(id, zone, before = null) {
    if (!session || session.checked || !["quiz", "review"].includes(session.stage) || currentQuestion().type !== "order") return;
    if (before === id) return;
    session.order = session.order.filter(i => i !== id);
    if (zone === "answer") {
      const index = before === null ? -1 : session.order.indexOf(before);
      if (index === -1) session.order.push(id); else session.order.splice(index, 0, id);
    }
    renderWords(); next.disabled = session.order.length !== currentQuestion().words.length; saveDraft();
    const moved = exercise.querySelector(`[data-word="${id}"]`); if (moved) moved.focus({ preventScroll: true });
  }
  function answerText(q) {
    if (q.type === "order") return q.answer;
    if (q.type === "natural") return q.ok ? "Sounds natural" : "Sounds off";
    return q.options.find(o => o.ok).t;
  }
  function showChecked(q) {
    const good = session.good;
    next.disabled = false;
    next.textContent = session.stage === "review" && !good ? "Try again" : "Continue";
    exercise.querySelectorAll("button").forEach(b => { b.disabled = true; });
    exercise.querySelectorAll("[data-option]").forEach(b => {
      const i = Number(b.dataset.option), correct = q.type === "mcq" ? q.options[i].ok : i === 0 ? q.ok : !q.ok;
      if (correct) b.classList.add("good"); else if (session.selected === i) b.classList.add("bad");
    });
    feedback(`${good ? "" : `Answer: ${answerText(q)}. `}${q.why}`, good ? "correct" : "incorrect", good ? "Nice work. That's the one!" : "Not quite. Let's learn from it.");
  }
  function checkAnswer() {
    const q = currentQuestion();
    if (q.type === "order" && session.order.length !== q.words.length || q.type !== "order" && session.selected === null) return;
    const good = q.type === "order" ? C.norm(session.order.map(i => q.words[i]).join(" ")) === C.norm(q.answer) : q.type === "mcq" ? q.options[session.selected].ok : session.selected === 0 ? q.ok : !q.ok;
    session.checked = true; session.good = Boolean(good);
    if (session.stage === "quiz") {
      session.answers[session.index] = Boolean(good);
      if (!good && !session.review.includes(session.index)) session.review.push(session.index);
    }
    showChecked(q); saveDraft(); sound(good ? "correct" : "incorrect");
    $("#session-xp").textContent = `${session.answers.filter(v => v === true).length} / 6`;
  }
  function resetQuestion() { session.checked = false; session.good = false; session.selected = null; session.order = []; }
  let finishing = false;
  function completeLesson() {
    if (finishing || session.stage !== "speak" || !session.spoken) return;
    finishing = true;
    const apply = () => {
      if (!session || session.stage !== "speak") return;
      syncState();
      const beforeBadges = C.badges(state).filter(b => b.earned).map(b => b.name);
      const result = C.finish(state, session.day, session.answers.filter(v => v === true).length);
      if (!result.valid) { toast("Your progress changed. Please reopen this lesson from your path."); closeLesson(); return; }
      state = result.state; write(C.KEY, state); clearDraft();
      session.stage = "done"; session.result = result;
      session.newBadges = C.badges(state).filter(b => b.earned && !beforeBadges.includes(b.name)).map(b => b.name);
      activeUnit = C.UNITS.findIndex(u => C.nextDay(state) <= u.end);
      renderDashboard(); renderSession(); sound("complete");
    };
    // Serialize same-origin completions across tabs when the browser supports Web Locks.
    if (navigator.locks && storageOK) navigator.locks.request("english-flow-rewards", apply).catch(() => { toast("Please try finishing again."); }).finally(() => { finishing = false; });
    else { try { apply(); } finally { finishing = false; } }
  }
  function renderSummary() {
    const result = session.result, day = DAYS[session.day - 1], correct = session.answers.filter(v => v === true).length;
    $("#step-label").textContent = "A LITTLE MORE CONFIDENT";
    $("#lesson-title").textContent = correct === 6 ? "Look at you go." : "Progress looks good on you.";
    exercise.innerHTML = `<div class="summary"><div class="summary-medal" aria-hidden="true">✦</div><p class="summary-phrase">“${esc(day.phrase)}”</p><div class="summary-stats"><div><b>+${result.xp}</b><small>XP EARNED</small></div><div><b>${Math.round(correct / 6 * 100)}%</b><small>FIRST-TRY ACCURACY</small></div><div><b>+${result.gems}</b><small>GEMS COLLECTED</small></div></div><p class="summary-note">${session.newBadges.length ? `New reward: ${esc(session.newBadges.join(" · "))}. ` : ""}${result.first ? "Lesson complete. Your next step is unlocked." : result.xp ? "Review complete. Keeping your words fresh earns 15 XP." : "Review complete. You've already earned this lesson's rewards today."}</p></div>`;
    feedback(storageOK ? "Your progress is saved on this device. A little, every day." : "Progress is held in this tab only: browser storage is unavailable.", "correct", "You showed up. That matters.");
    next.textContent = "Back to my path"; next.disabled = false;
  }
  next.addEventListener("click", () => {
    if (!session || next.disabled || finishing) return;
    if (session.stage === "intro") { if (!session.revealed) return; session.stage = "quiz"; resetQuestion(); }
    else if (session.stage === "quiz" || session.stage === "review") {
      if (!session.checked) { checkAnswer(); return; }
      if (session.stage === "quiz") {
        if (session.index < 5) session.index++;
        else session.stage = session.review.length ? "review" : "speak";
      } else if (session.good) {
        session.reviewIndex++;
        if (session.reviewIndex >= session.review.length) session.stage = "speak";
      }
      resetQuestion();
    } else if (session.stage === "speak") { completeLesson(); return; }
    else { closeLesson(); return; }
    saveDraft(); renderSession();
  });
  let suppressClickUntil = 0;
  exercise.addEventListener("click", e => {
    const button = e.target.closest("button"); if (!button || !session || button.disabled) return;
    if (button.id === "reveal-phrase") { session.revealed = true; saveDraft(); renderSession(); }
    else if (button.id === "hear-phrase") speak(DAYS[session.day - 1].phrase);
    else if (button.id === "clear-words") { session.order = []; renderWords(); next.disabled = true; saveDraft(); }
    else if (button.hasAttribute("data-option")) chooseOption(Number(button.dataset.option));
    else if (button.hasAttribute("data-word") && Date.now() > suppressClickUntil) moveWord(Number(button.dataset.word), button.dataset.from === "answer" ? "bank" : "answer");
  });
  exercise.addEventListener("change", e => { if (e.target.id === "spoken-check" && session) { session.spoken = e.target.checked; next.disabled = !session.spoken; saveDraft(); } });
  exercise.addEventListener("keydown", e => {
    const button = e.target.closest("[data-word]");
    if (!button || !session || session.checked || !e.altKey || !["ArrowLeft", "ArrowRight"].includes(e.key) || button.dataset.from !== "answer") return;
    e.preventDefault(); const id = Number(button.dataset.word), at = session.order.indexOf(id), to = at + (e.key === "ArrowLeft" ? -1 : 1);
    if (to < 0 || to >= session.order.length) return;
    [session.order[at], session.order[to]] = [session.order[to], session.order[at]];
    renderWords(); saveDraft(); exercise.querySelector(`[data-word="${id}"]`).focus();
  });
  // Pointer Events provide actual drag-and-drop for mouse, touch and pen.
  let drag = null;
  exercise.addEventListener("pointerdown", e => {
    const tile = e.target.closest("[data-word]");
    if (!tile || tile.disabled || e.button !== 0 || !session || session.checked) return;
    drag = { id: Number(tile.dataset.word), tile, pointer: e.pointerId, x: e.clientX, y: e.clientY, moved: false, ghost: null };
    if (tile.setPointerCapture) tile.setPointerCapture(e.pointerId);
  });
  exercise.addEventListener("pointermove", e => {
    if (!drag || e.pointerId !== drag.pointer) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 7) {
      drag.moved = true; drag.ghost = document.createElement("span"); drag.ghost.className = "tile drag-ghost"; drag.ghost.textContent = drag.tile.textContent;
      drag.ghost.setAttribute("aria-hidden", "true"); dialog.appendChild(drag.ghost); drag.tile.classList.add("is-dragging");
    }
    if (!drag.moved) return;
    e.preventDefault(); drag.ghost.style.left = e.clientX + "px"; drag.ghost.style.top = e.clientY + "px";
    exercise.querySelectorAll("[data-zone]").forEach(z => z.classList.remove("drag-over"));
    const target = document.elementFromPoint(e.clientX, e.clientY), zone = target && target.closest("[data-zone]");
    if (zone) zone.classList.add("drag-over");
  });
  function endDrag(e, cancel) {
    if (!drag || e.pointerId !== drag.pointer) return;
    const old = drag; drag = null;
    if (old.ghost) old.ghost.remove(); old.tile.classList.remove("is-dragging");
    exercise.querySelectorAll("[data-zone]").forEach(z => z.classList.remove("drag-over"));
    if (!old.moved) return;
    suppressClickUntil = Date.now() + 400;
    if (cancel) return;
    const target = document.elementFromPoint(e.clientX, e.clientY), zone = target && target.closest("[data-zone]");
    if (zone) { const tile = target.closest("[data-word]"); moveWord(old.id, zone.dataset.zone, tile && zone.dataset.zone === "answer" ? Number(tile.dataset.word) : null); }
  }
  exercise.addEventListener("pointerup", e => endDrag(e, false));
  exercise.addEventListener("pointercancel", e => endDrag(e, true));
  $("#start-today").addEventListener("click", () => openLesson(draft ? draft.day : C.nextDay(state)));
  $("#close-lesson").addEventListener("click", closeLesson);
  dialog.addEventListener("cancel", e => { e.preventDefault(); closeLesson(); });
  $("#day-path").addEventListener("click", e => { const button = e.target.closest("[data-day]"); if (button && !button.disabled) openLesson(Number(button.dataset.day)); });
  $("#unit-tabs").addEventListener("click", e => { const button = e.target.closest("[data-unit]"); if (button) { activeUnit = Number(button.dataset.unit); renderPath(); $(`[data-unit="${activeUnit}"]`).focus(); } });
  $("#sound-toggle").addEventListener("click", () => { syncState(); state.sound = !state.sound; write(C.KEY, state); if (!state.sound) stopSpeech(); else sound("correct"); renderDashboard(); });
  window.addEventListener("storage", e => { if (e.key === C.KEY || e.key === null) { syncState(); if (!session) { draft = validateDraft(read(C.DRAFT_KEY)); renderDashboard(); } } });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !session) { syncState(); renderDashboard(); } });
  window.addEventListener("pagehide", saveDraft);
  $("#year").textContent = new Date().getFullYear();
  renderDashboard();
})();
