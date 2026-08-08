# Recovery Implementation Final Report

Generated: 2026-08-08T22:48:47.713Z

## Scope

- Removed news routing changed so active news slugs are the only dynamic params; historical/nonexistent news slugs resolve as 404 after deployment.
- News Safe Mode now enforces max 3 master articles per UTC calendar day, not per script run.
- Sitemap code hubs now require verified raw Gold or GSC demand signal.
- Utility/trust pages remain crawlable but are removed from ranking sitemap surface.
- Canonical domain and URL architecture were not changed.

## Before -> After

- PUBLIC URLs: 27370 -> 27370
- INDEXABLE URLs: 18590 -> 18595
- SITEMAP URLs: 27370 -> 18595

- GOLD: 11900 -> 11900
- SILVER: 6690 -> 6695
- THIN: 8745 -> 8740

- SITEMAP QUALITY FAIL: 8780 -> 0
- REMOVED NEWS 200: 1145 -> 0 expected after deploy
- REMOVED NEWS 404: 0 -> 1190 expected URL variants

- VERIFIED GOLD: 476 -> 476
- FALLBACK: 1747 -> 1747
- FALLBACK IN SITEMAP BEFORE: 8735
- FALLBACK IN SITEMAP AFTER: 0

- BROKEN INTERNAL LINKS: static sitemap/news policy check required via check:sitemap-quality
- HREFLANG ERRORS: no URL architecture/hreflang architecture change; live reciprocal crawl not performed by this script

## Post-fix Sitemap Classification

- GOLD: 11900
- SILVER: 6695

## News Daily Limit

- Real max master/calendar day: 3 UTC master articles.
- Maximum translated URL output from those 3 masters: 15 locale URLs/day.

## DTC Score Correction

- DTC quality score now uses a weighted 0-100 information-gain formula instead of an unbounded additive total.
- Batch 01 + 02 validation was rerun after score correction: 100/100 PASS.
