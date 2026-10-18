/* English Flow — Pro Vocab Quiz (premium pack)
   Set 1 is FREE. Sets 2–6 unlock after purchase on Topmate + access code.
   BUY LINK — set the real Topmate product URL here when the product is created: */
const TOPMATE_QUIZ_LINK = "https://topmate.io/speak_english_with_confidence/2363255";
/* SHA-256 hex of the buyer access code. Do NOT put the plain code in a
   comment here — it is printed on the buyer access card delivered by Topmate. */
const ACCESS_CODE_SHA256 = "6572b6f0ac09cbfd8785e05de31125e6c14d63684ff73ec98229ea8837c1f871";

const UNLOCK_KEY = "ef_premium_quiz_unlocked";
const PROGRESS_KEY = "english_flow_premium_quiz_v1";
const SET_TIME = 180; // per-set timer, seconds

const SETS = [
  {
    id: 1, free: true, emoji: "⚡", title: "Don't Say \"Very…\"",
    subtitle: "Intensifiers that make you sound fluent",
    questions: [
      { q: "Don't say: \"I am very tired.\" Say:", options: ["I am exhausted.", "I am very tired much.", "I am tiredly.", "I am too tiredness."], answer: 0, why: "\"Exhausted\" is the one-word upgrade for very tired." },
      { q: "Don't say: \"I am very happy.\" Say:", options: ["I am happy-happy.", "I'm thrilled.", "I am very happiness.", "I am big happy."], answer: 1, why: "\"Thrilled\" = extremely happy, sounds natural." },
      { q: "Don't say: \"It's very cold.\" Say:", options: ["It's freezing.", "It's coldly.", "It's very ice.", "It is coldness."], answer: 0, why: "\"Freezing\" is what native speakers say for very cold." },
      { q: "Don't say: \"I am very hungry.\" Say:", options: ["I am hungry much.", "I'm starving.", "I am food wanting.", "I am very eat."], answer: 1, why: "\"Starving\" = extremely hungry (informal, everyday)." },
      { q: "Don't say: \"The movie was very good.\" Say:", options: ["The movie was very nicely.", "The movie was good-good.", "The movie was brilliant.", "The movie was goodness."], answer: 2, why: "\"Brilliant\" replaces very good for movies, ideas, performances." },
      { q: "Don't say: \"He is very angry.\" Say:", options: ["He is furious.", "He is angry much.", "He is angered fully.", "He is very temper."], answer: 0, why: "\"Furious\" = extremely angry." },
      { q: "Don't say: \"The exam was very difficult.\" Say:", options: ["The exam was difficultly.", "The exam was very hardness.", "The exam was tricky.", "The exam was difficultly much."], answer: 2, why: "\"Tricky\" is the smart word for difficult exam questions." },
      { q: "Don't say: \"She is very beautiful.\" Say:", options: ["She is beautiful much.", "She is stunning.", "She is beauty full.", "She is very pretty face."], answer: 1, why: "\"Stunning\" = extremely beautiful." },
      { q: "Don't say: \"I am very scared.\" Say:", options: ["I am terrorized fully.", "I'm terrified.", "I am scared much.", "I am fearness."], answer: 1, why: "\"Terrified\" = extremely scared." },
      { q: "Don't say: \"This soup is very hot.\" Say:", options: ["This soup is hot much.", "This soup is boiling.", "This soup is heaty.", "This soup is hot-hot."], answer: 1, why: "\"Boiling\" (also \"piping hot\") describes very hot food." },
      { q: "Don't say: \"He talks very fast.\" Say:", options: ["He talks fastly much.", "He speaks rapidly.", "He talks speedy much.", "He is fast talkerly."], answer: 1, why: "\"Rapidly\" = the fluent word for very fast." },
      { q: "Don't say: \"The room was very dirty.\" Say:", options: ["The room was filthy.", "The room was dirty much.", "The room was dirtly.", "The room was muddy much."], answer: 0, why: "\"Filthy\" = extremely dirty." }
    ]
  },
  {
    id: 2, emoji: "🍋", title: "Kitchen & Food Action Verbs",
    subtitle: "What native speakers actually say while cooking",
    questions: [
      { q: "To get juice out of a lemon, you ___ it.", options: ["squeeze", "press down", "hit", "shake"], answer: 0, why: "You \"squeeze\" a lemon — press is for buttons and clothes." },
      { q: "To break paper into a ball, you ___ it.", options: ["cut", "tear", "crumple", "break"], answer: 2, why: "\"Crumple\" the paper into a ball; \"tear\" it into pieces." },
      { q: "Put the biscuit into your tea — you ___ it.", options: ["dip / dunk", "wash", "drop hard", "sink"], answer: 0, why: "\"Dip\" for a quick dip, \"dunk\" for a proper soak." },
      { q: "To remove the price tag from a shirt, ___ it off.", options: ["pull", "snip", "cut roughly", "tear fully"], answer: 1, why: "\"Snip off\" a tag with small scissors — a precise cut." },
      { q: "To remove the skin of a banana, ___ it.", options: ["cut", "peel", "open", "remove skin"], answer: 1, why: "Always \"peel\" a banana, an orange, an apple — never \"cut\"." },
      { q: "To break chocolate into pieces, ___ it.", options: ["cut", "snap", "tear", "press"], answer: 1, why: "You \"snap\" chocolate into pieces — a clean quick break." },
      { q: "After chopping onions, you ___ your eyes (informal).", options: ["dry", "water", "wipe tears — they \"water\"", "close"], answer: 2, why: "Onions make your eyes \"water\" — they produce tears." },
      { q: "To make juice from oranges with a machine, ___ them.", options: ["blend", "squeeze", "juice", "All work"], answer: 3, why: "\"Blend\", \"squeeze\" or \"juice\" an orange — all are natural." },
      { q: "Leftover rice? You ___ it the next day.", options: ["heat again", "warm up", "reheat", "All work"], answer: 3, why: "\"Warm up\" or \"reheat\" leftovers — both natural." },
      { q: "To take the lid off a jar, ___ it.", options: ["open", "unscrew", "twist off", "All work"], answer: 3, why: "\"Open\", \"unscrew\" or \"twist off\" a jar — all natural." },
      { q: "To cook rice in boiling water, you ___ it.", options: ["fry", "boil", "steam", "boil or steam"], answer: 3, why: "Rice is \"boiled\" or \"steamed\" — never fried from raw." },
      { q: "To spread butter on toast, use a knife to ___ it.", options: ["spread", "put", "apply", "smear thinly"], answer: 0, why: "You \"spread\" butter, jam or cheese on bread." }
    ]
  },
  {
    id: 3, emoji: "🧹", title: "Daily Action Verbs",
    subtitle: "Replace boring \"remove\" with verbs natives use",
    questions: [
      { q: "Remove the sticker from the box — ___ it off.", options: ["peel", "take", "remove", "pull out"], answer: 0, why: "\"Peel off\" a sticker or label from a surface." },
      { q: "The chain got stuck — ___ it from the hook.", options: ["unhook", "take off", "remove", "pull away"], answer: 0, why: "\"Unhook\" a chain — release it from its hook." },
      { q: "Clean the dusty table — ___ it off.", options: ["clean", "dust", "wipe clean", "All work"], answer: 3, why: "\"Dust off\" the table — but wipe works too." },
      { q: "Coming home? ___ your jacket.", options: ["take off", "remove", "put down", "open"], answer: 0, why: "\"Take off\" clothes — shoes, jacket, coat." },
      { q: "Get the price tag off — ___ it off.", options: ["cut", "snip", "slice roughly", "remove hard"], answer: 1, why: "\"Snip off\" a tag — a quick precise cut." },
      { q: "Remove the band-aid — ___ it off.", options: ["tear", "peel", "rip", "peel or rip"], answer: 3, why: "\"Peel off\" or \"rip off\" a band-aid — both natural." },
      { q: "Take the cap off the pen — ___ it.", options: ["pull", "pop", "take off", "All work"], answer: 3, why: "\"Pull\", \"pop\" or \"take off\" the cap — all fine." },
      { q: "Wipe the whiteboard clean — ___ it.", options: ["wipe", "rub", "erase", "wipe or erase"], answer: 3, why: "\"Wipe\" a board; \"erase\" writing specifically." },
      { q: "Switch off the fan — ___ it off.", options: ["turn", "switch", "close", "turn or switch"], answer: 3, why: "\"Turn off\" or \"switch off\" the fan, lights, TV." },
      { q: "Pour the tea out — ___ it.", options: ["pour out", "empty", "throw", "pour out or empty"], answer: 3, why: "\"Pour out\" or \"empty\" the cup." },
      { q: "Scratch the itch — don't say \"itch it\", say:", options: ["scratch", "rub hard", "itch it", "press"], answer: 0, why: "You \"scratch\" an itch — never \"itch it\"." },
      { q: "Fold your clothes — don't say \"folding it up\", simply:", options: ["fold", "fold up", "Both work", "press"], answer: 2, why: "\"Fold\" or \"fold up\" clothes — both natural." }
    ]
  },
  {
    id: 4, emoji: "🦁", title: "Male vs Female Animals",
    subtitle: "The pair names that impress everyone",
    questions: [
      { q: "A female lion is a…", options: ["lioness", "lion lady", "she-lion", "lion female"], answer: 0, why: "Lion → lioness. Simple and famous!" },
      { q: "A female tiger is a…", options: ["tigress", "tiger lady", "she-tiger", "tiger female"], answer: 0, why: "Tiger → tigress." },
      { q: "A male peacock's female is a…", options: ["peahen", "peacock lady", "she-peacock", "pea-lady"], answer: 0, why: "Peacock → peahen. (Peafowl = the species.)" },
      { q: "A male bee that doesn't work is a…", options: ["drone", "lazy bee", "king bee", "male bee"], answer: 0, why: "Drone bee — the male; worker bees are female!" },
      { q: "A male swan is a…", options: ["cob", "swan king", "gander", "male swan"], answer: 0, why: "Male swan = cob, female = pen. (Goose male = gander.)" },
      { q: "A female swan is a…", options: ["pen", "swan lady", "hen", "cob"], answer: 0, why: "Female swan = pen; male = cob." },
      { q: "A male goat is a…", options: ["buck", "billy", "Both work", "ram"], answer: 2, why: "\"Buck\" or \"billy\" — both used for a male goat." },
      { q: "A female goat is a…", options: ["nanny", "doe", "Both work", "ewe"], answer: 2, why: "\"Nanny\" or \"doe\" — both used for a female goat." },
      { q: "A male fox is a…", options: ["tod", "dog fox", "Both work", "reynard"], answer: 2, why: "A male fox = tod or dog fox; female = vixen." },
      { q: "A female fox is a…", options: ["vixen", "fox lady", "she-fox", "tod"], answer: 0, why: "Female fox = vixen — a great quiz answer!" },
      { q: "A baby frog is a…", options: ["tadpole", "frogling", "baby frog", "polliwog"], answer: 0, why: "Tadpole (polliwog also works) — the baby frog stage." },
      { q: "A group of wolves is a…", options: ["pack", "herd", "flock", "school"], answer: 0, why: "A \"pack\" of wolves. Herd = cattle, flock = birds, school = fish." }
    ]
  },
  {
    id: 5, emoji: "💼", title: "Office & Interview English",
    subtitle: "Sound professional, not robotic",
    questions: [
      { q: "Don't say: \"Myself Rahul.\" Say:", options: ["I'm Rahul.", "Myself is Rahul.", "Rahul is myself.", "Me Rahul."], answer: 0, why: "Introduce yourself with \"I'm Rahul\" — never \"Myself Rahul.\"" },
      { q: "Don't say: \"I am having a doubt.\" Say:", options: ["I have a question.", "My doubt is there.", "I am doubting.", "Doubt is with me."], answer: 0, why: "In English we say \"I have a question\", not \"I have a doubt.\"" },
      { q: "Don't say: \"Please revert back.\" Say:", options: ["Please get back to me.", "Please return back.", "Please reply back me.", "Please revert backly."], answer: 0, why: "\"Revert\" already means go back — say \"get back to me.\"" },
      { q: "Don't say: \"What is your good name?\" Say:", options: ["What's your name?", "What is your good name please?", "Tell your good name.", "Your name good?"], answer: 0, why: "Simply \"What's your name?\" — \"good name\" sounds translated." },
      { q: "Don't say: \"I didn't knew.\" Say:", options: ["I didn't know.", "I didn't knew it.", "I not knew.", "I didn't known."], answer: 0, why: "After \"didn't\", always use the base verb: didn't know." },
      { q: "Interviewer: \"Tell me about yourself.\" Best opening?", options: ["I'm a marketing executive with 3 years of experience.", "My father is a teacher and I like cricket.", "I am telling everything from childhood.", "I completed graduation, myself from Jaipur."], answer: 0, why: "Start with role + experience. Job first, life story later." },
      { q: "Don't say: \"Discuss about the project.\" Say:", options: ["Let's discuss the project.", "Let's discuss about it.", "Let's do discussion about.", "Discuss the about."], answer: 0, why: "\"Discuss\" needs no \"about\" after it." },
      { q: "Polite way to ask for leave:", options: ["I want leave tomorrow.", "Could I take tomorrow off, please?", "Give me leave.", "I am not coming tomorrow."], answer: 1, why: "\"Could I take tomorrow off?\" — polite and professional." },
      { q: "Don't say: \"He is my cousin brother.\" Say:", options: ["He's my cousin.", "He is cousin brother.", "He is brother cousin.", "My cousin of brother."], answer: 0, why: "\"Cousin\" already covers it — no \"cousin brother.\"" },
      { q: "Ending an interview, say:", options: ["I'm looking forward to working with you.", "I am waiting for job.", "Give me this job please.", "Okay bye then."], answer: 0, why: "\"I'm looking forward to working with you\" — the perfect closer." },
      { q: "Don't say: \"Out of station.\" Say:", options: ["I'm out of town.", "I am out of station.", "Station is out.", "I am outside station."], answer: 0, why: "\"Out of town\" — \"out of station\" is Indian English." },
      { q: "Don't say: \"Prepone the meeting.\" In international English:", options: ["Move the meeting earlier.", "Prepone it.", "Do prepone.", "Make meeting before."], answer: 0, why: "\"Prepone\" isn't understood outside India — say \"move it earlier.\"" }
    ]
  },
  {
    id: 6, emoji: "✈️", title: "Travel English",
    subtitle: "Airports, hotels and streets — made easy",
    questions: [
      { q: "At the airport: \"Where can I ___ my bags?\"", options: ["check in", "put in", "give", "submit"], answer: 0, why: "You \"check in\" your bags at the airport counter." },
      { q: "Don't say: \"I want one ticket.\" At the counter say:", options: ["Could I get a ticket, please?", "Give me one ticket.", "Ticket want.", "One ticket give."], answer: 0, why: "\"Could I get a ticket, please?\" — polite everywhere." },
      { q: "Your flight is late. The sign says…", options: ["delayed", "late coming", "slow flight", "waiting"], answer: 0, why: "Flights are \"delayed\" — never \"late coming.\"" },
      { q: "At the hotel: \"I'd like to ___ for two nights.\"", options: ["book a room", "take a room", "catch a room", "hold a room"], answer: 0, why: "\"Book a room\" — standard worldwide." },
      { q: "Asking directions: \"___ the station?\"", options: ["Excuse me, how do I get to", "Where is station tell", "Station where?", "Tell station path."], answer: 0, why: "\"Excuse me, how do I get to…?\" — polite and clear." },
      { q: "Don't say: \"I am reaching tomorrow.\" Say:", options: ["I'll arrive tomorrow.", "I am reaching.", "Tomorrow I reach.", "I will be reaching."], answer: 0, why: "\"I'll arrive tomorrow\" — \"reaching\" sounds Indian-English." },
      { q: "In a taxi: \"Could you ___ the meter?\"", options: ["turn on", "start", "Both work", "open"], answer: 2, why: "\"Turn on\" or \"start\" the meter — both natural." },
      { q: "At security: \"Please ___ your laptop in the tray.\"", options: ["place", "keep", "put", "All work"], answer: 3, why: "\"Place\", \"put\" or \"keep\" your laptop in the tray." },
      { q: "Don't say: \"What is the time of boarding?\" Say:", options: ["When does boarding start?", "Boarding time what?", "Tell boarding.", "What boarding?"], answer: 0, why: "\"When does boarding start?\" — natural question." },
      { q: "Your bag is too heavy. Staff say it's…", options: ["overweight", "heavy bag", "too much weight", "big bag"], answer: 0, why: "Luggage is \"overweight\" at check-in." },
      { q: "Don't say: \"I will do shopping.\" Say:", options: ["I'll go shopping.", "I will do shopping.", "Shopping I do.", "I do the shopping mall."], answer: 0, why: "\"Go shopping\" — never \"do shopping.\"" },
      { q: "At immigration: \"What is the ___ of your visit?\"", options: ["purpose", "reason", "cause", "purpose or reason"], answer: 3, why: "\"Purpose of your visit\" — \"reason\" also works." }
    ]
  }
];

/* ------------------------------ state ------------------------------ */
let progress = loadProgress();
function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { best: {}, done: {} };
}
function saveProgress() {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) { /* private mode */ }
}
function isUnlocked() {
  if (localStorage.getItem(UNLOCK_KEY) === "1") return true;
  return false;
}
async function refreshCloudEntitlement() {
  // If the signed-in user's Firestore doc has premiumQuiz:true, unlock locally too.
  try {
    const res = await fetch("firebase-applet-config.json", { cache: "no-store" });
    if (!res.ok) return;
    const config = await res.json();
    const appMod = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
    const fsMod = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
    const authMod = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js");
    const app = appMod.initializeApp(config, "ef-premium-quiz");
    const auth = authMod.getAuth(app);
    const user = auth.currentUser;
    if (!user) return;
    const db = config.firestoreDatabaseId ? fsMod.getFirestore(app, config.firestoreDatabaseId) : fsMod.getFirestore(app);
    const snap = await fsMod.getDoc(fsMod.doc(db, "users", user.uid));
    if (snap.exists() && snap.data().premiumQuiz === true) {
      localStorage.setItem(UNLOCK_KEY, "1");
    }
  } catch (e) { console.warn("Premium quiz: cloud entitlement check failed", e); }
}
async function writeCloudEntitlement() {
  // Best effort: record the purchase on the user's Firestore doc.
  try {
    const res = await fetch("firebase-applet-config.json", { cache: "no-store" });
    if (!res.ok) return;
    const config = await res.json();
    const appMod = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
    const fsMod = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
    const authMod = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js");
    const app = appMod.initializeApp(config, "ef-premium-quiz");
    const auth = authMod.getAuth(app);
    const user = auth.currentUser;
    if (!user) return;
    const db = config.firestoreDatabaseId ? fsMod.getFirestore(app, config.firestoreDatabaseId) : fsMod.getFirestore(app);
    await fsMod.setDoc(fsMod.doc(db, "users", user.uid), { premiumQuiz: true, premiumQuizAt: Date.now() }, { merge: true });
  } catch (e) { console.warn("Premium quiz: cloud entitlement write failed", e); }
}
function signedIn() {
  // ef-auth.js renders the top-right button: guest shows "Sign in with Google",
  // a signed-in user shows their name + avatar. We detect via rendered text.
  const btn = document.getElementById("ef-auth-btn");
  if (!btn) return false;
  return !btn.textContent.trim().toLowerCase().startsWith("sign in");
}

let pendingUnlock = false;
async function completeUnlock(code) {
  const hash = await sha256hex(code);
  if (hash !== ACCESS_CODE_SHA256) return false;
  localStorage.setItem(UNLOCK_KEY, "1");
  await writeCloudEntitlement();
  return true;
}

/* ------------------------------ views ------------------------------ */
const root = document.getElementById("pq-app");

function renderHub() {
  const unlocked = isUnlocked();
  let cards = SETS.map(s => {
    const locked = !s.free && !unlocked;
    const best = progress.best[s.id];
    const done = progress.done[s.id];
    const badge = s.free ? '<span class="pq-tag free">FREE</span>'
      : locked ? '<span class="pq-tag lock">🔒 PRO</span>'
      : '<span class="pq-tag pro">UNLOCKED</span>';
    const meta = best != null
      ? `<span class="pq-best">${done ? "✅ Completed · " : ""}Best: ${best}/${s.questions.length}</span>`
      : `<span class="pq-best">${s.questions.length} questions</span>`;
    return `
      <div class="pq-card ${locked ? "locked" : ""}" data-set="${s.id}">
        <div class="pq-card-top"><span class="pq-emoji">${s.emoji}</span>${badge}</div>
        <h3>${s.title}</h3>
        <p>${s.subtitle}</p>
        <div class="pq-card-foot">${meta}
        ${locked
          ? `<button class="btn-3d btn-green pq-mini" data-unlock>🔒 Unlock · ₹99</button>`
          : `<button class="btn-3d ${best != null ? "btn-blue" : "btn-green"} pq-mini" data-play>▶ ${best != null ? "Play again" : "Start"}</button>`}
        </div>
      </div>`;
  }).join("");
  root.innerHTML = `
    <section class="pq-hero">
      <div>
        <p class="gp-overline">🏆 PRO VOCAB QUIZ</p>
        <h1>Sound fluent. <em>Every day.</em></h1>
        <p class="gp-sub">6 themed quiz sets · 72 questions built from the channel's winning reels — intensifiers, kitchen verbs, daily actions, animal pairs, office English and travel English. Instant feedback, timers, and scores you can share.</p>
        <p class="pq-price"><strong>Set 1 is FREE.</strong> Unlock all 6 sets for just <strong>₹99</strong> — one-time payment.</p>
      </div>
      <div class="pq-hero-side">
        <div class="pq-hero-card">
          <div class="pq-hero-emoji">🏆</div>
          <div class="pq-hero-count">72</div>
          <div class="pq-hero-label">questions · 6 sets</div>
        </div>
      </div>
    </section>
    <h2 class="gp-h2">Choose your set</h2>
    <p class="gp-help">Each set has 12 questions and a 3-minute timer.</p>
    <div class="pq-grid">${cards}</div>
    ${unlocked ? "" : `
    <section class="gp-card pq-unlock-banner">
      <h2>🔓 Unlock all 6 sets — ₹99</h2>
      <p>Pay securely on Topmate, then enter your access code here. Sign in with Google first so your unlock works on all your devices.</p>
      <div class="pq-banner-actions">
        <a class="btn-3d btn-green" href="${TOPMATE_QUIZ_LINK}" target="_blank" rel="noopener">💳 Buy on Topmate · ₹99</a>
        <button class="btn-3d btn-blue" id="pq-open-unlock">I already paid — unlock</button>
      </div>
    </section>`}`;
  wireHub();
}

function wireHub() {
  root.querySelectorAll("[data-play]").forEach(b => b.addEventListener("click", e => {
    startSet(parseInt(e.target.closest(".pq-card").dataset.set, 10));
  }));
  root.querySelectorAll("[data-unlock]").forEach(b => b.addEventListener("click", () => openUnlockModal()));
  const openBtn = document.getElementById("pq-open-unlock");
  if (openBtn) openBtn.addEventListener("click", openUnlockModal);
}

/* --------------------------- unlock modal --------------------------- */
function openUnlockModal() {
  closeUnlockModal();
  const m = document.createElement("div");
  m.id = "pq-unlock-modal";
  m.innerHTML = `
    <div class="pq-modal-box" role="dialog" aria-label="Unlock Pro Vocab Quiz">
      <button class="pq-modal-x" id="pq-x" aria-label="Close">✕</button>
      <h2>🔓 Unlock Pro Vocab Quiz</h2>
      <ol class="pq-steps">
        <li><strong>Pay ₹99 on Topmate</strong> — you'll get an access code instantly after payment.<br>
          <a class="btn-3d btn-green pq-mini" href="${TOPMATE_QUIZ_LINK}" target="_blank" rel="noopener" style="margin-top:8px;display:inline-block">💳 Buy on Topmate · ₹99</a></li>
        <li><strong>Sign in with Google</strong> (top-right button) so your unlock syncs across devices.</li>
        <li><strong>Enter your access code</strong> below.</li>
      </ol>
      <label class="pq-code-label" for="pq-code">Access code</label>
      <input id="pq-code" class="pq-code" type="text" placeholder="e.g. XXXX-XXX-0000" autocomplete="off" />
      <p class="pq-err" id="pq-code-err" hidden></p>
      <button class="btn-3d btn-blue" id="pq-verify" style="width:100%;margin-top:10px">Verify & unlock</button>
      <p class="gp-note" id="pq-signin-note" hidden>⚠️ Please sign in with Google first (button at the top-right) — it keeps your unlock safe on all devices.</p>
    </div>`;
  document.body.appendChild(m);
  m.addEventListener("click", e => { if (e.target === m) closeUnlockModal(); });
  document.getElementById("pq-x").addEventListener("click", closeUnlockModal);
  document.getElementById("pq-verify").addEventListener("click", verifyCode);
}
function closeUnlockModal() {
  const m = document.getElementById("pq-unlock-modal");
  if (m) m.remove();
}
async function sha256hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str.trim().toUpperCase()));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
async function verifyCode() {
  const input = document.getElementById("pq-code");
  const err = document.getElementById("pq-code-err");
  const note = document.getElementById("pq-signin-note");
  const code = (input.value || "").trim();
  if (!code) { err.hidden = false; err.textContent = "Please enter your access code."; return; }
  const hash = await sha256hex(code);
  if (hash !== ACCESS_CODE_SHA256) {
    err.hidden = false;
    err.textContent = "That code doesn't match. Check the access card from Topmate and try again.";
    return;
  }
  if (!signedIn()) {
    // Start Google sign-in, then finish the unlock once the user is back.
    note.hidden = false;
    pendingUnlock = code;
    if (typeof window.efSignInWithGoogle === "function") window.efSignInWithGoogle();
    waitForSignInThenUnlock(code);
    return;
  }
  await completeUnlock(code);
  closeUnlockModal();
  renderHub();
  toast("🎉 Unlocked! All 6 sets are yours.");
}
function waitForSignInThenUnlock(code) {
  let tries = 0;
  const iv = setInterval(async () => {
    tries++;
    if (signedIn()) {
      clearInterval(iv);
      pendingUnlock = false;
      await completeUnlock(code);
      closeUnlockModal();
      renderHub();
      toast("🎉 Signed in & unlocked! All 6 sets are yours.");
    } else if (tries > 90) { clearInterval(iv); pendingUnlock = false; }
  }, 1000);
}

/* ------------------------------ session ------------------------------ */
let sess = null;
function startSet(id) {
  const set = SETS.find(s => s.id === id);
  if (!set) return;
  if (!set.free && !isUnlocked()) { openUnlockModal(); return; }
  const order = set.questions.map((_, i) => i);
  shuffle(order);
  sess = { set, order: order.slice(0, 12), idx: 0, score: 0, timeLeft: SET_TIME, timer: null };
  renderQuestion();
  sess.timer = setInterval(tick, 1000);
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } }
function tick() {
  if (!sess) return;
  sess.timeLeft--;
  const el = document.getElementById("pq-time");
  if (el) el.textContent = fmtTime(sess.timeLeft);
  if (sess.timeLeft <= 0) endSet(true);
}
function fmtTime(s) { const m = Math.floor(Math.max(0, s) / 60); const r = Math.max(0, s) % 60; return m + ":" + String(r).padStart(2, "0"); }

function renderQuestion() {
  const { set, order, idx } = sess;
  const q = set.questions[order[idx]];
  const opts = q.options.map((o, i) => `
    <button class="pq-opt" data-i="${i}"><span class="pq-opt-letter">${"ABCD"[i]}</span>${o}</button>`).join("");
  root.innerHTML = `
    <div class="pq-sess-top">
      <button class="pq-quit" id="pq-quit">← Sets</button>
      <span class="pq-crumb">${set.emoji} ${set.title} · ${idx + 1}/${sess.order.length}</span>
      <span class="pq-timer" id="pq-time">⏱ ${fmtTime(sess.timeLeft)}</span>
    </div>
    <div class="pq-progress"><div class="pq-progress-fill" style="width:${(idx / sess.order.length) * 100}%"></div></div>
    <div class="pq-qcard">
      <h2>${q.q}</h2>
      <div class="pq-opts">${opts}</div>
      <div class="pq-feedback" id="pq-feedback" hidden></div>
    </div>`;
  document.getElementById("pq-quit").addEventListener("click", () => { clearInterval(sess.timer); sess = null; renderHub(); });
  root.querySelectorAll(".pq-opt").forEach(b => b.addEventListener("click", () => answer(parseInt(b.dataset.i, 10))));
}

function answer(i) {
  if (!sess || sess.answered) return;
  sess.answered = true;
  clearInterval(sess.timer);
  const q = sess.set.questions[sess.order[sess.idx]];
  const correct = i === q.answer;
  if (correct) sess.score++;
  const btns = root.querySelectorAll(".pq-opt");
  btns.forEach((b, bi) => {
    b.disabled = true;
    if (bi === q.answer) b.classList.add("right");
    else if (bi === i) b.classList.add("wrong");
  });
  const fb = document.getElementById("pq-feedback");
  fb.hidden = false;
  fb.className = "pq-feedback " + (correct ? "ok" : "bad");
  fb.innerHTML = `<strong>${correct ? "✅ Correct!" : "❌ Not quite."}</strong> ${q.why}
    <button class="btn-3d ${sess.idx + 1 < sess.order.length ? "btn-green" : "btn-blue"} pq-next" id="pq-next">${sess.idx + 1 < sess.order.length ? "Next →" : "See my score →"}</button>`;
  document.getElementById("pq-next").addEventListener("click", () => {
    sess.idx++; sess.answered = false;
    if (sess.idx >= sess.order.length) endSet(false);
    else { renderQuestion(); sess.timer = setInterval(tick, 1000); }
  });
}

function endSet(timedOut) {
  clearInterval(sess.timer);
  const { set, order, score } = sess;
  sess = null;
  const prevBest = progress.best[set.id] || 0;
  if (score > prevBest) { progress.best[set.id] = score; progress.done[set.id] = true; saveProgress(); }
  const pct = Math.round((score / order.length) * 100);
  const msg = pct === 100 ? "🏆 Perfect! You're a vocab star!" : pct >= 75 ? "🌟 Excellent work!" : pct >= 50 ? "💪 Good — keep practising!" : "📚 Nice try — replay the set to improve!";
  const shareLine = `I scored ${score}/${order.length} on "${set.title}" in English Flow's Pro Vocab Quiz! 🏆`;
  root.innerHTML = `
    <div class="pq-result">
      <div class="pq-result-emoji">${pct === 100 ? "🏆" : pct >= 50 ? "🌟" : "📚"}</div>
      <h2>${timedOut ? "⏱ Time's up!" : "Set complete!"}</h2>
      <p class="pq-score">${score}<span>/${order.length}</span></p>
      <p class="pq-msg">${msg}</p>
      <div class="pq-share">
        <input id="pq-share-line" readonly value="${shareLine}" />
        <button class="btn-3d btn-blue pq-mini" id="pq-copy">📋 Copy</button>
      </div>
      <div class="pq-result-actions">
        <button class="btn-3d btn-green" id="pq-replay">↻ Play again</button>
        <button class="btn-3d btn-blue" id="pq-sets">All sets</button>
      </div>
    </div>`;
  document.getElementById("pq-replay").addEventListener("click", () => startSet(set.id));
  document.getElementById("pq-sets").addEventListener("click", renderHub);
  document.getElementById("pq-copy").addEventListener("click", async () => {
    const inp = document.getElementById("pq-share-line");
    try { await navigator.clipboard.writeText(inp.value); toast("Copied! Share it with your friends 🎉"); }
    catch (e) { inp.select(); document.execCommand("copy"); toast("Copied!"); }
  });
}

function toast(msg) {
  let t = document.getElementById("pq-toast");
  if (!t) { t = document.createElement("div"); t.id = "pq-toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}

/* ------------------------------ boot ------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderHub();
  refreshCloudEntitlement().then(() => { if (isUnlocked()) renderHub(); });
  // ef-auth.js may restore a Google session a moment after load; re-check then.
  const watch = new MutationObserver(() => {
    if (signedIn()) { refreshCloudEntitlement().then(() => { if (isUnlocked()) renderHub(); }); }
  });
  const btn = document.getElementById("ef-auth-btn");
  if (btn) watch.observe(btn, { childList: true, subtree: true, characterData: true });
});
