/* English Flow — Duolingo-style Practice Session for English learners.
   Pure browser: progress in localStorage, speech via Web Speech APIs. */
(function () {
  "use strict";

  /* ================= Question bank =================
     Types: mcq | say (don't say this, say this) | build | listen | type | fill | match | speak */
  const UNITS = [
    {
      id: "greetings", title: "Greetings & Small Talk", sub: "Say hello and keep a chat going", color: "#58cc02", icon: "👋",
      items: [
        { type: "mcq", prompt: "Someone asks: “How's it going?” — what is the most natural reply?", options: ["Pretty good, thanks! How about you?", "I am fine, thank you, and you?", "Yes, I am going.", "Good night."], answer: 0, why: "“Pretty good, thanks!” is how native speakers actually reply — short, warm and natural." },
        { type: "build", prompt: "Build the sentence", words: ["to", "Nice", "you", "meet"], answer: "Nice to meet you", why: "“Nice to meet you” — the classic first-meeting phrase." },
        { type: "listen", text: "Hey, how's it going?", prompt: "What did you hear?", options: ["Hey, how's it going?", "Hey, how is he going?", "Hey, where is it going?"], answer: 0, why: "You heard: “Hey, how's it going?” — a friendly way to say hello." },
        { type: "type", text: "See you later", prompt: "Listen and type what you hear", why: "“See you later” — a natural way to say goodbye." },
        { type: "fill", prompt: "Complete it: “___ to meet you.”", options: ["Nice", "Good night", "Sorry", "Please"], answer: 0, why: "“Nice to meet you” is the full phrase." },
        { type: "match", prompt: "Tap the matching pairs", pairs: [["Hello", "Hi there!"], ["Thank you so much", "You're welcome"], ["How are you?", "I'm great, thanks!"], ["Goodbye", "See you soon!"], ["Excuse me", "Yes, how can I help?"]], why: "Every greeting has its natural partner reply." },
        { type: "speak", text: "Hey, how's it going? Pretty good, thanks!", prompt: "Say it out loud, like a native speaker", why: "Speaking out loud builds real confidence — hesitation ➔ fluency." },
        { type: "mcq", prompt: "You are leaving a friend's home. What sounds most natural?", options: ["I am going to my home now.", "I'd better get going. See you soon!", "I will depart from here.", "Go well."], answer: 1, why: "“I'd better get going” is the natural, soft way to leave." },
        { type: "say", wrong: "Myself Rahul.", prompt: "Don't say this. Say this instead:", options: ["I'm Rahul.", "Myself is Rahul.", "Rahul is myself."], answer: 0, why: "Introduce yourself with “I'm Rahul” — never “Myself Rahul.”" },
        { type: "build", prompt: "Build the sentence", words: ["been", "long", "It's", "a", "time"], answer: "It's been a long time", why: "“It's been a long time” — perfect when you meet someone after ages." },
        { type: "listen", text: "It was nice talking to you", prompt: "What did you hear?", options: ["It was nice talking to you", "It was nice walking with you", "It is nice to talk you"], answer: 0, why: "You heard: “It was nice talking to you.”" },
        { type: "mcq", prompt: "Which small-talk question is natural at work on Monday?", options: ["How was your weekend?", "What is your salary?", "Why were you absent in life?", "Tell me your age."], answer: 0, why: "“How was your weekend?” — friendly, safe small talk." }
      ]
    },
    {
      id: "daily", title: "Daily Life English", sub: "Shops, food, home and your everyday", color: "#1cb0f6", icon: "🏠",
      items: [
        { type: "mcq", prompt: "At a café, how do you order politely?", options: ["Give me one coffee.", "Can I get a coffee, please?", "I want coffee now.", "Coffee. Bring."], answer: 1, why: "“Can I get a coffee, please?” — polite and natural." },
        { type: "build", prompt: "Build the sentence", words: ["much", "How", "is", "it", "?"], answer: "How much is it ?", why: "“How much is it?” — ask this in any shop." },
        { type: "listen", text: "Could you help me, please?", prompt: "What did you hear?", options: ["Could you help me, please?", "Could you call me, please?", "Would you help me, please?"], answer: 0, why: "You heard: “Could you help me, please?”" },
        { type: "fill", prompt: "Complete it: “I'm just ___ , thanks.” (in a shop, not buying yet)", options: ["looking", "seeing", "watching", "staring"], answer: 0, why: "“I'm just looking, thanks” — every shopper's favourite line." },
        { type: "match", prompt: "Tap the matching pairs", pairs: [["I'm hungry", "Let's eat something"], ["I'm tired", "Get some rest"], ["I'm lost", "Can you show me the way?"], ["It's raining", "Take an umbrella"], ["I'm late", "Hurry up!"]], why: "Situation ➔ natural response. That's real conversation." },
        { type: "type", text: "I will be right back", prompt: "Listen and type what you hear", why: "“I will be right back” — you'll use this every day." },
        { type: "speak", text: "Excuse me, how much is this?", prompt: "Say it out loud, like in a real shop", why: "Practise the shop scene out loud — that's how it sticks." },
        { type: "say", wrong: "I have a doubt.", prompt: "Don't say this (in class / at work). Say this instead:", options: ["I have a question.", "My doubt is big.", "Doubt is coming to me."], answer: 0, why: "In English we say “I have a question”, not “I have a doubt.”" },
        { type: "mcq", prompt: "Your friend cooked for you. Best natural reply after eating?", options: ["The food was very tasteful.", "That was delicious, thank you!", "I am fully satisfied in stomach.", "Eating is completed."], answer: 1, why: "“That was delicious” — simple and natural." },
        { type: "build", prompt: "Build the sentence", words: ["running", "I'm", "late", "a", "little"], answer: "I'm running a little late", why: "“I'm running a little late” — text this and you're covered." },
        { type: "listen", text: "Let me check and get back to you", prompt: "What did you hear?", options: ["Let me check and get back to you", "Let me take and come back to you", "Let me see and return to you"], answer: 0, why: "You heard: “Let me check and get back to you.”" },
        { type: "mcq", prompt: "Which one means “wait a moment”?", options: ["Hold on a second.", "Catch on a second.", "Keep on a second.", "Stay on a second."], answer: 0, why: "“Hold on a second” = wait a moment." }
      ]
    },
    {
      id: "saythis", title: "Say This, Not That", sub: "Fix the most common Indian-English mistakes", color: "#a560e8", icon: "💬",
      items: [
        { type: "say", wrong: "I am having two brothers.", prompt: "Don't say this. Say this instead:", options: ["I have two brothers.", "I am having brothers two.", "Two brothers are having me."], answer: 0, why: "For family and things you own, use “I have”, not “I am having.”" },
        { type: "say", wrong: "He is my cousin brother.", prompt: "Don't say this. Say this instead:", options: ["He's my cousin.", "He is my brother cousin.", "He is cousin of mine brother."], answer: 0, why: "“Cousin” already covers brother/sister cousins — no need for “cousin brother.”" },
        { type: "say", wrong: "Please revert back to me.", prompt: "Don't say this. Say this instead:", options: ["Please get back to me.", "Please return back to me.", "Please reply back me."], answer: 0, why: "“Revert” already means go back — just say “Please get back to me.”" },
        { type: "say", wrong: "I didn't knew that.", prompt: "Don't say this. Say this instead:", options: ["I didn't know that.", "I didn't knew it.", "I not knew that."], answer: 0, why: "After “didn't”, always use the base verb: didn't know, didn't go, didn't see." },
        { type: "say", wrong: "She is married with a doctor.", prompt: "Don't say this. Say this instead:", options: ["She is married to a doctor.", "She is married by a doctor.", "She married with doctor."], answer: 0, why: "Married TO someone — never married with." },
        { type: "build", prompt: "Build the correct sentence", words: ["discuss", "Let's", "this", "today"], answer: "Let's discuss this today", why: "“Discuss” needs no “about” after it. Let's discuss this — not discuss about this." },
        { type: "mcq", prompt: "Which sentence is correct?", options: ["I am agree with you.", "I agree with you.", "I am agreeing with you fully.", "Myself agree with you."], answer: 1, why: "“Agree” is a verb — “I agree”, never “I am agree.”" },
        { type: "fill", prompt: "Complete it correctly: “He ___ to school every day.”", options: ["goes", "go", "going", "gone yesterday"], answer: 0, why: "He/she/it + verb-s: he goes, she works, it rains." },
        { type: "match", prompt: "Match the mistake to the correct version", pairs: [["I am having a car", "I have a car"], ["Do the needful", "Please do what's needed"], ["Out of station", "Out of town"], ["Passing out of college", "Graduating"], ["Today morning", "This morning"]], why: "These five fixes alone make your English sound instantly more natural." },
        { type: "listen", text: "Could you repeat that, please?", prompt: "What did you hear?", options: ["Could you repeat that, please?", "Could you reply that, please?", "Could you return that, please?"], answer: 0, why: "You heard: “Could you repeat that, please?” — use it instead of “Repeat again.”" },
        { type: "speak", text: "Actually, I don't agree with that.", prompt: "Say it out loud — politely disagreeing", why: "Soft “actually” + clear opinion = confident English." },
        { type: "type", text: "Thanks for letting me know", prompt: "Listen and type what you hear", why: "“Thanks for letting me know” — a phrase you'll use daily on WhatsApp and at work." }
      ]
    },
    {
      id: "interview", title: "Job Interview English", sub: "Sound confident and professional", color: "#ff9600", icon: "💼",
      items: [
        { type: "mcq", prompt: "Interviewer: “Tell me about yourself.” Best opening?", options: ["I have completed my graduation in 2022 and myself from Jaipur only.", "I'm a marketing executive with three years of experience in social media.", "My hobbies are music and cricket, and my father is a teacher.", "I am telling you everything from childhood."], answer: 1, why: "Start with your role + experience. Job first, life story later." },
        { type: "build", prompt: "Build the sentence", words: ["looking", "I'm", "for", "to", "working", "forward", "with", "you"], answer: "I'm looking forward to working with you", why: "“I'm looking forward to working with you” — the perfect interview closer." },
        { type: "listen", text: "What are your strengths?", prompt: "What did the interviewer ask?", options: ["What are your strengths?", "What are your streets?", "What are your students?"], answer: 0, why: "You heard: “What are your strengths?” — prepare this answer!" },
        { type: "fill", prompt: "Complete it: “I work well ___ pressure.”", options: ["under", "below", "down", "inside"], answer: 0, why: "The fixed phrase is “work well under pressure.”" },
        { type: "match", prompt: "Match the question to a strong answer", pairs: [["Why should we hire you?", "I learn fast and deliver on time"], ["Your weakness?", "I double-check my work a lot"], ["Where do you see yourself in 5 years?", "Leading a small team"], ["Why this company?", "I admire your products"], ["Your expected salary?", "I'm flexible for the right role"]], why: "Short, honest, confident — that's the interview formula." },
        { type: "speak", text: "I am a quick learner and a team player.", prompt: "Say it out loud, with confidence", why: "Say it like you mean it — interviewers hear confidence." },
        { type: "say", wrong: "I am fresher, just passed out.", prompt: "Don't say this. Say this instead:", options: ["I'm a recent graduate.", "I freshly passed out.", "I am new pass-out student."], answer: 0, why: "“I'm a recent graduate” sounds professional; “passed out” means fainted!" },
        { type: "mcq", prompt: "You don't know an answer in the interview. Best reply?", options: ["(stay silent and smile)", "I'm not sure, but here's how I'd find out.", "That is out of syllabus.", "Please skip to next question."], answer: 1, why: "Honest + a plan beats silence every time." },
        { type: "type", text: "Thank you for your time", prompt: "Listen and type what you hear", why: "“Thank you for your time” — end every interview with this." },
        { type: "build", prompt: "Build the sentence", words: ["experience", "I", "in", "have", "sales", "two", "years", "of"], answer: "I have two years of experience in sales", why: "“I have ___ years of experience in ___” — your power sentence." }
      ]
    },
    {
      id: "travel", title: "Travel English", sub: "Airport, hotel, taxi and directions", color: "#ff4b8f", icon: "✈️",
      items: [
        { type: "mcq", prompt: "At the hotel desk, how do you ask for your room?", options: ["I have a booking under the name Sharma.", "Give me room key, booking is there.", "My name, room give.", "Booking mine, check fast."], answer: 0, why: "“I have a booking under the name…” — works at every hotel in the world." },
        { type: "build", prompt: "Build the sentence", words: ["is", "Where", "the", "station", "?"], answer: "Where is the station ?", why: "“Where is the station?” — the traveller's lifeline question." },
        { type: "listen", text: "Your flight has been delayed", prompt: "What did you hear?", options: ["Your flight has been delayed", "Your flight has been deleted", "Your light has been delayed"], answer: 0, why: "You heard: “Your flight has been delayed.” Deep breath — it happens!" },
        { type: "fill", prompt: "Complete it: “Could I see the ___, please?” (at a restaurant)", options: ["menu", "list food", "paper of food", "book eat"], answer: 0, why: "Ask for the “menu” — simple and correct." },
        { type: "match", prompt: "Tap the matching pairs", pairs: [["One ticket to Delhi, please", "🚆 At the station"], ["I'd like a window seat", "✈️ On the plane"], ["Can you take me to the airport?", "🚕 In a taxi"], ["Is breakfast included?", "🏨 At the hotel"], ["How do I get to the museum?", "🗺️ Asking directions"]], why: "Right phrase, right place — travel sorted." },
        { type: "speak", text: "Excuse me, could you help me? I am lost.", prompt: "Say it out loud — polite and clear", why: "This one sentence can rescue any trip." },
        { type: "type", text: "How long does it take", prompt: "Listen and type what you hear", why: "“How long does it take?” — ask it about every journey." },
        { type: "say", wrong: "I want to do check-in in hotel.", prompt: "Don't say this. Say this instead:", options: ["I'd like to check in, please.", "I want doing check-in.", "Check-in me in hotel."], answer: 0, why: "“I'd like to check in, please” — polite, natural, correct." },
        { type: "mcq", prompt: "The taxi driver asks “Where to?” You reply:", options: ["To the airport, please.", "Airport going I am.", "Me airport.", "Go airport side."], answer: 0, why: "Short and clear wins in a taxi: “To the airport, please.”" },
        { type: "build", prompt: "Build the sentence", words: ["table", "a", "for", "I'd", "like", "book", "two", "to"], answer: "I'd like to book a table for two", why: "“I'd like to book a table for two” — restaurant English, done." }
      ]
    }
  ];

  const TYPE_LABEL = { mcq: "CHOOSE THE CORRECT ANSWER", say: "SAY THIS, NOT THAT ✦", build: "BUILD THE SENTENCE", listen: "🎧 LISTEN AND CHOOSE", type: "🎧 LISTEN AND TYPE", fill: "FILL IN THE BLANK", match: "MATCH THE PAIRS", speak: "🎤 SPEAKING CHALLENGE" };
  const SESSION_SIZE = 10;

  /* ================= State ================= */
  const KEY = "english_flow_duo_v1";
  const MAIN_KEY = "english_flow_practice_v2";
  const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const blank = () => ({ xp: 0, gems: 0, hearts: 5, heartDay: todayKey(), activity: {}, xpToday: 0, dayKey: todayKey(), weekXp: 0, weekKey: todayKey(), sessions: 0, crowns: {}, perfectTotal: 0, bestComboEver: 0, questsDone: {} });
  function load() {
    let s; try { s = JSON.parse(localStorage.getItem(KEY)) || blank(); } catch { s = blank(); }
    s = Object.assign(blank(), s);
    const t = todayKey();
    if (s.heartDay !== t) { s.hearts = 5; s.heartDay = t; }
    if (s.dayKey !== t) { s.xpToday = 0; s.dayKey = t; s.questsDone = {}; }
    const monday = new Date(); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    if (s.weekKey < todayKey(monday)) { s.weekXp = 0; s.weekKey = t; }
    return s;
  }
  let state = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ } }
  function streak() {
    let count = 0, d = new Date();
    if (!state.activity[todayKey(d)]) d.setDate(d.getDate() - 1);
    while (state.activity[todayKey(d)]) { count++; d.setDate(d.getDate() - 1); }
    return count;
  }
  function awardToMain(xp, gems) {
    try {
      const raw = JSON.parse(localStorage.getItem(MAIN_KEY));
      if (!raw || typeof raw !== "object") return;
      raw.xp = (raw.xp || 0) + xp; raw.gems = (raw.gems || 0) + gems;
      raw.activity = raw.activity || {}; raw.activity[todayKey()] = (raw.activity[todayKey()] || 0) + 1;
      localStorage.setItem(MAIN_KEY, JSON.stringify(raw));
    } catch { /* main practice state untouched */ }
  }

  /* ================= Sound & speech ================= */
  let actx = null;
  function beep(kind) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      actx = actx || new AC();
      const notes = kind === "good" ? [523.25, 659.25] : kind === "win" ? [523.25, 659.25, 783.99, 1046.5] : kind === "bad" ? [220, 174] : [392];
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * 0.09;
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.015); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 0.22);
      });
    } catch { /* silent is fine */ }
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) { toast("Audio isn't supported here — read it aloud instead."); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.88;
    speechSynthesis.speak(u);
  }

  /* ================= Helpers ================= */
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = s => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9\s']/g, "").replace(/\s+/g, " ").trim();
  const shuffle = a => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
  let toastTimer;
  function toast(msg) { const t = $("#gp-toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.hidden = true, 3200); }
  function xpFloat(x, y, text) { const el = document.createElement("div"); el.className = "xp-float"; el.textContent = text; el.style.left = x + "px"; el.style.top = y + "px"; document.body.appendChild(el); setTimeout(() => el.remove(), 1150); }

  /* ================= Hub ================= */
  const LEAGUE_BOTS = [
    { name: "Priya", avatar: "🦊", xp: 140 }, { name: "Arjun", avatar: "🐼", xp: 115 },
    { name: "Sana", avatar: "🦁", xp: 90 }, { name: "Rohit", avatar: "🐯", xp: 60 },
    { name: "Meera", avatar: "🦄", xp: 35 }, { name: "Kabir", avatar: "🐸", xp: 15 }
  ];
  const QUESTS = [
    { id: "xp50", icon: "⚡", label: "Earn 50 XP today", goal: 50, get: () => state.xpToday },
    { id: "sess1", icon: "🎮", label: "Finish 1 session today", goal: 1, get: () => state.questsDone.sessions || 0 },
    { id: "perf5", icon: "🎯", label: "Get 5 first-try correct today", goal: 5, get: () => state.questsDone.perfect || 0 }
  ];
  const BADGES = [
    { emoji: "🎮", label: "First session", earned: () => state.sessions >= 1 },
    { emoji: "⚡", label: "100 XP club", earned: () => state.xp >= 100 },
    { emoji: "💯", label: "500 XP club", earned: () => state.xp >= 500 },
    { emoji: "🎯", label: "Perfect 10 answers", earned: () => state.perfectTotal >= 10 },
    { emoji: "🔥", label: "3-day streak", earned: () => streak() >= 3 },
    { emoji: "👑", label: "Crown a unit", earned: () => Object.values(state.crowns).some(c => c >= 1) }
  ];
  function renderHub() {
    $("#st-streak").textContent = streak();
    $("#st-gems").textContent = state.gems.toLocaleString();
    $("#st-hearts").textContent = state.hearts;
    $("#st-xp").textContent = state.xp.toLocaleString();
    $("#ring-xp").textContent = Math.min(state.xpToday, 50);
    $("#ring-fg").style.strokeDashoffset = String(327 - 327 * Math.min(state.xpToday, 50) / 50);
    $("#hearts-copy").textContent = `You have ${state.hearts} heart${state.hearts === 1 ? "" : "s"}. A wrong answer costs 1 heart. Hearts refill free every day — and finishing a session earns +1 back.`;
    $("#quest-list").innerHTML = QUESTS.map(q => {
      const v = Math.min(q.get(), q.goal), done = v >= q.goal;
      return `<div class="quest ${done ? "done" : ""}"><div class="quest-top"><span>${q.icon} ${q.label}</span><b>${v} / ${q.goal}</b></div><div class="quest-bar"><div class="quest-fill" style="width:${v / q.goal * 100}%"></div></div></div>`;
    }).join("");
    const rows = [...LEAGUE_BOTS.map(b => ({ ...b })), { name: "You", avatar: "🦉", xp: state.weekXp, you: true }]
      .sort((a, b) => b.xp - a.xp);
    $("#league-list").innerHTML = rows.map((r, i) =>
      `<div class="league-row ${r.you ? "you" : ""} ${i < 3 ? "top3" : ""}"><span class="rank">${i + 1}</span><span class="avatar">${r.avatar}</span><span>${r.name}${r.you ? " ⭐" : ""}</span><span class="lx">${r.xp} XP</span></div>`).join("");
    $("#badge-list").innerHTML = BADGES.map(b => `<div class="badge ${b.earned() ? "earned" : ""}"><span class="b-emoji">${b.emoji}</span><small>${b.label}</small></div>`).join("");
    $("#badge-count").textContent = `${BADGES.filter(b => b.earned()).length} / ${BADGES.length}`;
    $("#unit-path").innerHTML = UNITS.map((u, i) => {
      const crowns = state.crowns[u.id] || 0, offset = ["0", "70px", "0", "-70px", "0"][i % 5];
      return `<div class="unit-banner" style="background:${u.color}"><div><h3>Unit ${i + 1} · ${esc(u.title)}</h3><p>${esc(u.sub)}</p></div><span class="unit-crowns">👑 ${crowns}</span></div>
      <div class="unit-node-row"><div class="unit-node" style="transform:translateX(${offset})"><button type="button" class="node-btn" style="background:${u.color}" data-unit="${u.id}" aria-label="Start ${esc(u.title)} session">${u.icon}</button><div class="node-label">${esc(u.title.split(" ")[0])}</div></div></div>`;
    }).join("");
    document.querySelectorAll("[data-unit]").forEach(b => b.addEventListener("click", () => startSession(b.dataset.unit)));
  }

  /* ================= Session engine ================= */
  let S = null; // live session
  function buildQueue(unit) {
    const items = shuffle(unit.items);
    const picked = items.slice(0, SESSION_SIZE);
    while (picked.length < SESSION_SIZE) picked.push(items[picked.length % items.length]);
    return picked;
  }
  function startSession(unitId) {
    const unit = UNITS.find(u => u.id === unitId) || UNITS[0];
    if (state.hearts <= 0) { show("nohearts"); return; }
    S = { unit, queue: buildQueue(unit), idx: 0, hearts: state.hearts, xp: 0, correct: 0, firstTry: 0, combo: 0, bestCombo: 0, answered: 0, checked: false, current: null, requeued: new Set(), selected: null, built: [], matched: 0, matchSel: null, typedOK: false };
    show("session");
    renderQuestion();
    beep("click");
  }
  function show(which) {
    $("#hub").hidden = which !== "hub";
    $("#session").hidden = which !== "session";
    $("#result").hidden = which !== "result";
    $("#nohearts").hidden = which !== "nohearts";
    window.scrollTo(0, 0);
  }
  function speakBox(display, toSpeak) {
    return `<div class="say-box"><span class="mascot" aria-hidden="true">🦉</span><div class="speech-bubble">${esc(display)}</div><button type="button" class="speak-btn" data-speak="${esc(toSpeak || display)}">🔊 Listen</button></div>`;
  }
  function renderQuestion() {
    const q = S.queue[S.idx];
    S.current = q; S.checked = false; S.selected = null; S.built = []; S.matched = 0; S.matchSel = null;
    $("#sess-fill").style.width = (S.idx / S.queue.length * 100) + "%";
    $("#sess-hearts").textContent = "❤️ " + S.hearts;
    const comboEl = $("#sess-combo");
    comboEl.hidden = S.combo < 2; comboEl.querySelector("b").textContent = S.combo;
    $("#sess-type").textContent = TYPE_LABEL[q.type] || "PRACTICE";
    const body = $("#sess-body"), foot = $("#sess-footer");
    foot.className = "sess-footer"; $("#sess-feedback").innerHTML = "";
    const check = $("#sess-check"); check.textContent = "Check"; check.className = "btn-3d btn-green sess-btn"; check.disabled = true;

    if (q.type === "mcq" || q.type === "fill") {
      $("#sess-prompt").textContent = q.prompt;
      body.innerHTML = `<div class="opt-list">${q.options.map((o, i) => `<button type="button" class="opt" data-opt="${i}"><span class="opt-key">${i + 1}</span>${esc(o)}</button>`).join("")}</div>`;
      body.querySelectorAll("[data-opt]").forEach(b => b.addEventListener("click", () => { S.selected = Number(b.dataset.opt); body.querySelectorAll(".opt").forEach(x => x.classList.toggle("selected", x === b)); check.disabled = false; beep("click"); }));
    } else if (q.type === "say") {
      $("#sess-prompt").textContent = q.prompt;
      body.innerHTML = `${speakBox("❌ " + q.wrong, q.wrong)}<div class="opt-list">${q.options.map((o, i) => `<button type="button" class="opt" data-opt="${i}"><span class="opt-key">${i + 1}</span>${esc(o)}</button>`).join("")}</div>`;
      body.querySelectorAll("[data-opt]").forEach(b => b.addEventListener("click", () => { S.selected = Number(b.dataset.opt); body.querySelectorAll(".opt").forEach(x => x.classList.toggle("selected", x === b)); check.disabled = false; beep("click"); }));
    } else if (q.type === "build") {
      $("#sess-prompt").textContent = q.prompt;
      const tiles = shuffle(q.words.map((w, i) => ({ w, i })));
      body.innerHTML = `<div class="build-line" id="build-line" aria-label="Your sentence"></div><div class="word-bank">${tiles.map(t => `<button type="button" class="tile" data-tile="${t.i}">${esc(t.w)}</button>`).join("")}</div>`;
      body.querySelectorAll("[data-tile]").forEach(b => b.addEventListener("click", () => {
        const i = Number(b.dataset.tile);
        if (b.classList.contains("used")) return;
        b.classList.add("used"); S.built.push(i);
        const chip = document.createElement("button"); chip.type = "button"; chip.className = "tile in-answer"; chip.textContent = q.words[i]; chip.dataset.chip = i;
        chip.addEventListener("click", () => { S.built = S.built.filter(x => x !== i); chip.remove(); b.classList.remove("used"); check.disabled = S.built.length !== q.words.length; });
        $("#build-line").appendChild(chip);
        check.disabled = S.built.length !== q.words.length; beep("click");
      }));
    } else if (q.type === "listen") {
      $("#sess-prompt").textContent = q.prompt;
      body.innerHTML = `${speakBox("Tap Listen and choose what you heard 👂", q.text)}<div class="opt-list">${q.options.map((o, i) => `<button type="button" class="opt" data-opt="${i}"><span class="opt-key">${i + 1}</span>${esc(o)}</button>`).join("")}</div>`;
      body.querySelectorAll("[data-opt]").forEach(b => b.addEventListener("click", () => { S.selected = Number(b.dataset.opt); body.querySelectorAll(".opt").forEach(x => x.classList.toggle("selected", x === b)); check.disabled = false; beep("click"); }));
      setTimeout(() => speak(q.text), 350);
    } else if (q.type === "type") {
      $("#sess-prompt").textContent = q.prompt;
      body.innerHTML = `${speakBox("Listen carefully, then type it below ✍️", q.text)}<input class="type-input" id="type-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type what you hear…" aria-label="Type what you hear" />`;
      const input = $("#type-input");
      input.addEventListener("input", () => check.disabled = !input.value.trim());
      input.addEventListener("keydown", e => { if (e.key === "Enter" && !check.disabled) check.click(); });
      setTimeout(() => { speak(q.text); input.focus(); }, 350);
    } else if (q.type === "match") {
      $("#sess-prompt").textContent = q.prompt;
      const left = shuffle(q.pairs.map((p, i) => ({ t: p[0], i }))), right = shuffle(q.pairs.map((p, i) => ({ t: p[1], i })));
      body.innerHTML = `<div class="match-wrap"><div class="opt-list">${left.map(x => `<button type="button" class="match-tile" data-side="L" data-i="${x.i}">${esc(x.t)}</button>`).join("")}</div><div class="opt-list">${right.map(x => `<button type="button" class="match-tile" data-side="R" data-i="${x.i}">${esc(x.t)}</button>`).join("")}</div></div><p class="gp-note" style="text-align:center">Match all ${q.pairs.length} pairs — no Check button needed!</p>`;
      body.querySelectorAll(".match-tile").forEach(b => b.addEventListener("click", () => matchTap(b, q)));
    } else if (q.type === "speak") {
      $("#sess-prompt").textContent = q.prompt;
      body.innerHTML = `<div class="speak-target">“${esc(q.text)}”</div><div class="speak-actions"><button type="button" class="speak-btn" data-speak="${esc(q.text)}">🔊 Listen first</button><button type="button" class="mic-btn" id="mic-btn">🎤 Tap & speak</button></div><p class="speak-status" id="speak-status">Listen, then say it out loud. Tap Check when you've said it!</p>`;
      $("#mic-btn").addEventListener("click", () => startListening(q));
    }
    body.querySelectorAll("[data-speak]").forEach(b => b.addEventListener("click", () => speak(b.dataset.speak)));
    if (q.type === "match") { check.disabled = true; }
    if (q.type === "speak") { check.disabled = false; check.textContent = "I said it ✓"; }
  }
  function matchTap(btn, q) {
    if (btn.classList.contains("done")) return;
    beep("click");
    if (!S.matchSel) { S.matchSel = btn; btn.classList.add("selected"); return; }
    if (S.matchSel === btn) { btn.classList.remove("selected"); S.matchSel = null; return; }
    if (S.matchSel.dataset.side === btn.dataset.side) { S.matchSel.classList.remove("selected"); S.matchSel = btn; btn.classList.add("selected"); return; }
    const a = S.matchSel, b = btn; S.matchSel = null;
    a.classList.remove("selected");
    if (a.dataset.i === b.dataset.i) {
      a.classList.add("done"); b.classList.add("done"); S.matched++; beep("good");
      if (S.matched === q.pairs.length) { $("#sess-check").disabled = false; $("#sess-feedback").innerHTML = `<span class="fb-title">All matched! 🏆</span>Tap Check to collect your XP.`; }
    } else {
      a.classList.add("bad"); b.classList.add("bad");
      loseHeart();
      setTimeout(() => { a.classList.remove("bad"); b.classList.remove("bad"); }, 420);
      if (S.hearts <= 0) return endNoHearts();
    }
  }
  function startListening(q) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const status = $("#speak-status"), mic = $("#mic-btn");
    if (!SR) { status.textContent = "Voice check isn't supported in this browser — say it out loud anyway, then tap “I said it ✓”."; return; }
    try {
      const rec = new SR(); rec.lang = "en-US"; rec.interimResults = false;
      mic.classList.add("listening"); mic.textContent = "🎙️ Listening…";
      status.textContent = "Listening… say the sentence now!";
      rec.onresult = e => {
        const heard = e.results[0][0].transcript;
        status.textContent = `You said: “${heard}”`;
        if (norm(heard) === norm(q.text) || norm(q.text).split(" ").filter(w => norm(heard).includes(w)).length >= Math.ceil(norm(q.text).split(" ").length * 0.7)) {
          status.textContent += " — great pronunciation! 🎉 Tap Check.";
          S.typedOK = true;
        } else status.textContent += " — close! Listen once more and try again, or tap Check if you practised it.";
      };
      rec.onend = () => { mic.classList.remove("listening"); mic.textContent = "🎤 Tap & speak"; };
      rec.onerror = () => { mic.classList.remove("listening"); mic.textContent = "🎤 Tap & speak"; status.textContent = "Mic didn't catch that — say it out loud and tap “I said it ✓”."; };
      rec.start();
    } catch { status.textContent = "Mic isn't available — say it out loud and tap “I said it ✓”."; }
  }
  function isCorrect(q) {
    if (q.type === "mcq" || q.type === "say" || q.type === "fill" || q.type === "listen") return S.selected === q.answer;
    if (q.type === "build") return norm(S.built.map(i => q.words[i]).join(" ")) === norm(q.answer);
    if (q.type === "type") return norm($("#type-input").value) === norm(q.text);
    if (q.type === "match") return S.matched === q.pairs.length;
    if (q.type === "speak") return true; // self-marked practice, like shadowing
    return false;
  }
  function correctText(q) {
    if (q.type === "mcq" || q.type === "say" || q.type === "fill" || q.type === "listen") return q.options[q.answer];
    if (q.type === "build") return q.answer.replace(/\s+([?.!])/g, "$1");
    if (q.type === "type") return q.text;
    return "";
  }
  function loseHeart() {
    S.hearts--; S.combo = 0;
    const h = $("#sess-hearts"); h.textContent = "❤️ " + S.hearts; h.classList.remove("lost"); void h.offsetWidth; h.classList.add("lost");
    $("#sess-combo").hidden = true;
  }
  function onCheck() {
    const q = S.current, check = $("#sess-check"), foot = $("#sess-footer"), fb = $("#sess-feedback");
    if (S.checked) { nextQuestion(); return; }
    const ok = isCorrect(q);
    S.checked = true; S.answered++;
    if (q.type === "mcq" || q.type === "say" || q.type === "fill" || q.type === "listen") {
      document.querySelectorAll("#sess-body .opt").forEach((el, i) => { el.disabled = true; if (i === q.answer) el.classList.add("correct"); else if (i === S.selected) el.classList.add("wrong"); });
    }
    if (ok) {
      const firstTry = !S.requeued.has(q);
      S.combo++; S.bestCombo = Math.max(S.bestCombo, S.combo);
      const gain = 10 + (S.combo >= 3 ? 5 : 0);
      S.xp += gain; S.correct++; if (firstTry) { S.firstTry++; }
      beep("good");
      foot.className = "sess-footer good";
      fb.innerHTML = `<span class="fb-title">${S.combo >= 3 ? "🔥 " + S.combo + " in a row! " : ""}${["Excellent!", "Nice work!", "You got it!", "Brilliant!"][Math.floor(Math.random() * 4)]}</span>${esc(q.why || "")}`;
      const r = check.getBoundingClientRect(); xpFloat(r.left + 10, r.top - 10, `+${gain} XP`);
      const c = $("#sess-combo"); c.hidden = S.combo < 2; c.querySelector("b").textContent = S.combo;
    } else {
      beep("bad"); loseHeart();
      foot.className = "sess-footer bad";
      fb.innerHTML = `<span class="fb-title">Not quite — the correct answer is:</span>“${esc(correctText(q))}” ${esc(q.why || "")}`;
      if (!S.requeued.has(q)) { S.requeued.add(q); S.queue.push(q); }
      if (S.hearts <= 0) { check.textContent = "Continue"; return; }
    }
    $("#sess-fill").style.width = ((S.idx + 1) / S.queue.length * 100) + "%";
    check.textContent = "Continue"; check.disabled = false;
  }
  function nextQuestion() {
    S.idx++;
    if (S.hearts <= 0) return endNoHearts();
    if (S.idx >= S.queue.length) return finishSession();
    renderQuestion();
  }
  function endNoHearts() {
    state.hearts = 0; state.xp += S.xp; state.xpToday += S.xp; state.weekXp += S.xp;
    state.activity[todayKey()] = (state.activity[todayKey()] || 0) + 1; save(); awardToMain(S.xp, 0);
    show("nohearts"); beep("bad");
  }
  function finishSession() {
    const total = S.answered || 1, acc = Math.round(S.correct / total * 100);
    const perfectBonus = S.correct === S.queue.length ? 20 : 0;
    const xpTotal = S.xp + perfectBonus;
    const chestGems = 15 + Math.floor(Math.random() * 11) + (perfectBonus ? 5 : 0);
    state.xp += xpTotal; state.xpToday += xpTotal; state.weekXp += xpTotal;
    state.sessions++; state.perfectTotal += S.firstTry;
    state.bestComboEver = Math.max(state.bestComboEver, S.bestCombo);
    state.crowns[S.unit.id] = (state.crowns[S.unit.id] || 0) + 1;
    state.hearts = Math.min(5, S.hearts + 1);
    state.activity[todayKey()] = (state.activity[todayKey()] || 0) + 1;
    state.questsDone.sessions = (state.questsDone.sessions || 0) + 1;
    state.questsDone.perfect = (state.questsDone.perfect || 0) + S.firstTry;
    save();
    S.chestGems = chestGems; S.xpTotal = xpTotal;
    awardToMain(xpTotal, 0); // gems land when the chest is opened
    $("#res-xp").textContent = "+" + xpTotal;
    $("#res-acc").textContent = acc + "%";
    $("#res-combo").textContent = "🔥 " + S.bestCombo;
    $("#result-title").textContent = perfectBonus ? "Perfect session! 🏆" : acc >= 70 ? "Session complete! 🎉" : "Session complete!";
    $("#result-sub").textContent = perfectBonus ? "Every answer right. That's mastery." : acc >= 70 ? "Strong work — your English is flowing." : "Good practice! Review the red ones and play again to master them.";
    const chest = $("#chest"); chest.classList.remove("opened"); $("#chest-gems").hidden = true; chest.querySelector(".chest-label").textContent = "Tap to open your reward chest!";
    const rows = [...LEAGUE_BOTS, { name: "You", xp: state.weekXp }].sort((a, b) => b.xp - a.xp);
    const rank = rows.findIndex(r => r.name === "You") + 1;
    $("#res-league").textContent = `You are now #${rank} in the Bronze League with ${state.weekXp} XP this week. ${rank <= 3 ? "Top 3 — promotion zone! 🏆" : "Keep playing to climb!"}`;
    show("result"); beep("win"); confetti();
  }
  function confetti() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas"), ctx = c.getContext("2d"); if (!ctx) return;
    c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:80"; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    const colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#ce82ff"];
    const bits = Array.from({ length: 110 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.3, vx: (Math.random() - 0.5) * 2.4, vy: 2 + Math.random() * 3.4, r: 3 + Math.random() * 5, col: colors[Math.floor(Math.random() * colors.length)], a: Math.random() * 6 }));
    let f = 0; (function draw() { ctx.clearRect(0, 0, c.width, c.height); bits.forEach(p => { p.x += p.vx; p.y += p.vy; p.a += 0.12; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.col; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); }); if (++f < 150) requestAnimationFrame(draw); else c.remove(); })();
  }

  /* ================= Wiring ================= */
  $("#sess-check").addEventListener("click", onCheck);
  $("#quick-start").addEventListener("click", () => startSession(UNITS[Math.floor(Math.random() * UNITS.length)].id));
  $("#sess-close").addEventListener("click", () => { if (confirm("Leave this session? Your progress in it will be lost.")) { S = null; renderHub(); show("hub"); } });
  $("#chest").addEventListener("click", () => {
    const chest = $("#chest"); if (chest.classList.contains("opened") || !S) return;
    chest.classList.add("opened"); chest.querySelector(".chest-emoji").textContent = "💎";
    chest.querySelector(".chest-label").textContent = "You earned:";
    const g = $("#chest-gems"); g.hidden = false; g.textContent = `+${S.chestGems} gems 💎`;
    state.gems += S.chestGems; save(); awardToMain(0, S.chestGems); beep("win");
  });
  $("#res-hub").addEventListener("click", () => { renderHub(); show("hub"); });
  $("#res-again").addEventListener("click", () => startSession(S ? S.unit.id : UNITS[0].id));
  $("#nh-hub").addEventListener("click", () => { renderHub(); show("hub"); });
  $("#nh-restart").addEventListener("click", () => { state.hearts = 5; state.heartDay = todayKey(); save(); startSession(S ? S.unit.id : UNITS[0].id); });
  document.addEventListener("keydown", e => {
    if ($("#session").hidden || !S || S.checked) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 4) { const el = document.querySelector(`#sess-body [data-opt="${n - 1}"]`); if (el) el.click(); }
  });

  save(); renderHub();
})();
