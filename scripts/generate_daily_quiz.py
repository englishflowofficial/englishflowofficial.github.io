#!/usr/bin/env python3
"""
Daily quiz generator for English Flow.
Uses GEMINI_API_KEY from environment (GitHub Actions secret).

Pro-tier generation pipeline (2026-11-03):
- Runtime models.list on the API key -> picks the highest-capability
  generateContent model available (prefers gemini-2.5-pro), so the key's
  best model is always used without hardcoding.
- Google Search grounding (google_search tool) so lessons pull real,
  current workplace phrasing.
- Structured JSON output (response_schema) so the HTML extracts cleanly
  every time; falls back to plain-text + fence stripping if the
  full-featured call fails.
- Auth: key sent ONLY via the x-goog-api-key header (never ?key=), because
  AI Studio auth keys (AQ...., issued since May 2026) get 401 on the query
  param. Key is stripped of pasted whitespace.

Safe design:
- Never touches index.html styling, Flo mascot, or core CSS.
- Only inserts new quiz cards into the existing quiz list section.
- Keeps localStorage streak/XP mechanics (userXP, english_flow_streak).
- Every page includes WhatsApp share + Recommended Resources card.
"""
import os, re, json, datetime, urllib.request, urllib.parse, pathlib

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
MODEL_PREFS = ["gemini-2.5-pro", "gemini-flash-latest", "gemini-2.5-flash",
               "gemini-flash-lite-latest"]

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string",
                  "description": "The page <title>, a curiosity hook under 60 chars"},
        "meta_description": {"type": "string",
                             "description": "Meta description under 160 chars"},
        "html": {"type": "string",
                 "description": "The COMPLETE standalone HTML quiz page"},
    },
    "required": ["html"],
}


def api_get(path: str):
    # Auth keys (AQ...., issued by AI Studio since May 2026) are rejected
    # with 401 when passed as ?key= — they require the x-goog-api-key header.
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
        if not available or p in available:
            print(f"selected model: {p}" +
                  (" (from models.list)" if available else " (list unavailable)"))
            return p
    for m in available:  # any other pro-tier model on the key
        if "pro" in m.lower() and "tts" not in m.lower():
            print(f"selected model: {m} (pro fallback)")
            return m
    print(f"selected model: {available[0]} (first available)")
    return available[0]


def call_api(model: str, body: dict, timeout: int) -> str:
    url = f"{API_BASE}/models/{model}:generateContent"
    req = urllib.request.Request(
        url, data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json",
                 "x-goog-api-key": GEMINI_KEY})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = json.loads(r.read().decode())
    return data["candidates"][0]["content"]["parts"][0]["text"]


def extract_html(text: str) -> str:
    """Pull the HTML out of a model response (JSON schema or raw)."""
    try:
        return json.loads(text)["html"]
    except Exception:
        html = re.sub(r"^```html\s*", "", text.strip())
        return re.sub(r"\s*```$", "", html).strip()


def _is_auth_error(e: Exception) -> bool:
    # With a fixed valid request body, 400/401/403 all mean the key is bad.
    s = str(e)
    return ("400" in s or "401" in s or "403" in s
            or "API key" in s or "API_KEY" in s)


def _gemini_once(prompt: str, model: str) -> str:
    schema_note = ("\nReturn ONLY JSON with keys title, meta_description, html. "
                   "The html value must be the complete standalone HTML page, "
                   "no markdown fences.")
    full_body = {
        "contents": [{"parts": [{"text": prompt + schema_note}]}],
        "tools": [{"google_search": {}}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": RESPONSE_SCHEMA,
        },
    }
    try:
        return extract_html(call_api(model, full_body, timeout=180))
    except Exception as e:
        if _is_auth_error(e):
            raise
        print(f"grounded+structured call failed on {model} "
              f"({type(e).__name__}: {e}); retrying plain")
        plain = {"contents": [{"parts": [{"text": prompt}]}]}
        return extract_html(call_api(model, plain, timeout=120))


def gemini(prompt: str, first_model: str) -> str:
    if not GEMINI_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")
    models_to_try = [first_model] + [m for m in MODEL_PREFS
                                     if m != first_model]
    last_err = None
    for model in models_to_try:
        try:
            return _gemini_once(prompt, model)
        except Exception as e:
            last_err = e
            print(f"model {model} failed: {e}")
            if _is_auth_error(e):
                raise RuntimeError(
                    "GEMINI_API_KEY was rejected by the Gemini API "
                    "(400/401/403). The secret value is not a valid API key "
                    "— replace it in the repo's GitHub Secrets with a real "
                    "AI Studio key.") from e
    raise RuntimeError(f"All models failed; last error: {last_err}")

PROMPT_TMPL = """You are writing a standalone HTML quiz page for English Flow (englishflowofficial.github.io).
STRICT BRAND RULE: 100% original "English Flow" branding. NEVER mention any competitor language-learning brand (no Duolingo or similar) in visible text, code, comments, meta tags, or schemas. Global audience: no India-only framing anywhere.
Rules:
- Gamified English Flow style: chunky 3D buttons (.btn-3d), header with 🔥 streak and ⚡ XP counters read from localStorage keys english_flow_streak (streak) and userXP (XP), plus english_flow_last_practice for the daily streak date, Flo owl mascot 🦉.
- 10 multiple-choice questions about: {topic}. Each with 2 options, correct index, and a 1-line tip. Use natural, current workplace phrasing (you may use web search for trending real-world phrases).
- <title> MUST be a high-curiosity click hook under 60 chars (ask a question or promise a fix, e.g. "Do vs Does: The 2-Minute Grammar Fix"). Meta description under 160 chars with the same hook. <h1> matches the hook.
- Results screen shows score, 'Share My Score on WhatsApp' button (https://api.whatsapp.com/send?text=...), and a 'Recommended English Resources' card linking to ../30-day-english-flow-workbook.pdf, ../resources.html, ../game-practice.html, AND https://topmate.io/speak_english_with_confidence/2324225 with button text "Get the 30-Day Speaking Workbook ($) \\u2192".
- Below the quiz add a crawlable <section class="study-cheatsheet"> with a "Quick Study Cheat-Sheet" <h2>: 4-6 bullet rules with <i>examples</i> teaching the topic in plain HTML (no JS) so Google indexes rich text.
- SEO: title, meta description, canonical https://englishflowofficial.github.io/quizzes/{slug}.html, Open Graph tags, Twitter Card meta (summary_large_image, @EnglishFlowPodcastt), robots index,follow, viewport, enriched JSON-LD Quiz schema with educationalAlignment, timeRequired PT5M, hasPart Question items for ALL 10 questions, PLUS a JSON-LD FAQPage block with 3 topic Q&As.
- Reference ../game-practice.css for styling. Keep it a single self-contained HTML file with inline quiz JS.
- TITLE/META TEMPLATES (pick the one that fits the topic):
  T1 "Fix Mistakes": <title>Fix These [N] [Topic] Mistakes in 2 Minutes | English Flow Quiz</title> / meta: "Fix [N] common [Topic] mistakes in 2 minutes. Tap tactile 3D cards, earn XP with Flo the owl, and learn the natural fix with instant feedback."
  T2 "Scenario Phrases": <title>[N] Natural Phrases for [Scenario] (Not Textbook English) | English Flow</title> / meta: "Stop sounding blunt or awkward. Practice [N] real-world [Scenario] phrases with interactive 3D cards and earn XP with Flo."
  T3 "Speed Challenge": <title>[N]-Second English Speaking Challenge: Can You Beat Flo? | English Flow</title> / meta: "Test your speaking reflexes in this [N]-question 3D challenge. Earn streak XP with Flo and see if you can top the leaderboard."
- The 'Recommended English Resources' card MUST link https://topmate.io/speak_english_with_confidence/2324225 with button text "Get the 30-Day Speaking Workbook ($) \\u2192".
- These quiz slugs already exist — do not duplicate their topics: {existing_slugs}
Topic: {topic}
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
        slug = f"{slugify(topic)}-{today}"
        prompt = PROMPT_TMPL.format(topic=topic, slug=slug,
                                    existing_slugs=existing_slugs or "none yet")
        html = gemini(prompt, model)
        if "<html" not in html.lower():
            raise RuntimeError(f"Model returned non-HTML for topic: {topic}")
        out = QUIZ_DIR / f"{slug}.html"
        out.write_text(html, encoding="utf-8")
        created.append((slug, topic))
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
        for slug, topic in created:
            link = f'<a class="btn-3d btn-green" href="quizzes/{slug}.html" style="display:inline-block;text-decoration:none;margin:4px 6px 4px 0">📝 {topic.title()} Quiz</a>'
            if link not in html:
                anchor = '<p class="eyebrow">🧠 LATEST QUIZZES</p>'
                if anchor in html:
                    html = html.replace(anchor, anchor + "\n          " + link, 1)
        idx.write_text(html, encoding="utf-8")
        print("index.html links added")

if __name__ == "__main__":
    main()
