# OBD2HQ Recovery Implementation Report

Generated: 2026-08-08T22:11:31.420Z

## Recovery Scope

This implementation adds recovery guards and quality reporting without bulk-removing, noindexing, redirecting or deleting URLs. Canonical host remains locked to https://www.obd2hq.com.

## Before vs After

| Metric | Before | After / Current |
|---|---:|---:|
| Sitemap URLs | 27,370 observed in live sitemap | 27370 audited |
| Index quality pass candidates | unknown | 18590 |
| Index quality fail/review candidates | unknown | 8780 |
| Gold URLs | unknown | 11900 |
| Silver URLs | unknown | 6690 |
| Thin URLs | unknown | 8745 |
| Duplicate URLs | unknown | 0 |
| Invalid URLs | unknown | 0 |
| Utility/no-ranking URLs | unknown | 35 |
| OBD codes | 2,223 | 2223 audited |
| Raw-gold OBD codes | 376 | 476 |
| Runtime fallback OBD codes | 1,847 | 1747 |
| Fallback high similarity risk | unknown | 1747 |
| Fallback codes with GSC impressions | unknown | 24 |
| Fallback codes with GSC clicks | unknown | 4 |
| Vehicle + DTC URLs | 110 | 110 audited |
| Vehicle + DTC valid | unknown | 110 |
| Vehicle + DTC unknown | unknown | 0 |
| Vehicle + DTC invalid | unknown | 0 |

## Generated Files

- reports/seo/SEO_INDEX_QUALITY.csv
- reports/seo/VEHICLE_DTC_VALIDATION.csv
- reports/seo/OBD_FALLBACK_SIMILARITY.csv
- reports/seo/GSC_TOP_100_RECOVERY.csv

## Production Changes Made

- Added canonical/domain freeze regression script.
- Added sitemap URL quality classification report.
- Added OBD fallback similarity report.
- Added vehicle-DTC applicability validation report.
- Added Top 100 GSC recovery prioritization report.
- Added recovery monitor snapshot input data.

## Safe Decisions

- No bulk 410.
- No bulk delete.
- No bulk noindex.
- No URL structure change.
- No canonical domain change.
- No mass redirect change.

## Next Manual Decision

Use SEO_INDEX_QUALITY.csv to decide which THIN/fallback code hubs should be enriched first. Do not remove them from sitemap until GSC click/impression history and content uniqueness have been reviewed.
