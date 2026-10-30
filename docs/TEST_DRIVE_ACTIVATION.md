# JMC Test Drive / Lead Manager — production activation checklist

The code is deployed fail-closed by default. No public leads are accepted until ALL
required environment variables, approved policy and database provisioning exist.
Do not set TEST_DRIVE_ENABLED=true earlier.

## 1. Persistent database
Provision **managed paid PostgreSQL** on Render in Frankfurt or a vetted comparable
provider with backups, access controls and a documented retention schedule.
The existing web instance is free and its ephemeral disk is NOT a database.
Run `db/test-drive.sql` on the database using a dedicated least-privilege credential.
Verify table and indexes were created; verify a successful read/write in a restricted role.
Configure `DATABASE_URL` as a Render secret; `PG_SSL` only as appropriate for trusted
provider CA and cert chain. Never commit credentials or customer data.

## 2. Internal lead manager, before public submissions
Set:
- `DATABASE_URL`
- `LEAD_HASH_SECRET` — random 32+ bytes (separate from session secret)
- `ADMIN_PASSWORD` — unique 16+ characters, stored only as a secret
- `ADMIN_SESSION_SECRET` — random 32+ bytes
- `NEXT_PUBLIC_SITE_URL` — the exact published origin

Use `/lead-manager` for login and reviewing leads. Admin login rate limited in DB.
On access, validate HTTP-only SameSite=Strict cookie and 8-hour session; verify that
unauthorized users cannot get a CSV or change status. CSV exports contain personal data:
staff with authorization only; securely store/delete exports.

## 3. Privacy policy and consent (MUST precede activation)
Have legal/privacy owner approve and publish a specific policy identifying controller,
purposes, legal bases, processors, security measures, data retention, rights/contact,
international transfers if applicable, and any separate marketing opt-in.
Update `/privacy` from placeholder, update `consent_version` in backend to approved
version, set `PRIVACY_POLICY_VERSION`, and only then set
`PRIVACY_POLICY_APPROVED=true`.
No marketing consent should be mandatory for a Test Drive request.

## 4. Notifications
Verify a domain and sender with Resend, confirm authorized sales email recipient and
access rights, and securely configure:
- `RESEND_API_KEY`
- `RESEND_FROM` (verified email)
- `SALES_NOTIFY_TO` (authorized sales inbox)
Email failures are logged without personal data; the DB is the source of truth.
Sales must check the Lead Manager even if email provider is unavailable.

## 5. Go-live
Set `TEST_DRIVE_ENABLED=true` only after all above steps and E2E smoke tests are
approved. Check `GET /api/test-drive` returns `{"ready":true}`, test one
consented lead, verify database insert, admin workflow, notification, source UTM,
and download. Confirm user sees an acknowledgement, NOT an auto-confirmed slot.

## Zoho later
Retain UUID IDs, source/medium/campaign/content, status, optional date, created_at,
marketing opt-in; add `zoho_id` and sync state with a migration, implement
idempotent upsert and backfill. Do not send or duplicate existing leads until
authorization, processor transfer and retention policy are defined.

## Abuse and access protections
HTTP origin, content size, strict input allowlists, honeypot, IP fingerprint and phone
throttles are implemented. Consider Cloudflare Turnstile and independent edge limits
before promoting to a high-traffic public campaign. Never put PII in analytics events.

## Readiness review — 2026-10-30 (no charge / no PII enabled)
- Connected workspace: `giorgi's workspace`, service `jmc-georgia`, Frankfurt.
- No PostgreSQL instance was found in the workspace.
- Production DB choice for approval: PostgreSQL `0.1c-256mb` (Render connector alias `basic_256mb`), `diskSizeGb:1`, Frankfurt.
- Public Render pricing: **$6/month database compute + $0.30/month per GB storage**, subject to changes / billing.
- IMPORTANT: Not provisioned until the user approves the ongoing charge. Free DB would expire in 30 days and has no managed backups.
- An **internal, unapproved** Georgian privacy draft is at `docs/TEST_DRIVE_PRIVACY_DRAFT_KA.md`. Its placeholders must be filled by the legal owner. It is not public policy.
- No authorized `SALES_NOTIFY_TO` recipient or verified `RESEND_FROM` sender has been supplied; no email address may be guessed.
- After an approved paid DB exists, initialize it with `npm run db:migrate:leads` from an authorized admin environment where `DATABASE_URL` is available. This migration does **not** run on web builds.
- Capture and verify exact consent timestamp `consented_at` and version `consent_version` with a test record before public activation.
- Ensure site `/privacy` is replaced with legal-approved policy before flipping `PRIVACY_POLICY_APPROVED=true`.
- Production is intentionally `TEST_DRIVE_ENABLED=false` until all gates pass; do not enable for preview or sample data.

## Render paid DB provisioned — 2026-10-30

- **Database:** `jmc-test-drive-leads` / `dpg-dbi4ess9v7es738lu3c0-a` (PostgreSQL 18, Frankfurt, basic_256mb, 1 GB disk). This incurs the user-approved recurring charge. Check account billing for exact invoicing.
- External IP allowlist is empty (blocked). Keep it restricted; same-region Render services may connect via the **internal database URL**.
- **Lead recipient:** `g.kalandia@eastgateautomotive.ge`. Set on the JMC Render service as `SALES_NOTIFY_TO`.
- **Data controller named by business:** `Eastgate Automotive LLC`, stored in `JMC_DATA_CONTROLLER_NAME`; registration identifier and privacy/rights contact still require approval.
- **Connection is not yet wired**: Render DB connection strings are only available through the database `Connect` control or credentials-capable API/CLI. The current integration cannot retrieve the password/internal URL. Assign `DATABASE_URL` in JMC service Environment using the **internal** Postgres connection string without sharing it in chat.
- Execute `npm run db:migrate:leads` only from a trusted environment with database access; verify tables and test using non-customer fake data.
- **Email is not active:** `RESEND_API_KEY` and domain-verified `RESEND_FROM` are not configured; do not confuse the SALES_NOTIFY_TO destination with a verified sender.
- **Do not enable real submissions** until the public legal privacy policy, consent version, retention, authorized roles and production end-to-end validation are approved.
