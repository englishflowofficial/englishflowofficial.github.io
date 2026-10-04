/* English Flow — shared "fun layer".
   Flo the mascot, confetti, header streak/XP chip, floating helper and scroll reveals.
   Purely additive: it never removes page content, and every feature fails silently. */
(function () {
  "use strict";
  var doc = document;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var jsdom = /jsdom/i.test(navigator.userAgent || "");

  /* ---------- fonts (Nunito = friendly, rounded, professional) ---------- */
  if (!doc.querySelector('link[href*="family=Nunito"]') && doc.head) {
    var font = doc.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap";
    doc.head.appendChild(font);
  }

  /* ---------- Flo, the mascot ---------- */
  var uid = 0;
  function mascotSVG() {
    var id = "ffg" + (++uid);
    return '' +
      '<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EE022"/><stop offset="1" stop-color="#58CC02"/></linearGradient></defs>' +
      '<ellipse class="ff-shadow" cx="60" cy="123" rx="30" ry="5" fill="rgba(0,0,0,.10)"/>' +
      '<g class="ff-body">' +
        '<g class="ff-feet"><ellipse cx="47" cy="114" rx="9" ry="5" fill="#FF9600"/><ellipse cx="73" cy="114" rx="9" ry="5" fill="#FF9600"/></g>' +
        '<path class="ff-wing ff-wing-l" d="M22 70 C8 72 6 92 20 98 C26 90 28 80 22 70Z" fill="#58A700"/>' +
        '<path class="ff-wing ff-wing-r" d="M98 70 C112 72 114 92 100 98 C94 90 92 80 98 70Z" fill="#58A700"/>' +
        '<path d="M60 18 C88 18 102 40 102 70 C102 98 84 114 60 114 C36 114 18 98 18 70 C18 40 32 18 60 18Z" fill="url(#' + id + ')"/>' +
        '<ellipse cx="60" cy="88" rx="26" ry="20" fill="#D7FFB8" opacity=".9"/>' +
        '<g class="ff-tuft"><path d="M52 22 C48 10 54 4 58 6 C56 12 57 17 60 21Z" fill="#58A700"/><path d="M60 21 C62 8 70 6 72 10 C67 13 65 17 64 22Z" fill="#89E219"/></g>' +
        '<g class="ff-brows"><path class="ff-brow-l" d="M36 38 Q44 33 52 37" stroke="#3B7A00" stroke-width="3.5" fill="none" stroke-linecap="round"/><path class="ff-brow-r" d="M68 37 Q76 33 84 38" stroke="#3B7A00" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>' +
        '<g class="ff-eyes">' +
          '<circle cx="45" cy="52" r="13" fill="#fff"/><circle cx="75" cy="52" r="13" fill="#fff"/>' +
          '<g class="ff-pupils"><circle cx="47" cy="54" r="6.5" fill="#3C3C3C"/><circle cx="77" cy="54" r="6.5" fill="#3C3C3C"/><circle cx="49.5" cy="51" r="2.2" fill="#fff"/><circle cx="79.5" cy="51" r="2.2" fill="#fff"/></g>' +
        '</g>' +
        '<ellipse cx="33" cy="68" rx="6" ry="3.5" fill="#FF8FB1" opacity=".75"/><ellipse cx="87" cy="68" rx="6" ry="3.5" fill="#FF8FB1" opacity=".75"/>' +
        '<g class="ff-beak"><path class="ff-beak-top" d="M53 64 L67 64 L60 72Z" fill="#FFB020"/><path class="ff-beak-bottom" d="M55 70 L65 70 L60 76Z" fill="#FF9600"/></g>' +
        '<path class="ff-tear" d="M36 64 C33 70 34 74 37 74 C40 74 41 70 36 64Z" fill="#6FD3FF"/>' +
      '</g>' +
      '<g class="ff-stars"><path d="M14 30 l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#FFC800"/><path d="M100 18 l2 5 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1z" fill="#1CB0F6"/><path d="M106 56 l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#FF4B4B"/></g>' +
      '</svg>';
  }

  function mayaSVG() {
    return '' +
      '<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<ellipse class="ff-shadow" cx="60" cy="123" rx="30" ry="5" fill="rgba(0,0,0,.10)"/>' +
      '<g class="ff-body">' +
        '<path d="M38 90 C34 105 32 118 36 122 C44 123 76 123 84 122 C88 118 86 105 82 90 Z" fill="#58CC02"/>' +
        '<path d="M48 90 L60 102 L72 90 Z" fill="#ffffff"/>' +
        '<rect x="54" y="78" width="12" height="15" rx="4" fill="#FAD0B1"/>' +
        '<ellipse cx="60" cy="56" rx="26" ry="27" fill="#FFDFBA"/>' +
        '<path d="M32 50 C28 75 32 86 38 88 C40 76 40 60 40 50 Z" fill="#3D2314"/>' +
        '<path d="M88 50 C92 75 88 86 82 88 C80 76 80 60 80 50 Z" fill="#3D2314"/>' +
        '<ellipse cx="44" cy="63" rx="5" ry="3" fill="#FF8FB1" opacity=".75"/>' +
        '<ellipse cx="76" cy="63" rx="5" ry="3" fill="#FF8FB1" opacity=".75"/>' +
        '<g class="ff-eyes">' +
          '<circle cx="48" cy="53" r="5" fill="#3C3C3C"/>' +
          '<circle cx="72" cy="53" r="5" fill="#3C3C3C"/>' +
          '<circle cx="49.5" cy="51.5" r="1.8" fill="#ffffff"/>' +
          '<circle cx="73.5" cy="51.5" r="1.8" fill="#ffffff"/>' +
        '</g>' +
        '<g class="ff-brows">' +
          '<path d="M42 45 Q48 42 54 45" stroke="#3D2314" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
          '<path d="M66 45 Q72 42 78 45" stroke="#3D2314" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<path d="M53 64 Q60 72 67 64" stroke="#D35A38" stroke-width="3" fill="#ffffff" stroke-linecap="round"/>' +
        '<path d="M34 50 C36 30 50 20 60 20 C70 20 84 30 86 50 C80 38 68 36 60 38 C52 36 40 38 34 50 Z" fill="#4A2E1B"/>' +
        '<circle cx="33" cy="30" r="10" fill="#4A2E1B"/>' +
        '<circle cx="87" cy="30" r="10" fill="#4A2E1B"/>' +
        '<path d="M31 52 C26 24 94 24 89 52" stroke="#1CB0F6" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<rect x="26" y="47" width="8" height="18" rx="4" fill="#0094D8"/>' +
        '<rect x="86" y="47" width="8" height="18" rx="4" fill="#0094D8"/>' +
        '<g class="ff-wing ff-wing-r">' +
          '<path d="M82 94 C94 92 104 80 102 70 C96 68 90 76 86 86 Z" fill="#58CC02"/>' +
          '<circle cx="102" cy="70" r="7" fill="#FFDFBA"/>' +
        '</g>' +
        '<g class="ff-wing ff-wing-l">' +
          '<path d="M38 94 C28 98 22 106 28 114 C36 114 40 104 40 96 Z" fill="#58CC02"/>' +
          '<rect x="18" y="100" width="16" height="20" rx="3" fill="#FFC800" transform="rotate(-12 18 100)"/>' +
        '</g>' +
      '</g>' +
      '<g class="ff-stars"><path d="M14 26 l2 5 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1z" fill="#FFC800"/><path d="M102 20 l2 5 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1z" fill="#1CB0F6"/></g>' +
      '</svg>';
  }

  function leoSVG() {
    return '' +
      '<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<ellipse class="ff-shadow" cx="60" cy="123" rx="30" ry="5" fill="rgba(0,0,0,.10)"/>' +
      '<g class="ff-body">' +
        '<path d="M36 90 C32 105 30 118 34 122 C42 123 78 123 86 122 C90 118 88 105 84 90 Z" fill="#FF9600"/>' +
        '<path d="M52 94 L52 110" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path d="M68 94 L68 110" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path d="M44 112 Q60 116 76 112 L74 122 L46 122 Z" fill="#E07C00" opacity=".6"/>' +
        '<rect x="54" y="78" width="12" height="15" rx="4" fill="#F0C29E"/>' +
        '<ellipse cx="60" cy="56" rx="25" ry="26" fill="#FAD0B1"/>' +
        '<ellipse cx="44" cy="63" rx="4.5" ry="2.5" fill="#FF8FB1" opacity=".6"/>' +
        '<ellipse cx="76" cy="63" rx="4.5" ry="2.5" fill="#FF8FB1" opacity=".6"/>' +
        '<g class="ff-eyes">' +
          '<circle cx="48" cy="53" r="5" fill="#2B201A"/>' +
          '<circle cx="72" cy="53" r="5" fill="#2B201A"/>' +
          '<circle cx="49.5" cy="51.5" r="1.8" fill="#ffffff"/>' +
          '<circle cx="73.5" cy="51.5" r="1.8" fill="#ffffff"/>' +
        '</g>' +
        '<g class="ff-brows">' +
          '<path d="M42 44 Q48 40 54 44" stroke="#2B201A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          '<path d="M66 43 Q72 39 78 43" stroke="#2B201A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<path d="M51 63 Q60 74 69 63 Z" fill="#D35A38"/>' +
        '<path d="M54 64 Q60 67 66 64 Z" fill="#ffffff"/>' +
        '<path d="M34 50 C32 30 42 16 60 16 C78 16 88 30 86 50 C80 34 76 30 60 30 C44 30 40 34 34 50 Z" fill="#2B201A"/>' +
        '<circle cx="42" cy="24" r="8" fill="#2B201A"/>' +
        '<circle cx="58" cy="20" r="9" fill="#2B201A"/>' +
        '<circle cx="74" cy="24" r="8" fill="#2B201A"/>' +
        '<path d="M39 92 L39 122" stroke="#4B3A00" stroke-width="5" stroke-linecap="round" opacity=".8"/>' +
        '<g class="ff-wing ff-wing-r">' +
          '<path d="M84 94 C96 92 106 82 102 70 C96 68 90 78 88 88 Z" fill="#FF9600"/>' +
          '<circle cx="102" cy="70" r="7" fill="#FAD0B1"/>' +
          '<path d="M102 65 L102 58 Q105 58 105 65 Z" fill="#FAD0B1" stroke="#E07C00" stroke-width="1.5"/>' +
        '</g>' +
        '<g class="ff-wing ff-wing-l">' +
          '<path d="M36 94 C26 98 22 108 26 116 C34 116 38 106 38 96 Z" fill="#FF9600"/>' +
          '<circle cx="25" cy="114" r="6" fill="#FAD0B1"/>' +
        '</g>' +
      '</g>' +
      '<g class="ff-stars"><path d="M104 50 l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#FF9600"/></g>' +
      '</svg>';
  }

  function elenaSVG() {
    return '' +
      '<svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<ellipse class="ff-shadow" cx="60" cy="123" rx="30" ry="5" fill="rgba(0,0,0,.10)"/>' +
      '<g class="ff-body">' +
        '<path d="M36 90 C32 105 30 118 34 122 C42 123 78 123 86 122 C90 118 88 105 84 90 Z" fill="#CE82FF"/>' +
        '<path d="M52 90 L60 106 L68 90 Z" fill="#F4E5FF"/>' +
        '<rect x="54" y="78" width="12" height="15" rx="4" fill="#FAD0B1"/>' +
        '<ellipse cx="60" cy="56" rx="25" ry="26" fill="#FFDFBA"/>' +
        '<path d="M30 46 C24 72 28 92 36 96 C40 84 38 64 38 46 Z" fill="#6B3A1C"/>' +
        '<path d="M90 46 C96 72 92 92 84 96 C80 84 82 64 82 46 Z" fill="#6B3A1C"/>' +
        '<ellipse cx="43" cy="64" rx="4.5" ry="2.5" fill="#FF8FB1" opacity=".7"/>' +
        '<ellipse cx="77" cy="64" rx="4.5" ry="2.5" fill="#FF8FB1" opacity=".7"/>' +
        '<g class="ff-eyes">' +
          '<circle cx="48" cy="53" r="4.5" fill="#2B201A"/>' +
          '<circle cx="72" cy="53" r="4.5" fill="#2B201A"/>' +
          '<circle cx="49.5" cy="51.5" r="1.6" fill="#ffffff"/>' +
          '<circle cx="73.5" cy="51.5" r="1.6" fill="#ffffff"/>' +
        '</g>' +
        '<circle cx="48" cy="53" r="10" stroke="#CE82FF" stroke-width="3" fill="none"/>' +
        '<circle cx="72" cy="53" r="10" stroke="#CE82FF" stroke-width="3" fill="none"/>' +
        '<path d="M58 53 L62 53" stroke="#CE82FF" stroke-width="3"/>' +
        '<g class="ff-brows">' +
          '<path d="M41 40 Q47 37 53 40" stroke="#6B3A1C" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
          '<path d="M67 40 Q73 37 79 40" stroke="#6B3A1C" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<path d="M53 65 Q60 72 67 65" stroke="#C2492D" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M32 46 C34 26 48 18 60 18 C72 18 86 26 88 46 C80 32 68 28 60 30 C50 28 40 32 32 46 Z" fill="#7D4422"/>' +
        '<g class="ff-wing ff-wing-r">' +
          '<path d="M84 94 C96 90 108 84 106 74 C98 72 92 80 88 88 Z" fill="#CE82FF"/>' +
          '<ellipse cx="106" cy="74" rx="6" ry="5" fill="#FFDFBA" transform="rotate(-20 106 74)"/>' +
        '</g>' +
        '<g class="ff-wing ff-wing-l">' +
          '<path d="M36 94 C26 98 22 108 26 116 C34 116 38 106 38 96 Z" fill="#CE82FF"/>' +
          '<circle cx="25" cy="114" r="6" fill="#FFDFBA"/>' +
        '</g>' +
      '</g>' +
      '<g class="ff-stars"><path d="M102 18 l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#CE82FF"/></g>' +
      '</svg>';
  }

  var MOODS = ["idle", "happy", "cheer", "sad", "talk", "think", "wave"];
  function setMood(el, mood, ms) {
    if (!el) return;
    MOODS.forEach(function (m) { el.classList.remove("is-" + m); });
    void el.offsetWidth;
    el.classList.add("is-" + (mood || "idle"));
    clearTimeout(el._ffTimer);
    if (ms) el._ffTimer = setTimeout(function () { setMood(el, el.getAttribute("data-mascot-rest") || "idle"); }, ms);
  }
  function mount(el) {
    if (!el || el._ffMounted) return el;
    el._ffMounted = true;
    var charType = el.getAttribute("data-character") || "flo";
    el.classList.add("ff-mascot", "ff-char-" + charType);
    if (charType === "maya") {
      el.insertAdjacentHTML("afterbegin", mayaSVG());
    } else if (charType === "leo") {
      el.insertAdjacentHTML("afterbegin", leoSVG());
    } else if (charType === "elena") {
      el.insertAdjacentHTML("afterbegin", elenaSVG());
    } else {
      el.insertAdjacentHTML("afterbegin", mascotSVG());
    }
    setMood(el, el.getAttribute("data-mascot") || el.getAttribute("data-mood") || "idle");
    return el;
  }
  function create(moodOrChar, extraClass) {
    var el = doc.createElement("span");
    if (moodOrChar === "maya" || moodOrChar === "leo" || moodOrChar === "elena") {
      el.setAttribute("data-character", moodOrChar);
      el.setAttribute("data-mascot", "idle");
    } else {
      el.setAttribute("data-mascot", moodOrChar || "idle");
    }
    if (extraClass) el.className = extraClass;
    return mount(el);
  }
  function mountAll(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll("[data-mascot], [data-character]"), mount);
  }

  /* ---------- confetti ---------- */
  function confetti(amount, host) {
    if (reduced || jsdom) return;
    var canvas = doc.createElement("canvas"), ctx;
    try { ctx = canvas.getContext("2d"); } catch (e) { return; }
    if (!ctx) return;
    canvas.className = "ff-confetti";
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    (host || doc.querySelector("dialog[open]") || doc.body).appendChild(canvas);
    var colors = ["#58CC02", "#1CB0F6", "#FFC800", "#FF4B4B", "#CE82FF", "#FF9600"];
    var bits = [];
    for (var i = 0; i < (amount || 120); i++) {
      bits.push({ x: canvas.width * (0.2 + Math.random() * 0.6), y: canvas.height * 0.35, vx: (Math.random() - 0.5) * 16, vy: -6 - Math.random() * 11,
        w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, c: colors[i % colors.length], a: Math.random() * 6, s: (Math.random() - 0.5) * 0.4 });
    }
    var frame = 0;
    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bits.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += 0.34; p.vx *= 0.99; p.a += p.s; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      if (++frame < 120) requestAnimationFrame(draw); else canvas.remove();
    })();
  }

  /* ---------- floating "+XP" style pop ---------- */
  function pop(text, x, y, tone) {
    if (jsdom) return;
    var el = doc.createElement("div");
    el.className = "ff-pop" + (tone ? " ff-pop-" + tone : "");
    el.textContent = text;
    el.style.left = (x == null ? window.innerWidth / 2 : x) + "px";
    el.style.top = (y == null ? window.innerHeight / 2 : y) + "px";
    (doc.querySelector("dialog[open]") || doc.body).appendChild(el);
    setTimeout(function () { el.remove(); }, 1300);
  }

  /* ---------- progress snapshot (shared with the practice room) ---------- */
  function snapshot() {
    var out = { xp: 0, gems: 0, streak: 0, done: 0, today: false };
    try {
      var s = JSON.parse(localStorage.getItem("english_flow_practice_v2") || "null");
      if (!s) return out;
      out.xp = +s.xp || 0; out.gems = +s.gems || 0; out.done = Object.keys(s.completed || {}).length;
      var key = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
      var d = new Date(); d.setHours(12);
      var act = s.activity || {};
      out.today = !!act[key(d)];
      if (!out.today) d.setDate(d.getDate() - 1);
      while (act[key(d)] && out.streak < 5000) { out.streak++; d.setDate(d.getDate() - 1); }
    } catch (e) { /* storage blocked: zeros are fine */ }
    return out;
  }

  /* ---------- header chip: 🔥 streak · ⚡ XP on every page ---------- */
  function headerChip() {
    var header = doc.querySelector(".site-header");
    if (!header || header.querySelector(".ff-chip")) return;
    var s = snapshot();
    var chip = doc.createElement("a");
    chip.href = "practice.html";
    chip.className = "ff-chip" + (s.today ? " is-lit" : "");
    chip.setAttribute("aria-label", s.streak + " day streak and " + s.xp + " XP. Open practice");
    chip.innerHTML = '<span class="ff-chip-fire" aria-hidden="true">🔥</span><b>' + s.streak + '</b><span class="ff-chip-sep" aria-hidden="true"></span><span aria-hidden="true">⚡</span><b>' + s.xp + "</b>";
    var cta = header.querySelector(".header-cta");
    if (cta) header.insertBefore(chip, cta); else header.appendChild(chip);
  }

  /* ---------- floating Flo helper with tips (content pages only) ---------- */
  var TIPS = [
    "Say <b>“I agree”</b> — never “I am agree”. 💚",
    "<b>“How’s it going?”</b> is the friendliest everyday hello.",
    "Need a second? Try <b>“Let me think about that.”</b>",
    "<b>Bored</b> = how you feel. <b>Boring</b> = the thing. 😉",
    "One lesson a day keeps your streak alive! 🔥",
    "<b>“Could I get…?”</b> sounds friendlier than “I want…”.",
    "Mistakes are just practice in disguise. Keep going! ✨",
    "Two minutes of practice beats zero minutes. Tap me! 🚀"
  ];
  function helper() {
    if (doc.body.classList.contains("practice-page") || doc.querySelector(".ff-helper") || jsdom) return;
    try { if (sessionStorage.getItem("ff_helper_closed")) return; } catch (e) { /* ignore */ }
    var s = snapshot();
    var wrap = doc.createElement("div");
    wrap.className = "ff-helper";
    wrap.innerHTML = '<div class="ff-bubble" role="status"><button type="button" class="ff-bubble-close" aria-label="Hide Flo">×</button><p></p><a class="ff-btn ff-btn-green ff-btn-sm" href="practice.html">' + (s.done ? "Keep my streak 🔥" : "Start in 2 min →") + "</a></div>";
    var flo = create("wave", "ff-helper-flo");
    flo.setAttribute("role", "button"); flo.setAttribute("tabindex", "0"); flo.setAttribute("aria-label", "Flo the mascot. Show another tip");
    flo.setAttribute("data-mascot-rest", "idle");
    wrap.appendChild(flo);
    doc.body.appendChild(wrap);
    var p = wrap.querySelector("p"), i = Math.floor(Math.random() * TIPS.length);
    function tip() { p.innerHTML = '<small>FLO’S TIP</small>' + TIPS[i % TIPS.length]; i++; }
    tip();
    setTimeout(function () { wrap.classList.add("is-in"); setMood(flo, "wave", 1800); }, 1200);
    function next() { tip(); wrap.classList.add("is-open"); setMood(flo, "happy", 900); }
    flo.addEventListener("click", next);
    flo.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } });
    wrap.querySelector(".ff-bubble-close").addEventListener("click", function () {
      wrap.classList.remove("is-open"); wrap.classList.add("is-mini");
      try { sessionStorage.setItem("ff_helper_closed", "1"); } catch (e) { /* ignore */ }
    });
    setTimeout(function () { if (!wrap.classList.contains("is-mini")) wrap.classList.add("is-open"); }, 2600);
  }

  /* ---------- gentle scroll reveals ---------- */
  function reveals() {
    if (reduced || jsdom || !("IntersectionObserver" in window)) return;
    var targets = doc.querySelectorAll("main > section, .ff-reveal");
    if (!targets.length) return;
    doc.documentElement.classList.add("ff-anim");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("ff-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(targets, function (t, n) { if (n === 0) t.classList.add("ff-in"); io.observe(t); });
    // Safety net: never leave content hidden.
    setTimeout(function () { Array.prototype.forEach.call(targets, function (t) { t.classList.add("ff-in"); }); }, 4000);
  }

  window.FlowFun = { mount: mount, mountAll: mountAll, create: create, mood: setMood, confetti: confetti, pop: pop, snapshot: snapshot };

  function init() { mountAll(); headerChip(); helper(); reveals(); }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();
})();
