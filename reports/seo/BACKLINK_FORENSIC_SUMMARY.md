# OBD2HQ Backlink Forensic Summary

Audit date: 2026-08-09

Scope: git history, repository SEO/backlink reports, local Codex attachment history, GitHub PR/issue search patterns, and live public backlink surfaces recorded in the repository.

No backlink was deleted. No PR was closed. No disavow file was created or submitted.

## Evidence Reviewed

- Local backlink planning/report files:
  - `reports/seo/backlink-authority-kit-2026-07-22.md`
  - `reports/seo/direct-backlinks-2026-07-22.md`
  - `reports/seo/link-assets-2026-07-22.md`
- Git commits from 2026-07-20 through 2026-07-26.
- GitHub PR API and PR file diffs for:
  - `iDoka/awesome-canbus#60`
  - `Marcin214/awesome-automotive#17`
- GitHub search patterns:
  - `Add OBD2HQ`
  - `OBD2HQ diagnostic`
  - `OBD2HQ resources`
  - `obd2hq.com`
- Repository-wide search patterns:
  - `backlink`, `outreach`, `forum`, `comment`, `directory`, `guest post`, `bookmark`, `disavow`.

## Backlink Timeline

| Date | Discovered backlink actions | Notes |
|---|---:|---|
| 2026-07-20 | 0 | No backlink placement evidence found. |
| 2026-07-21 | 0 | No backlink placement evidence found. |
| 2026-07-22 | 7 | Backlink authority kit, GitHub resource index, direct placements report, 2 GitHub PRs, DataHub, Kaggle, owned GitHub resource surfaces. |
| 2026-07-23 | 0 | No new backlink placement evidence found. |
| 2026-07-24 | 0 | No new backlink placement evidence found. |
| 2026-07-25 | 0 | No new backlink placement evidence found. |
| 2026-07-26 | 0 | No new backlink placement evidence found. |

Created 15-31 July 2026: 7 discovered backlink/citation actions.

Created 20-26 July 2026: 7 discovered backlink/citation actions.

## GitHub PR Detail

### iDoka/awesome-canbus#60

- Source: `https://github.com/iDoka/awesome-canbus/pull/60`
- Title: `Add OBD2HQ diagnostic resources`
- Created: 2026-07-22 19:11:35 UTC
- Status: closed, not merged
- Purpose: add OBD2HQ to the OBD-II tools section as a multilingual diagnostic resource hub.
- File changed: `README.md`
- Added link destination: `https://obd2hq.com/en/resources`
- Anchor text: `OBD2HQ`
- Added description: multilingual OBD2 diagnostic resources with open DTC, warning-light, first-check checklist datasets, and an embeddable lookup widget.
- Classification: LEGITIMATE OUTREACH
- Risk: MEDIUM
- Reason: relevant repository and branded anchor, but unsolicited resource-list PR and same-day backlink timing.

### Marcin214/awesome-automotive#17

- Source: `https://github.com/Marcin214/awesome-automotive/pull/17`
- Title: `Add OBD2HQ diagnostic resources`
- Created: 2026-07-22 19:13:11 UTC
- Status: open, not merged at audit time
- Purpose: add OBD2HQ to the Vehicle Diagnostics section as a multilingual diagnostic resource hub.
- File changed: `readme.md`
- Added link destination: `https://obd2hq.com/en/resources`
- Anchor text: `OBD2HQ`
- Added description: multilingual OBD2 diagnostic resources with DTC lookup, dashboard warning-light data, first-check checklists, and an embeddable lookup widget.
- Classification: LEGITIMATE OUTREACH
- Risk: MEDIUM
- Reason: relevant repository and branded anchor, but near-duplicate template and same-day timing.

## Similar PR / Issue Search Result

Found:

- 2 GitHub PRs with matching or near-matching title/text:
  - `iDoka/awesome-canbus#60`
  - `Marcin214/awesome-automotive#17`

Not found:

- No GitHub Issues using the checked `OBD2HQ` patterns.
- No evidence of dozens of duplicated PRs.
- No evidence of forum comments, blog comments, profile links, bookmark-site campaigns, wiki edits, guest posts, paid directories, or automated backlink services in the repository/Codex history search.

## Counts

TOTAL DISCOVERED BACKLINK ACTIONS: 7

GITHUB PR: 2

GITHUB ISSUE: 0

DIRECTORY: 0

FORUM: 0

COMMENT: 0

PROFILE: 0

GUEST POST: 0

OTHER: 5

AUTOMATED: 2

MANUAL: 5

CREATED 20-26 JULY: 7

LOW RISK: 5

MEDIUM RISK: 2

HIGH RISK: 0

CRITICAL: 0

## Collapse Correlation

Question: Could this backlink campaign plausibly have contributed to the 23-25 July Google visibility collapse?

Answer: Possible as a minor trust/noise signal, but unlikely to be the primary cause.

Confidence: LOW-MEDIUM

Evidence that supports possible contribution:

- The backlink/resource push happened on 2026-07-22, immediately before the 2026-07-23 to 2026-07-25 visibility collapse window.
- Two GitHub PRs used highly similar title/body language within about two minutes.
- Public PR pages and fork surfaces can be crawled even when PRs are not merged.

Evidence against it being the main cause:

- Only 7 backlink/citation actions were discovered.
- No evidence of large-scale automated backlink spam.
- No evidence of forum/comment/profile spam, paid link packages, mass directories, or exact-match anchor abuse.
- The GitHub PRs target relevant automotive/developer resource lists and use branded anchor text.
- DataHub/Kaggle/owned GitHub surfaces are relevant open-data/resource citations.
- The stronger timing and technical-risk evidence remains the canonical/domain churn, indexable URL churn, and programmatic-content quality changes around the same dates.

## Recommended Action

- Do not delete backlinks now.
- Do not close the open GitHub PR now.
- Do not submit a disavow file now.
- Freeze new off-page/link-building submissions for 21-28 days.
- Do not reuse the `Add OBD2HQ diagnostic resources` template on more repositories.
- Future outreach should use fewer, highly relevant targets and custom, editorial language.
- Future external links should use the canonical `https://www.obd2hq.com/...` destination when possible.
- Monitor Google Search Console Links weekly for unexpected new domains.
- If a maintainer marks a PR as spam, handle it calmly and manually; do not mass-delete historical records.
