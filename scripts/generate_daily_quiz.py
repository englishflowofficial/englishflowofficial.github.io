#!/usr/bin/env python3
"""
Daily quiz generator for English Flow.
Uses GEMINI_API_KEY from environment (GitHub Actions secret).

LOCKED-SHELL pipeline (2026-11-04, Wolla's permanent rule):
- The API model generates ONLY structured JSON *content* (title, meta,
  questions, cheat-sheet, FAQs). It NEVER writes HTML/CSS/JS.
- This script injects the validated content into LOCKED_SHELL — a verbatim
  copy of the working tell-me-about-yourself green UI template with
  {{PLACEHOLDERS}}. The HTML/CSS/JS structure can never be rewritten or
  broken by a model (this is what broke the 2026-11-03 salary-negotiation
  and presentation-openers quizzes: flash-lite used class="hidden", but
  game-practice.css has no .hidden rule, so the results screen rendered
  under Question 1).
- Validation is hard: exactly 10 questions, 2 options each, answer index
  0/1, title <=60ch, meta <=160ch, zero competitor-brand mentions. Any
  failure -> RuntimeError, nothing is written.

Auth: key sent ONLY via the x-goog-api-key header (never ?key=), because
AI Studio auth keys (AQ...., issued since May 2026) get 401 on the query
param. Key is stripped of pasted whitespace.
"""
import os, re, json, datetime, urllib.request, pathlib, html as htmlmod

GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
API_BASE = "https://generativelanguage.googleapis.com/v1beta"

ROOT = pathlib.Path(__file__).resolve().parents[1]
QUIZ_DIR = ROOT / "quizzes"
QUIZ_DIR.mkdir(exist_ok=True)

TOPICS = [
    # LOCKED 2026-11-03 (Wolla + Gemini Supreme Manager): 10 high-intent topics.
    # Ban-check: "Would someone type this into Google the night before they need it?"
    # If yes, publish. If it's a chapter from a grammar book, kill it.
    "7 polite email phrases quiz (boss-impressing workplace emails)",
    "tell me about yourself quiz (30-second interview answer)",
    "meeting small talk quiz (first 2 minutes phrases)",
    "phone call English quiz (starting and ending calls)",
    "salary negotiation phrases quiz (soft professional wording)",
    "presentation openers quiz (strong speech openings)",
    "professional apology phrases quiz (workplace apologies)",
    "networking small talk quiz (what do you do answers)",
    "client follow-up email quiz (post-meeting templates)",
    "video call confidence phrases quiz (sound confident online)",
]

# Preference order: highest reasoning/coding capability first.
# NOTE 2026-11-04: gemini-2.5-pro 404'd on generateContent despite being
# listed by models.list. IDs below were verified live in AI Studio
# (aistudio.google.com) on the account on 2026-11-04.
# Verified live 2026-11-04 via models.list on this key: gemini-4-argon and
# gemini-3.8-flash are real API IDs (probed: recognized, transient 429/503).
# PERMANENT BAN (Wolla 2026-11-04): no lite model may EVER appear here or be
# selected by any fallback path. _refuse_lite() enforces it at runtime.
MODEL_PREFS = ["gemini-4-argon", "gemini-3.8-flash", "gemini-flash-latest",
               "gemini-3.7-flash", "gemini-3.6-flash"]


def _refuse_lite(model: str):
    if "lite" in model.lower():
        raise RuntimeError(
            f"REFUSED lite model '{model}' — Wolla banned all lite models "
            "permanently (2026-11-04). Failing loud instead of generating.")

BANNED = ["duolingo", "babbel", "rosetta", "busuu", "memrise", "elsa speak",
          "cake app"]

CONTENT_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string", "maxLength": 60,
                  "description": "Page <title>: curiosity hook, MAX 60 chars incl. ' | English Flow'"},
        "meta_description": {"type": "string", "maxLength": 160,
                             "description": "Meta description, MAX 160 chars"},
        "eyebrow": {"type": "string", "maxLength": 40},
        "h1": {"type": "string", "maxLength": 90},
        "subline": {"type": "string", "maxLength": 140},
        "share_name": {"type": "string", "maxLength": 60},
        "questions": {"type": "array", "minItems": 10, "maxItems": 10,
                      "items": {"type": "object",
                                "properties": {
                                    "q": {"type": "string"},
                                    "opts": {"type": "array", "minItems": 2,
                                             "maxItems": 2,
                                             "items": {"type": "string"}},
                                    "a": {"type": "integer", "minimum": 0,
                                          "maximum": 1},
                                    "tip": {"type": "string"}},
                                "required": ["q", "opts", "a", "tip"]}},
        "cheatsheet_title": {"type": "string", "maxLength": 60},
        "cheatsheet_items": {"type": "array", "minItems": 4, "maxItems": 6,
                             "items": {"type": "object",
                                       "properties": {
                                           "rule": {"type": "string"},
                                           "example": {"type": "string"}},
                                       "required": ["rule", "example"]}},
        "cheatsheet_tip": {"type": "string", "maxLength": 160},
        "faqs": {"type": "array", "minItems": 3, "maxItems": 4,
                 "items": {"type": "object",
                           "properties": {"q": {"type": "string"},
                                          "a": {"type": "string"}},
                           "required": ["q", "a"]}},
    },
    "required": ["title", "meta_description", "questions"],
}


def api_get(path: str):
    url = f"{API_BASE}/{path}"
    req = urllib.request.Request(url, headers={"x-goog-api-key": GEMINI_KEY})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def pick_model() -> str:
    """Query models.list on the API key; return the best available model."""
    env_model = os.environ.get("GEMINI_MODEL", "").strip()
    try:
        data = api_get("models")
        available = [m["name"].replace("models/", "")
                     for m in data.get("models", [])
                     if "generateContent" in m.get("supportedGenerationMethods", [])]
    except Exception as e:
        print(f"models.list failed ({e}); using preference order blind")
        available = []
    prefs = ([env_model] if env_model else []) + MODEL_PREFS
    for p in prefs:
        _refuse_lite(p)
        if not available or p in available:
            print(f"selected model: {p}" +
                  (" (from models.list)" if available else " (list unavailable)"))
            return p
    for m in available:  # any other pro-tier model on the key
        if "lite" in m.lower():
            continue
        if "pro" in m.lower() and "tts" not in m.lower():
            print(f"selected model: {m} (pro fallback)")
            return m
    non_lite = [m for m in available if "lite" not in m.lower()]
    if not non_lite:
        raise RuntimeError("No non-lite model available — refusing to run.")
    print(f"selected model: {non_lite[0]} (first non-lite available)")
    return non_lite[0]


def call_api(model: str, body: dict, timeout: int) -> str:
    url = f"{API_BASE}/models/{model}:generateContent"
    req = urllib.request.Request(
        url, data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json",
                 "x-goog-api-key": GEMINI_KEY})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = json.loads(r.read().decode())
    return data["candidates"][0]["content"]["parts"][0]["text"]


def _is_auth_error(e: Exception) -> bool:
    s = str(e)
    return ("400" in s or "401" in s or "403" in s
            or "API key" in s or "API_KEY" in s)


def _gemini_json(prompt: str, model: str) -> dict:
    schema_note = ("\nReturn ONLY JSON matching the provided schema. "
                   "Content only — no HTML, no CSS, no JavaScript, no markdown fences.")
    full_body = {
        "contents": [{"parts": [{"text": prompt + schema_note}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": CONTENT_SCHEMA,
            "thinkingConfig": {"thinkingLevel": "HIGH"},
        },
    }
    try:
        return json.loads(call_api(model, full_body, timeout=180))
    except Exception as e:
        if _is_auth_error(e):
            raise
        print(f"grounded+structured call failed on {model} "
              f"({type(e).__name__}: {e}); retrying plain")
        plain = {"contents": [{"parts": [{"text": prompt + schema_note}]}],
                 "generationConfig": {
                     "responseMimeType": "application/json",
                     "responseSchema": CONTENT_SCHEMA,
                     "thinkingConfig": {"thinkingLevel": "HIGH"}}}
        return json.loads(call_api(model, plain, timeout=120))


def gemini_content(prompt: str, first_model: str) -> dict:
    if not GEMINI_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")
    models_to_try = [first_model] + [m for m in MODEL_PREFS
                                     if m != first_model]
    for m in models_to_try:
        _refuse_lite(m)
    last_err = None
    for model in models_to_try:
        try:
            return _gemini_json(prompt, model)
        except Exception as e:
            last_err = e
            print(f"model {model} failed: {e}")
            if _is_auth_error(e):
                raise RuntimeError(
                    "GEMINI_API_KEY was rejected by the Gemini API "
                    "(400/401/403). Replace it in the repo's GitHub Secrets "
                    "with a real AI Studio key.") from e
    raise RuntimeError(f"All models failed; last error: {last_err}")


def _banned_found(*texts: str):
    for t in texts:
        low = (t or "").lower()
        for b in BANNED:
            if b in low:
                return b
    return None


def validate_content(c: dict) -> dict:
    """Hard validation. Raises RuntimeError on any problem; returns c."""
    def need(key, typ):
        if key not in c or not isinstance(c[key], typ) or not c[key]:
            raise RuntimeError(f"content missing/invalid: {key}")
    need("title", str); need("meta_description", str); need("questions", list)
    if len(c["title"]) > 60:
        raise RuntimeError(f"title {len(c['title'])}ch > 60")
    if len(c["meta_description"]) > 160:
        raise RuntimeError(f"meta {len(c['meta_description'])}ch > 160")
    qs = c["questions"]
    if len(qs) != 10:
        raise RuntimeError(f"expected 10 questions, got {len(qs)}")
    for i, q in enumerate(qs):
        if not isinstance(q, dict):
            raise RuntimeError(f"q{i} not an object")
        for k in ("q", "opts", "a", "tip"):
            if k not in q:
                raise RuntimeError(f"q{i} missing {k}")
        if not isinstance(q["opts"], list) or len(q["opts"]) != 2 or \
                not all(isinstance(o, str) and o.strip() for o in q["opts"]):
            raise RuntimeError(f"q{i} opts must be 2 non-empty strings")
        if q["a"] not in (0, 1):
            raise RuntimeError(f"q{i} answer index must be 0/1")
        if not q["q"].strip() or not q["tip"].strip():
            raise RuntimeError(f"q{i} empty q/tip")
    blob = [c["title"], c["meta_description"], c.get("h1", ""),
            c.get("cheatsheet_title", "")]
    blob += [q["q"] + " " + " ".join(q["opts"]) + " " + q["tip"] for q in qs]
    hit = _banned_found(*blob)
    if hit:
        raise RuntimeError(f"banned brand mention in content: {hit}")
    # defaults for optional fields
    c.setdefault("eyebrow", "ENGLISH QUIZ")
    c.setdefault("h1", c["title"].replace(" | English Flow", ""))
    c.setdefault("subline", "Answer 10 quick questions. Earn 10 XP per correct answer.")
    c.setdefault("share_name", c["title"].replace(" | English Flow", "") + " Quiz")
    c.setdefault("cheatsheet_title", "Quick Study Cheat-Sheet")
    c.setdefault("cheatsheet_items",
                 [{"rule": "Read each tip after answering.",
                   "example": "The feedback explains the natural choice."}])
    c.setdefault("cheatsheet_tip",
                 "Flo-tip: Say each correct answer out loud once — speaking locks it in!")
    c.setdefault("faqs", [])
    return c


def _esc(s: str) -> str:
    return htmlmod.escape(s or "", quote=True)


def render_locked_shell(c: dict, slug: str) -> str:
    """Inject validated content into the locked shell. No model touches HTML."""
    s = LOCKED_SHELL
    s = s.replace("{{TITLE}}", _esc(c["title"]))
    s = s.replace("{{META}}", _esc(c["meta_description"]))
    s = s.replace("{{SLUG}}", slug)
    s = s.replace("{{EYEBROW}}", _esc(c["eyebrow"].upper()))
    s = s.replace("{{H1}}", _esc(c["h1"]))
    s = s.replace("{{SUBLINE}}", _esc(c["subline"]))
    s = s.replace("{{SHARE_NAME}}", _esc(c["share_name"]))
    questions_js = json.dumps(
        [{"q": q["q"], "opts": q["opts"], "a": q["a"], "tip": q["tip"]}
         for q in c["questions"]], ensure_ascii=False)
    s = s.replace("{{QUESTIONS_JS}}", questions_js)
    items = "\n".join(
        f'<li><b>{_esc(it["rule"])}</b> <i>{_esc(it["example"])}</i></li>'
        for it in c["cheatsheet_items"])
    s = s.replace("{{CHEATSHEET_ITEMS}}", items)
    s = s.replace("{{CHEATSHEET_TITLE}}", _esc(c["cheatsheet_title"]))
    s = s.replace("{{CHEATSHEET_TIP}}", _esc(c["cheatsheet_tip"]))

    url = f"https://englishflowofficial.github.io/quizzes/{slug}.html"
    quiz_ld = {
        "@context": "https://schema.org", "@type": "Quiz",
        "name": c["title"], "description": c["meta_description"],
        "url": url, "timeRequired": "PT5M",
        "educationalAlignment": [
            {"@type": "AlignmentObject", "alignmentType": "educationalLevel",
             "targetName": "Intermediate English"},
            {"@type": "AlignmentObject", "alignmentType": "educationalSubject",
             "targetName": "English as a Second Language"}],
        "provider": {"@type": "Organization", "name": "English Flow",
                     "url": "https://englishflowofficial.github.io/"},
        "hasPart": [
            {"@type": "Question", "name": q["q"],
             "acceptedAnswer": {"@type": "Answer", "text": q["opts"][q["a"]]}}
            for q in c["questions"]],
    }
    s = s.replace("{{QUIZ_JSONLD}}",
                  '<script type="application/ld+json">\n' +
                  json.dumps(quiz_ld, ensure_ascii=False, indent=2) +
                  '\n</script>')
    if c["faqs"]:
        faq_ld = {
            "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": f["q"],
                 "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
                for f in c["faqs"]],
        }
        faq_html = ('<script type="application/ld+json">\n' +
                    json.dumps(faq_ld, ensure_ascii=False, indent=2) +
                    '\n</script>')
    else:
        faq_html = ""
    s = s.replace("{{FAQ_JSONLD}}", faq_html)

    if "{{" in s:
        raise RuntimeError("unsubstituted placeholder left in shell")
    if _banned_found(s):
        raise RuntimeError("banned brand mention in rendered HTML")
    if "<html" not in s.lower():
        raise RuntimeError("rendered shell is not HTML")
    return s


PROMPT_TMPL = """You are writing quiz CONTENT (JSON only — no HTML, no CSS, no JavaScript) for English Flow (englishflowofficial.github.io), a free gamified English practice site with a Flo owl mascot.
STRICT BRAND RULE: 100% original "English Flow" branding. NEVER mention any competitor language-learning brand (no Duolingo or similar) anywhere in the content. Global audience: no India-only framing anywhere.
Topic: {topic}
Write 10 multiple-choice questions about this topic. Each: a realistic scenario question, 2 options (one natural/professional, one blunt/awkward), correct index (0 or 1), and a 1-line teaching tip. Use natural, current workplace phrasing (you may use web search for trending real-world phrases). Vary which option is correct.
- title: high-curiosity click hook, 60 characters MAXIMUM including " | English Flow" (ask a question or promise a fix).
- meta_description: 160 characters MAXIMUM with the same hook.
- eyebrow: 1-3 word section label in caps, e.g. "WORKPLACE ENGLISH".
- h1: matches the hook, with one emoji max.
- subline: one motivating line mentioning 10 XP per correct answer.
- share_name: short quiz name for the WhatsApp share text, e.g. "Salary Phrases Quiz".
- cheatsheet_title + 4-6 cheatsheet_items (rule + example each) teaching the topic plainly.
- cheatsheet_tip: one Flo-tip line.
- faqs: 3 Q&As about the topic.
These quiz slugs already exist — do not duplicate their topics: {existing_slugs}
Return ONLY the JSON object.
"""

# --- LOCKED SHELL (verbatim working template, {{PLACEHOLDERS}}) ---
# The model NEVER sees or edits this. Only render_locked_shell() touches it.
LOCKED_SHELL = """<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#58cc02" />
  <title>{{TITLE}}</title>
  <meta name="description" content="{{META}}" />
  <meta name="keywords" content="tell me about yourself, interview english, 30 second introduction, job interview phrases, interview quiz" />
  <link rel="canonical" href="https://englishflowofficial.github.io/quizzes/{{SLUG}}.html" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://englishflowofficial.github.io/quizzes/{{SLUG}}.html" />
  <meta property="og:title" content="{{TITLE}}" />
  <meta property="og:description" content="{{META}}" />
  <meta property="og:image" content="https://englishflowofficial.github.io/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@EnglishFlowPodcastt" />
    <meta name="twitter:title" content="{{TITLE}}" />
    <meta name="twitter:description" content="{{META}}" />
    <meta name="twitter:image" content="https://englishflowofficial.github.io/og-image.jpg" />
  <link rel="icon" href="../favicon.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900;1000&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../game-practice.css" />
  {{QUIZ_JSONLD}}
  <style>
    .quiz-wrap{max-width:760px;margin:0 auto;padding:24px 16px 40px}
    .q-card{border:2px solid #e5e5e5;border-radius:20px;padding:22px;background:#fff;box-shadow:0 4px 0 #e5e5e5;margin:16px 0}
    .q-card h2{font-size:20px;margin:0 0 14px}
    .opt{display:block;width:100%;text-align:left;margin:8px 0;padding:13px 16px;border:2px solid #e5e5e5;border-radius:14px;background:#fff;font-weight:800;font-size:15px;box-shadow:0 3px 0 #e5e5e5;cursor:pointer}
    .opt:active{transform:translateY(3px);box-shadow:none}
    .opt.correct{border-color:#58cc02;background:#f0fff4;box-shadow:0 3px 0 #58cc02}
    .opt.wrong{border-color:#ff4b4b;background:#fff0f0;box-shadow:0 3px 0 #ff4b4b}
    .result-card{border:2px solid #e5e5e5;border-radius:20px;padding:28px;text-align:center;background:linear-gradient(135deg,#f0fff4,#eff8ff)}
    .resource-card{border:2px solid #ffc800;border-radius:18px;padding:18px;background:#fffbe6;margin-top:18px;text-align:left}
  </style>
{{FAQ_JSONLD}}
</head>
<body>
  <header class="gp-header">
    <a class="gp-brand" href="../index.html">🦉 English <b>Flow</b></a>
    <nav class="gp-nav"><a href="../index.html">Home</a><a href="../game-practice.html">Practice</a><a href="../tenses.html">Tenses</a></nav>
    <div class="gp-stats">
      <span class="gp-stat streak">🔥 <b id="st-streak">0</b></span>
      <span class="gp-stat xp">⚡ <b id="st-xp">0</b></span>
    </div>
  </header>

  <main class="quiz-wrap">
    <p style="font-weight:1000;letter-spacing:1.5px;color:#1cb0f6;font-size:13px">🌍 {{EYEBROW}}</p>
    <h1 style="font-size:30px;font-weight:1000;margin:0 0 8px">{{H1}}</h1>
    <p style="color:#777;font-weight:700">{{SUBLINE}}</p>
    <div style="display:flex;gap:10px;align-items:center;margin:12px 0">
      <div style="flex:1;height:12px;background:#eee;border-radius:999px;overflow:hidden"><div id="progress" style="height:100%;width:0;background:#58cc02;border-radius:999px;transition:width .3s"></div></div>
      <b id="counter">1 / 10</b>
    </div>

    <div id="quiz"></div>

    <div id="results" hidden>
      <div class="result-card">
        <div style="font-size:52px">🦉</div>
        <h2 id="score-title" style="margin:8px 0">You scored 0/10!</h2>
        <p id="score-msg" style="color:#555;font-weight:700"></p>
        <p style="font-weight:900">🔥 Streak: <span id="final-streak">0</span> days · ⚡ XP: <span id="final-xp">0</span></p>
        <a id="wa-share" onclick="if(window.gtag)gtag('event','whatsapp_share',{page_path:location.pathname})" href="#" target="_blank" rel="noopener" class="btn-3d btn-green" style="display:inline-block;text-decoration:none;margin:8px 4px">Share My Score on WhatsApp</a>
        <button class="btn-3d btn-blue" onclick="location.reload()" style="margin:8px 4px">Play Again</button>
        <div class="resource-card">
          <h3 style="margin:0 0 8px">📚 Recommended English Resources</h3>
          <p style="margin:0 0 10px;color:#555;font-weight:700;font-size:14px">Keep the momentum. Flo recommends:</p>
          <ul style="margin:0;padding-left:18px;font-weight:700;font-size:14px">
            <li>🦉 Keep going: <a onclick="if(window.gtag)gtag('event','resource_cta_click',{page_path:location.pathname})" href="interview-english-2026-11-01.html">Interview English Quiz</a> and <a onclick="if(window.gtag)gtag('event','resource_cta_click',{page_path:location.pathname})" href="presentation-openers-quiz-strong-speech-openings-2026-11-03.html">Presentation Openers Quiz</a> — speak with confidence everywhere.</li>
            <li><a onclick="if(window.gtag)gtag('event','workbook_download',{page_path:location.pathname})" href="https://topmate.io/speak_english_with_confidence/2324225">Get the 30-Day Speaking Workbook ($) →</a> – the 30-day speaking blueprint</li>
            <li><a onclick="if(window.gtag)gtag('event','workbook_download',{page_path:location.pathname})" href="../30-day-english-flow-workbook.pdf">30-Day English Flow Workbook (PDF)</a> – daily speaking drills</li>
            <li><a onclick="if(window.gtag)gtag('event','resource_cta_click',{page_path:location.pathname})" href="../resources.html">Free Resources Library</a> – trackers, podcasts, worksheets</li>
            <li><a onclick="if(window.gtag)gtag('event','resource_cta_click',{page_path:location.pathname})" href="../game-practice.html">Daily Practice Session</a> – keep your streak alive</li>
          </ul>
        </div>
      </div>
    </div>

    <section class="study-cheatsheet" aria-label="Quick study guide" style="margin:26px 0;padding:20px;border:2px dashed #1cb0f6;border-radius:18px;background:#f7fdff;text-align:left">
<h2>📖 {{CHEATSHEET_TITLE}}</h2>
<ul>
{{CHEATSHEET_ITEMS}}
</ul>
<p style="font-size:13px;color:#777;font-weight:700;margin:10px 0 0">{{CHEATSHEET_TIP}}</p>
</section>
  </main>

<script>
const QUESTIONS = {{QUESTIONS_JS}};
let idx=0, score=0;
let xp = parseInt(localStorage.getItem('userXP'))||0;
let streak = parseInt(localStorage.getItem('english_flow_streak'))||0;
function renderStats(){document.getElementById('st-streak').textContent=streak;document.getElementById('st-xp').textContent=xp;}
function renderQ(){
  const box=document.getElementById('quiz'); box.innerHTML='';
  document.getElementById('counter').textContent=(idx+1)+' / '+QUESTIONS.length;
  document.getElementById('progress').style.width=(idx/QUESTIONS.length*100)+'%';
  if(idx>=QUESTIONS.length){showResults();return;}
  const item=QUESTIONS[idx];
  const card=document.createElement('div'); card.className='q-card';
  card.innerHTML='<h2>'+item.q+'</h2>';
  item.opts.forEach((o,i)=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=o;
    b.onclick=()=>answer(b,i,item); card.appendChild(b);
  });
  const tip=document.createElement('p'); tip.style.cssText='color:#777;font-size:13px;font-weight:700'; tip.textContent='🦉 Flo tip: native speakers notice this one a lot.';
  card.appendChild(tip); box.appendChild(card);
}
function answer(btn,i,item){
  const opts=[...document.querySelectorAll('.opt')]; opts.forEach(b=>b.disabled=true);
  if(i===item.a){btn.classList.add('correct');score++;xp+=10;}
  else{btn.classList.add('wrong');opts[item.a].classList.add('correct');}
  localStorage.setItem('userXP',xp); renderStats();
  const f=document.createElement('p'); f.style.cssText='font-weight:800;color:#1cb0f6'; f.textContent='💡 '+item.tip;
  btn.closest('.q-card').appendChild(f);
  const n=document.createElement('button'); n.className='btn-3d btn-green'; n.style.marginTop='12px'; n.textContent= idx===QUESTIONS.length-1 ? 'See results →' : 'Next →';
  n.onclick=()=>{idx++;renderQ();}; btn.closest('.q-card').appendChild(n);
}
function showResults(){
  document.getElementById('quiz').hidden=true;
  document.getElementById('results').hidden=false;
  document.getElementById('progress').style.width='100%';
  // streak bump once per completion
  const today=new Date().toDateString(); const last=localStorage.getItem('english_flow_last_practice');
  if(last!==today){streak+=1;localStorage.setItem('english_flow_streak',streak);localStorage.setItem('english_flow_last_practice',today);}
  renderStats();
  document.getElementById('score-title').textContent='You scored '+score+'/'+QUESTIONS.length+'!';
  document.getElementById('final-streak').textContent=streak;
  document.getElementById('final-xp').textContent=xp;
  const msg= score===10?'Perfect! Native-level polish. 🏆': score>=7?'Great job! Almost there.':'Good start — play again to fix them all!';
  document.getElementById('score-msg').textContent=msg;
  const text=encodeURIComponent('I scored '+score+'/'+QUESTIONS.length+' on the {{SHARE_NAME}} on English Flow! 🦉 Can you beat me? https://englishflowofficial.github.io/quizzes/{{SLUG}}.html');
  document.getElementById('wa-share').href='https://api.whatsapp.com/send?text='+text;
}
renderStats(); renderQ();
</script>
<script src="../ef-analytics.js" defer></script>
</body>
</html>
"""


def slugify(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:60]


def main():
    model = pick_model()
    today = datetime.date.today().isoformat()
    existing_slugs = ", ".join(sorted(p.stem for p in QUIZ_DIR.glob("*.html")))
    # pick 2 topics by day-of-year rotation
    doy = datetime.date.today().timetuple().tm_yday
    chosen = [TOPICS[(doy * 2 + i) % len(TOPICS)] for i in range(2)]
    created = []
    for topic in chosen:
        slug = slugify(topic)  # evergreen slug, no date suffix (2026-11-10)
        if (QUIZ_DIR / f"{slug}.html").exists():
            print(f"skip: quizzes/{slug}.html already exists (evergreen slug)")
            continue
        prompt = PROMPT_TMPL.format(topic=topic,
                                    existing_slugs=existing_slugs or "none yet")
        content = gemini_content(prompt, model)
        content = validate_content(content)
        html = render_locked_shell(content, slug)
        out = QUIZ_DIR / f"{slug}.html"
        out.write_text(html, encoding="utf-8")
        created.append((slug, content["title"]))
        print(f"created quizzes/{slug}.html")

    # update sitemap.xml
    sm = ROOT / "sitemap.xml"
    if sm.exists():
        xml = sm.read_text(encoding="utf-8")
        for slug, _ in created:
            loc = f"https://englishflowofficial.github.io/quizzes/{slug}.html"
            if loc not in xml:
                entry = f"""  <url>
    <loc>{loc}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
"""
                xml = xml.replace("</urlset>", entry + "</urlset>")
        sm.write_text(xml, encoding="utf-8")
        print("sitemap.xml updated")

    # link new pages in index.html (append to quiz list, do not restyle)
    idx = ROOT / "index.html"
    if idx.exists():
        html = idx.read_text(encoding="utf-8")
        for slug, title in created:
            short = title.replace(" | English Flow", "")
            link = (f'<a class="btn-3d btn-green" href="quizzes/{slug}.html" '
                    f'style="display:inline-block;text-decoration:none;margin:4px 6px 4px 0">'
                    f'📝 NEW: {htmlmod.escape(short)}</a>')
            if f'quizzes/{slug}.html' not in html:
                anchor = '<p class="eyebrow">🧠 LATEST QUIZZES</p>'
                if anchor in html:
                    html = html.replace(anchor, anchor + "\n          " + link, 1)
        idx.write_text(html, encoding="utf-8")
        print("index.html links added")


if __name__ == "__main__":
    main()
