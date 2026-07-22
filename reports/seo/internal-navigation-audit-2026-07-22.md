# OBD2HQ Internal Navigation Audit - 2026-07-22

## Main Problems Found

- The top navigation sent "Warning Lights" to a single Toyota Camry page instead of a global warning-light hub.
- The footer had very low crawl value because it linked only a small set of generic pages.
- Related OBD code chips on symptom, problem-finder, engine and transmission pages often pointed to the noindex search page instead of indexable code hubs.
- Warning-light discovery was fragmented between model pages and brand pages without a central entry point.

## Fixes Applied

- Added a global warning-light hub at `/[locale]/warning-lights`.
- Updated desktop and mobile navigation to point to the new warning-light hub.
- Rebuilt the footer as a compact site map with diagnostic, vehicle-data, popular-code and site/legal groups.
- Added centralized navigation helpers in `src/data/navigation.ts`.
- Changed related-code links on key pages to point directly to localized code hub URLs.
- Added the new warning-light hub to sitemap output.
- Fixed the footer copyright text.

## SEO Intent Covered

- Dashboard warning lights.
- Vehicle warning lights by make/model.
- Popular OBD2 code lookup paths.
- Symptom-first diagnosis.
- Vehicle technical data, oil capacity, engine codes, transmissions, maintenance and common problems.

## Remaining Improvement Opportunities

- Add contextual "next step" blocks to make/model pages: problem finder, warning lights, oil capacity and common OBD2 codes.
- Add breadcrumbs or compact cross-link panels on older `/symptoms/[slug]` pages.
- Continue replacing old search-query links when the intent is a known code or stable hub page.
