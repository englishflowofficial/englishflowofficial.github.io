#!/usr/bin/env python3
"""
English Flow — Google Search Console sync.

Runs on GitHub Actions (see .github/workflows/gsc-sync.yml).
Auth: service account JSON from the GSC_CREDENTIALS_JSON env var
(GitHub Actions secret). The service account must have Full permission
on the https://englishflowofficial.github.io/ property in Search Console.

Does:
  1. Submits/refreshes https://englishflowofficial.github.io/sitemap.xml
     via webmasters.sitemaps().submit
  2. Lists current sitemaps on the property
  3. Pulls search analytics for the last 28 days
     (dimensions: query, page; rowLimit: 100)
  4. Writes everything to gsc_report.json in the repo root
"""
import datetime
import json
import os
import sys

SITE_URL = "https://englishflowofficial.github.io/"
SITEMAP_URL = "https://englishflowofficial.github.io/sitemap.xml"
SCOPES = ["https://www.googleapis.com/auth/webmasters"]


def main() -> None:
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.errors import HttpError
    except ImportError:
        print("missing deps: pip install google-api-python-client google-auth",
              file=sys.stderr)
        sys.exit(2)

    raw = os.environ.get("GSC_CREDENTIALS_JSON", "").strip()
    if not raw:
        print("GSC_CREDENTIALS_JSON is not set", file=sys.stderr)
        sys.exit(1)

    info = json.loads(raw)
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

    report = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "site": SITE_URL,
    }

    # 1. Submit / refresh sitemap
    try:
        svc.sitemaps().submit(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        report["sitemap_submit"] = {"url": SITEMAP_URL, "status": "submitted"}
    except HttpError as e:
        report["sitemap_submit"] = {
            "url": SITEMAP_URL, "status": "error",
            "error": str(e)[:300],
        }

    # 2. Current sitemaps list
    try:
        sm = svc.sitemaps().list(siteUrl=SITE_URL).execute()
        report["sitemaps"] = sm.get("sitemap", [])
    except HttpError as e:
        report["sitemaps"] = {"error": str(e)[:300]}

    # 3. Search analytics, last 28 days
    end = datetime.date.today()
    start = end - datetime.timedelta(days=28)
    try:
        q = svc.searchanalytics().query(
            siteUrl=SITE_URL,
            body={
                "startDate": start.isoformat(),
                "endDate": end.isoformat(),
                "dimensions": ["query", "page"],
                "rowLimit": 100,
            },
        ).execute()
        report["search_analytics_28d"] = {
            "startDate": start.isoformat(),
            "endDate": end.isoformat(),
            "rows": q.get("rows", []),
        }
    except HttpError as e:
        report["search_analytics_28d"] = {"error": str(e)[:300]}

    with open("gsc_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print("gsc_report.json written:",
          len(report.get("search_analytics_28d", {}).get("rows", [])), "rows")


if __name__ == "__main__":
    main()
