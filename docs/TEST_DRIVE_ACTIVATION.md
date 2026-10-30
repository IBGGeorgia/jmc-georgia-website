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
