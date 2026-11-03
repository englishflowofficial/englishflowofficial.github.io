#!/usr/bin/env python3
"""
Daily quiz generator for English Flow.
Uses GEMINI_API_KEY from environment (GitHub Actions secret).
Generates 2 gamified quiz HTML pages in /quizzes/,
updates sitemap.xml, and appends links to index.html quiz section.

Safe design:
- Never touches index.html styling, Flo mascot, or core CSS.
- Only inserts new quiz cards into the existing quiz list section.
- Keeps localStorage streak/XP mechanics (userXP, userStreak).
- Every page includes WhatsApp share + Recommended Resources card.
"""
import os, re, json, datetime, urllib.request, urllib.parse, pathlib

GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = os.environ.get("GEMINI_MODEL", "gemini-flash-latest")
API = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

ROOT = pathlib.Path(__file__).resolve().parents[1]
QUIZ_DIR = ROOT / "quizzes"
QUIZ_DIR.mkdir(exist_ok=True)

TOPICS = [
    # 2026-11-03 EMERGENCY RETARGET (Wolla): BAN broad textbook topics
    # ('articles', 'conditionals', 'tenses' compete against big dictionary sites).
    # Target SPECIFIC, high-intent practical problems instead.
    "polite email phrases quiz (could you please, following up, circling back)",
    "job interview self-introduction quiz (tell me about yourself answers)",
    "small talk starters quiz (weekend, hobbies, conversation openers)",
    "meeting phrases quiz (sharing opinions, disagreeing politely, summarizing)",
    "presentation English quiz (signposting: moving on, turning to, to sum up)",
    "customer service English quiz (handling complaints, apologizing professionally)",
    "telephone English quiz (taking messages, asking to hold, confirming details)",
    "apologizing professionally quiz (sorry for the delay, owning mistakes)",
    "giving feedback politely quiz (constructive phrases, sandwich method)",
    "social invitations quiz (inviting, accepting, declining gracefully)",
]

def gemini(prompt: str) -> str:
    if not GEMINI_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set")
    body = {"contents": [{"parts": [{"text": prompt}]}]}
    url = API + "?key=" + urllib.parse.quote(GEMINI_KEY)
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.loads(r.read().decode())
    return data["candidates"][0]["content"]["parts"][0]["text"]

PROMPT_TMPL = """You are writing a standalone HTML quiz page for English Flow (englishflowofficial.github.io).
STRICT BRAND RULE: 100% original "English Flow" branding. NEVER mention any competitor language-learning brand (no Duolingo or similar) in visible text, code, comments, meta tags, or schemas. Global audience: no India-only framing anywhere.
Rules:
- Gamified English Flow style: chunky 3D buttons (.btn-3d), header with 🔥 streak and ⚡ XP counters read from localStorage keys english_flow_streak (streak) and userXP (XP), plus english_flow_last_practice for the daily streak date, Flo owl mascot 🦉.
- 10 multiple-choice questions about: {topic}. Each with 2 options, correct index, and a 1-line tip.
- <title> MUST be a high-curiosity click hook under 60 chars (ask a question or promise a fix, e.g. "Do vs Does: The 2-Minute Grammar Fix"). Meta description under 160 chars with the same hook. <h1> matches the hook.
- Results screen shows score, 'Share My Score on WhatsApp' button (https://api.whatsapp.com/send?text=...), and a 'Recommended English Resources' card linking to ../30-day-english-flow-workbook.pdf, ../resources.html, ../game-practice.html, AND https://topmate.io/speak_english_with_confidence/2324225 (Premium 30-Day Fluency Program).
- Below the quiz add a crawlable <section class="study-cheatsheet"> with a "Quick Study Cheat-Sheet" <h2>: 4-6 bullet rules with <i>examples</i> teaching the topic in plain HTML (no JS) so Google indexes rich text.
- SEO: title, meta description, canonical https://englishflowofficial.github.io/quizzes/{slug}.html, Open Graph tags, Twitter Card meta (summary_large_image, @EnglishFlowPodcastt), robots index,follow, viewport, enriched JSON-LD Quiz schema with educationalAlignment, timeRequired PT5M, hasPart Question items for ALL 10 questions, PLUS a JSON-LD FAQPage block with 3 topic Q&As.
- Reference ../game-practice.css for styling. Keep it a single self-contained HTML file with inline quiz JS.
- Output ONLY the full HTML, no markdown fences.
Topic: {topic}
"""

def slugify(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:60]

def main():
    today = datetime.date.today().isoformat()
    # pick 2 topics by day-of-year rotation
    doy = datetime.date.today().timetuple().tm_yday
    chosen = [TOPICS[(doy * 2 + i) % len(TOPICS)] for i in range(2)]
    created = []
    for topic in chosen:
        slug = f"{slugify(topic)}-{today}"
        prompt = PROMPT_TMPL.format(topic=topic, slug=slug)
        html = gemini(prompt)
        # strip accidental markdown fences
        html = re.sub(r"^```html\s*", "", html).strip()
        html = re.sub(r"\s*```$", "", html).strip()
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

