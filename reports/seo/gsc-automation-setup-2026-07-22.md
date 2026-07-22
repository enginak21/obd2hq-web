# GSC Automation Setup Check - 2026-07-22

## What is protected now

The daily `Daily GSC SEO Optimizer` workflow now requires real Search Console credentials in GitHub Actions. If the credentials are missing, the job fails instead of silently using screenshot seed data.

## Required GitHub secrets

Add these in GitHub repository settings:

- `GSC_CLIENT_EMAIL`
- `GSC_PRIVATE_KEY`
- `GSC_SITE_URL=https://obd2hq.com/`

## Required Search Console access

The service account email from `GSC_CLIENT_EMAIL` must be added to the Search Console property for `obd2hq.com`.

Recommended path:

1. Open Google Search Console.
2. Choose the `obd2hq.com` property.
3. Open Settings.
4. Open Users and permissions.
5. Add the service account email as a user.

## Current limitation

Secret values cannot be read back from GitHub, and the local machine does not have the GitHub CLI installed. The workflow itself is now the source of truth: if secrets are missing or the service account is not allowed in Search Console, the next run will fail with a clear error.

