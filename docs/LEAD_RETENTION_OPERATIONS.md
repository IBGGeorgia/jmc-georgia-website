# JMC Georgia — Test Drive retention operations

**Approved business rule (2026-10-30):** retain Test Drive requests for **12 calendar months from the last substantive communication / status update**, reflected in `updated_at`. `created_at` and `updated_at` are initially set on insertion, and `updated_at` is refreshed by sales status / notes changes. An authorized, documented legal preservation exception may be set using `retention_hold_until`.

**Contact:** compliance@ibg.ge.

## Setup before public intake
1. Apply `npm run db:migrate:leads` to production only after the usual backup and change approval. This safely adds a nullable `retention_hold_until` column and an index.
2. Inspect the source of all existing leads. Do not perform a first live deletion without reviewing dry-run counts, retention claims, legal holds and backups.
3. Use a dedicated daily scheduler in the **same authorized Render workspace and database** (or equivalent trusted job runner). Set secure `DATABASE_URL`, `PG_SSL` as required and `JMC_RETENTION_EXECUTION_ENABLED=true` only for that maintenance job.
4. Command: `npm run db:retention:leads -- --execute`. Do not put secrets in command arguments, URL parameters, logs or a GitHub Actions repository.
5. Confirm daily success logs contain only deletion counts; alert on missed or failed runs. The job handles up to 20,000 expired leads each day, and can be rerun for larger backlogs. The job does **not** run automatically just because this code is deployed.
6. Review backup snapshot retention, infrastructure logs, export files and any downstream CRM copies against the approved deletion rule before enabling intake.
7. Marketing consent evidence is subject to separate statutory retention requirements and must not be used for campaigns until a compliant opt-out, revocation log and retention process are implemented. The existing JMC site has no enabled marketing distribution integration.

## Dry run

```bash
npm run db:retention:leads -- --dry-run
```

This prints an eligible count only and does not write data.

## Guarded deletion

```bash
JMC_RETENTION_EXECUTION_ENABLED=true npm run db:retention:leads -- --execute
```

Use **only** after the real scheduler and database target have been verified. The guard deliberately fails closed when the variable is missing, and PostgreSQL advisory locks reduce competing-run overlap. Never run this on the production database for experimentation.

## Preservation exception

For a documented legal reason, an authorized database operator may set `retention_hold_until` to a specific future timestamp. A hold is **not perpetual** and must be periodically reviewed; records become eligible after expiry if their last update is already older than 12 months. Unauthorized staff should not have permissions to modify hold values.

## Approval blockers beyond this code
- Confirm legal controller identification and deployed PostgreSQL region/subprocessors.
- Publish legally reviewed, factually verified policy at `/privacy`.
- Implement and verify actual daily retention scheduling, backup lifecycle and data-subject request handling.
- Complete sandbox-to-production full journey check before setting `TEST_DRIVE_ENABLED=true` and `PRIVACY_POLICY_APPROVED=true`.

## Operational intake gate (additional mandatory protection)

The public form, `GET /api/test-drive` and `POST /api/test-drive` will refuse intake unless all existing privacy/database/admin conditions hold **and**:
- `RETENTION_SCHEDULE_CONFIRMED=true` has been set only after an authorized operator has verified the daily cron job's actual Render workspace, database target, command and deployment.
- The database table `jmc_lead_retention_health` contains a `last_success_at` from a real `--execute` cleanup completed within the **last 36 hours**. A dry run can never update this heartbeat.
- Missing migrations, database connectivity failure, stale heartbeat or a cleanup that left an expired backlog cause intake to fail closed. Admin → Settings reports these conditions without exposing connection strings or other secrets.

A daily schedule is recommended; the 36-hour margin provides a limited allowance for timing jitter while making missed jobs visible. A one-time operator execution is **not** a substitute for the daily scheduled job. Monitor and alert on a failed cleanup. The heartbeat is also added to the embedded CMS migration schema. Do not activate production intake until this check is demonstrated with a real scheduled run.

The disposable CI PostgreSQL journey runs the same cleanup job with synthetic data and confirms both accepted submission with fresh heartbeat and rejection with a stale heartbeat.
