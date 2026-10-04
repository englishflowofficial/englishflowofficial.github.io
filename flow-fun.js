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

  var MOODS = ["idle", "happy", "cheer", "sad", "talk", "think", "wave"];
  function setMood(el, mood, ms) {
    if (!el) return;
    MOODS.forEach(function (m) { el.classList.remove("is-" + m); });
    void el.offsetWidth; // restart the animation
    el.classList.add("is-" + (mood || "idle"));
    clearTimeout(el._ffTimer);
    if (ms) el._ffTimer = setTimeout(function () { setMood(el, el.getAttribute("data-mascot-rest") || "idle"); }, ms);
  }
  function mount(el) {
    if (!el || el._ffMounted) return el;
    el._ffMounted = true;
    el.classList.add("ff-mascot");
    el.insertAdjacentHTML("afterbegin", mascotSVG());
    setMood(el, el.getAttribute("data-mascot") || "idle");
    return el;
  }
  function create(mood, extraClass) {
    var el = doc.createElement("span");
    el.setAttribute("data-mascot", mood || "idle");
    if (extraClass) el.className = extraClass;
    return mount(el);
  }
  function mountAll(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll("[data-mascot]"), mount);
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
