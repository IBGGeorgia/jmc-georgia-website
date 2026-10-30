# JMC Georgia — Verified Render Production handoff (2026-10-30)

This is an **operational checklist**, not permission to delete production data or enable customer submissions. The approved privacy contact is **compliance@ibg.ge**. Test Drive retention is **12 calendar months since last substantive lead update**.

## Read-only evidence verified in Render

| Resource | Verified status |
| --- | --- |
| Workspace | `giorgi's workspace` (`tea-db5vg3rbc2fs73a95e20`), explicitly confirmed by the owner |
| Web service | `jmc-georgia`, `srv-dbge2kflk1mc73dq4lpg` |
| Repository | `IBGGeorgia/jmc-georgia-website`, branch `main`, auto-deploy on commit |
| Region | Frankfurt, Germany |
| Last live deploy | `a6c265a69d9a7df0edcb70bf5937eef876ac3a9a`, `dep-dbi89bbncjis73an3cp0`, successful 2026-10-30 11:52:18 UTC |
| Database | `jmc-test-drive-leads`, `dpg-dbi4ess9v7es738lu3c0-a`, PostgreSQL 18, Frankfurt, `basic_256mb`, available |
| External network | Database IP allowlist empty; **preserve this secure restriction** |
| Cron jobs | No retention Cron Job appeared in the Render services inventory during review; schedule remains unconfigured or unverified |
| Data read | Render connector's direct read-only DB queries are blocked by the empty allowlist. Do not weaken allowlist just for MCP reads |
| App readiness | Source code rejects submissions without approved privacy flags, verified scheduler setting and a retention heartbeat within 36 hours |

## Step 1 — Establish legal and backup readiness

- Confirm the exact Georgian legal entity name, identification code and data-controller responsibility from the official business register (current website identifies `Eastgate Automotive LLC`; exact registered details not independently verified).
- Complete legal review of draft PR #44 and ascertain any required processor/subprocessor and international-transfer disclosures.
- Confirm the usable backup/restore process. Paid Render Postgres offers recovery, but actual recovery-window/backup availability and backup retention **must be inspected in the database Recovery UI** before scheduling deletion. Avoid storing sensitive logical exports on unmanaged devices.
- Confirm staff handling of opt-out and data-subject requests sent to `compliance@ibg.ge`.

## Step 2 — Verify production schema without opening database access

1. Sign in to the authorized CMS account and open `https://jmc-georgia.onrender.com/admin/settings`.
2. Inspect **მონაცემთა ბაზის მიგრაცია** and **12-თვიანი შენახვა**. These are read-only checks against the internal PostgreSQL connection. The settings screen shows no DB credentials or individual customer data.
3. If schema is not updated, perform the idempotent migration `npm run db:migrate:leads` **from an authorized service that has internal database access**, after approved backup and change window. Running the migration is a separate production change, not automatically performed by a deployment.
4. Refresh Settings. The retention-health table and `retention_hold_until` column should now show ready.

## Step 3 — Provision the daily retention job after schema/backup verification

The current connected management API does not expose existing service environment variable **values**, and we cannot securely transfer the internal database URL from the web service. Do **not** send `DATABASE_URL` or any secret in chat or commit it to GitHub.

In Render Dashboard, create a **Cron Job** with:

- Service name: `jmc-lead-retention-daily`
- Same workspace and **Frankfurt** region as the Postgres database
- GitHub source: `IBGGeorgia/jmc-georgia-website`, branch `main`
- Runtime: Node
- Build: `npm install --no-audit --no-fund`
- Command: `node scripts/render-retention-cron.mjs` (**safe staged entrypoint**: no database access, no changes and an explicit PAUSED log until both private DATABASE_URL and JMC_RETENTION_EXECUTION_ENABLED=true are configured)
- Schedule: `0 3 * * *` (**03:00 UTC = 07:00 in Tbilisi**), once daily
- Internal `DATABASE_URL`: securely copy into this Cron Job's Environment settings from Render Postgres **Connect → Internal** (or use a managed Render Environment Group). Do not use the external URL or change the database IP allowlist.
- `JMC_RETENTION_EXECUTION_ENABLED=true`: for **this Cron Job only** after backup, migration and deletion preview have been reviewed.
- `PG_SSL`: only configure based on a verified working database TLS setup; the current app uses strict certificate verification when `PG_SSL=true`, which may not work with internal self-signed Render certificates.

**Caution:** a Render Cron Job incurs compute charges, with a published minimum of USD $1 per month per cron service. Obtain billing authorization before provisioning.

The paid Cron service may be created **before** legal/data-retention readiness. Its first runs intentionally log `JMC_RETENTION_PAUSED` without touching PostgreSQL. This is not equivalent to a functioning retention schedule; CMS Settings remains closed until successful execution + a verified fresh DB heartbeat. Do not set the execution flag until migration, backups, first dry-run review, and legal approvals are complete.

Before the first **executing** run, use a trusted internal connection to run `npm run db:retention:leads -- --dry-run` and review the eligible count. The dry-run never updates the success heartbeat. A successful `--execute` run writes only the count and timestamp to `jmc_lead_retention_health` and never logs names/phones.

After the first scheduled run succeeds, verify Render Cron Run history and CMS Settings and set `RETENTION_SCHEDULE_CONFIRMED=true` on the **web service** only. This flag is not a substitute for the real heartbeat; stale/missing runs automatically block new submissions.

## Step 4 — Legal publication & Test Drive intake

1. Publish the legally approved, fully fact-checked policy at `/privacy`, replacing the current holding page. Retention period: 12 months; official contact: compliance@ibg.ge.
2. Select and record the exact version `PRIVACY_POLICY_VERSION` and keep the consent copy consistent.
3. Only after all prior checks and the operational readiness review: set `PRIVACY_POLICY_APPROVED=true` and `TEST_DRIVE_ENABLED=true` in the **web service** through Render Environment.
4. Test one controlled, consented production application, confirm in authorized CMS Lead Inbox, and verify that analytics events contain no personal identifiers.
5. Confirm public `GET /api/test-drive` returns `{"ready":true}`; on any failure, revert `TEST_DRIVE_ENABLED=false`. Never use actual customer data as disposable tests.

## References

- Render Cron documentation: https://render.com/docs/cronjobs
- Render internal database connections: https://render.com/docs/postgresql-creating-connecting
- Render Postgres Recovery: https://render.com/docs/postgresql-backups
- Georgian privacy law: https://matsne.gov.ge/ka/document/view/5827307

## Read-only Production schema diagnostics on every successful app startup

The web service `npm run start` now invokes `prestart`:
`node scripts/production-readiness-probe.mjs`. This uses the **existing web
service's internal** `DATABASE_URL`, never creates or deletes rows, and
**must not** block the public website when the database is unavailable.

Render app startup logs show three deliberately PII-free records:
- `JMC_PRODUCTION_SCHEMA: db=connected leads=true legal_hold=true heartbeat=true`;
- `JMC_RETENTION_PREVIEW: total=… eligible=… protected=…; read-only; no records changed`;
- `JMC_RETENTION_HEARTBEAT: ever_run=… fresh=…`.

These reveal only schema flags and aggregate counts, never customers, contact details,
database URLs or keys. Use Render's **JMC Web Service → Logs** after deployment,
not the externally firewalled database connection, to verify the actual Production
schema before planning a migration.

**No production cleanup is authorized by these logs.** If `legal_hold=false`
or `heartbeat=false`, check recovery/backup readiness before performing the
idempotent migration using the authorized internal database connection. The
paid Cron remains in status-only mode until independent legal and backup review.

## Verified 2026-10-30 Production schema deficiency and safe one-time fix

At 12:37:36 UTC, the read-only web start probe on actual paid PostgreSQL reported:
`JMC_PRODUCTION_SCHEMA: db=connected leads=true legal_hold=false heartbeat=false`.
The basic leads table works, but the two 12-month retention additions are absent.

The one-time migration script `scripts/apply-retention-schema-once.mjs` is
**disabled by default**. It runs at `npm prestart` only when the Render web
service environment has `JMC_RETENTION_SCHEMA_MIGRATION_ONCE=true`. The script
uses a bounded transaction, advisory lock, limited lock/statement timeouts,
and performs **only** `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`
and `CREATE TABLE IF NOT EXISTS` for the retention objects. It neither reads
customer records nor deletes/updates them. It is idempotent; failures roll
back and do not prevent the public site from booting. Next, the read-only
probe prints the verified resulting schema status.

Before enabling that variable, verify the real recovery point or logical
export in the authorized Render Postgres **Recovery** tab. Render documents
automatic PITR on paid databases, but this alone does not independently prove
that a specific restore point has been tested.

Once a backup is verified, execute with a deliberate Render environment update,
watch the web service's new deploy logs for
`JMC_RETENTION_MIGRATION_OK` and
`JMC_PRODUCTION_SCHEMA: db=connected leads=true legal_hold=true heartbeat=true`,
then **remove or set `JMC_RETENTION_SCHEMA_MIGRATION_ONCE=false`**.
The script must not be left configured to execute on every restart.

This migration does **not** activate the Cron cleanup or Test Drive intake.
Those remain subject to the independent privacy, backup, and operational gates.
