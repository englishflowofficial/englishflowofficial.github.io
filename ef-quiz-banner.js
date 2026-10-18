/* English Flow — Pro Vocab Quiz promo bar.
   Small, late-appearing, dismissible, and self-suppressing:
   - shows only after 6s on page OR 35% scroll (whichever first), with a gentle slide-up
   - hidden for 3 days after the visitor closes it
   - NEVER shown to learners who already unlocked the quiz (ef_premium_quiz_unlocked == "1")
   Plain script: no modules, no imports, no external requests. */
(function () {
  "use strict";
  try {
    var DISMISS_KEY = "ef_quiz_banner_dismissed";
    var UNLOCK_KEY = "ef_premium_quiz_unlocked";
    var SUPPRESS_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
    var BAR_Z = 9990; // below the ef-auth sign-in pill (99990)

    function now() { return Date.now(); }
    function isUnlocked() {
      try { return window.localStorage.getItem(UNLOCK_KEY) === "1"; } catch (e) { return false; }
    }
    function recentlyDismissed() {
      try {
        var ts = parseInt(window.localStorage.getItem(DISMISS_KEY) || "0", 10);
        return ts > 0 && (now() - ts) < SUPPRESS_MS;
      } catch (e) { return false; }
    }
    function shouldShow() {
      return !isUnlocked() && !recentlyDismissed();
    }

    var STYLE_ID = "ef-quiz-banner-style";
    var BAR_ID = "ef-quiz-banner-bar";

    function injectStyle() {
      if (document.getElementById(STYLE_ID)) return;
      var css =
        "#" + BAR_ID + "{" +
          "position:fixed;left:0;right:0;bottom:0;z-index:" + BAR_Z + ";" +
          "transform:translateY(110%);transition:transform .45s cubic-bezier(.22,1,.36,1);" +
          "background:linear-gradient(135deg,#58cc02,#46a302);" +
          "color:#fff;box-shadow:0 -6px 24px rgba(70,163,2,.28);" +
          "padding:calc(9px + env(safe-area-inset-bottom,0px)) 14px 9px;" +
        "}" +
        "#" + BAR_ID + ".efqb-visible{transform:translateY(0);}" +
        "#" + BAR_ID + " .efqb-inner{" +
          "max-height:50px;overflow:hidden;" +
          "display:flex;align-items:center;gap:10px;" +
          "max-width:960px;margin:0 auto;" +
        "}" +
        "#" + BAR_ID + " .efqb-text{" +
          "flex:1;min-width:0;font-size:13.5px;font-weight:700;line-height:1.35;" +
        "}" +
        "#" + BAR_ID + " .efqb-sub{display:block;font-weight:600;opacity:.92;font-size:12px;}" +
        "#" + BAR_ID + " .efqb-cta{" +
          "flex:0 0 auto;background:#fff;color:#46a302;font-weight:900;font-size:13px;" +
          "padding:9px 16px;border-radius:999px;text-decoration:none;white-space:nowrap;" +
          "box-shadow:0 2px 0 rgba(0,0,0,.15);" +
        "}" +
        "#" + BAR_ID + " .efqb-close{" +
          "flex:0 0 auto;background:transparent;border:0;color:#fff;font-size:20px;line-height:1;" +
          "padding:6px 4px;cursor:pointer;opacity:.85;" +
        "}" +
        "#" + BAR_ID + " .efqb-close:hover{opacity:1;}" +
        "@media (min-width:720px){" +
          "#" + BAR_ID + "{" +
            "left:auto;right:20px;bottom:calc(20px + env(safe-area-inset-bottom,0px));" +
            "border-radius:18px;box-shadow:0 10px 30px rgba(70,163,2,.35);" +
            "padding:12px 10px 12px 18px;max-width:560px;" +
          "}" +
          "#" + BAR_ID + " .efqb-inner{max-height:68px;}" +
        "}";
      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.type = "text/css";
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    }

    function buildBar() {
      var bar = document.createElement("div");
      bar.id = BAR_ID;
      bar.setAttribute("role", "complementary");
      bar.setAttribute("aria-label", "Pro Vocab Quiz promotion");

      var inner = document.createElement("div");
      inner.className = "efqb-inner";

      var text = document.createElement("div");
      text.className = "efqb-text";
      text.appendChild(document.createTextNode("🏆 Pro Vocab Quiz — 72 questions · Set 1 FREE"));
      var sub = document.createElement("span");
      sub.className = "efqb-sub";
      sub.appendChild(document.createTextNode("Missing out? Unlock all 6 sets for ₹99"));
      text.appendChild(sub);

      var cta = document.createElement("a");
      cta.className = "efqb-cta";
      cta.href = "premium-quiz.html";
      cta.appendChild(document.createTextNode("Try now"));

      var close = document.createElement("button");
      close.className = "efqb-close";
      close.type = "button";
      close.setAttribute("aria-label", "Dismiss");
      close.appendChild(document.createTextNode("×"));
      close.addEventListener("click", function () {
        hide(true);
      });

      inner.appendChild(text);
      inner.appendChild(cta);
      inner.appendChild(close);
      bar.appendChild(inner);
      return bar;
    }

    var bar = null;
    var shown = false;
    var done = false; // stop timers/listeners once shown or dismissed

    function hide(permanent) {
      done = true;
      if (permanent) {
        try { window.localStorage.setItem(DISMISS_KEY, String(now())); } catch (e) { /* ignore */ }
      }
      if (bar) bar.classList.remove("efqb-visible");
      cleanup();
    }

    function show() {
      if (done || shown) return;
      if (!shouldShow()) { done = true; cleanup(); return; }
      shown = true;
      done = true;
      injectStyle();
      bar = buildBar();
      document.body.appendChild(bar);
      // Force a reflow so the slide-up transition plays.
      void bar.offsetWidth;
      requestAnimationFrame(function () {
        if (bar) bar.classList.add("efqb-visible");
      });
      cleanup();
    }

    var timer = null;
    function onScroll() {
      if (done) return;
      var el = document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      if (max > 0 && (window.scrollY / max) >= 0.35) show();
    }
    function cleanup() {
      if (timer) { clearTimeout(timer); timer = null; }
      window.removeEventListener("scroll", onScroll, { passive: true });
    }

    // If the learner unlocks mid-visit (cross-tab or ef-auth flow), hide the bar.
    function onStorage(e) {
      if (e && e.key === UNLOCK_KEY && e.newValue === "1" && bar) hide(false);
    }

    function init() {
      if (!shouldShow()) return;
      timer = setTimeout(show, 6000);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("storage", onStorage);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } catch (err) { /* never break the host page */ }
})();
