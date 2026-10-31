#!/usr/bin/env python3
"""
Daily quiz generator for English Flow.
Uses GEMINI_API_KEY from environment (GitHub Actions secret).
Generates 2 Duolingo-style quiz HTML pages in /quizzes/,
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
    "Indian English mistakes",
    "daily office speaking",
    "tense games",
    "WhatsApp grammar fixes",
    "phrasal verbs for daily life",
    "interview English questions",
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
Rules:
- Duolingo-style: chunky 3D buttons (.btn-3d), header with 🔥 streak and ⚡ XP counters read from localStorage keys english_flow_streak (streak) and userXP (XP), plus english_flow_last_practice for the daily streak date, Flo owl mascot 🦉.
- 10 multiple-choice questions about: {topic}. Each with 2 options, correct index, and a 1-line tip.
- Results screen shows score, 'Share My Score on WhatsApp' button (https://api.whatsapp.com/send?text=...), and a 'Recommended English Resources' card linking to ../30-day-english-flow-workbook.pdf, ../resources.html, ../game-practice.html.
- SEO: title, meta description, canonical https://englishflowofficial.github.io/quizzes/{slug}.html, Open Graph tags, Twitter Card meta (summary_large_image, @EnglishFlowPodcastt), enriched JSON-LD Quiz schema with educationalAlignment, timeRequired PT5M, and hasPart Question items.
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
            link = f'<li><a href="quizzes/{slug}.html">📝 {topic.title()} Quiz — {today}</a></li>'
            if link not in html:
                # insert before closing </ul> of the quiz list section if found, else before </footer>
                if "</ul>" in html:
                    html = html.replace("</ul>", link + "\n</ul>", 1)
                else:
                    html = html.replace("</footer>", link + "\n</footer>")
        idx.write_text(html, encoding="utf-8")
        print("index.html links added")

if __name__ == "__main__":
    main()
