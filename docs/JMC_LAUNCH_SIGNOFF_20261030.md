# JMC Georgia — Production Launch Signoff / 30.10.2026

**State: technical infrastructure ready for preflight, NOT approved for public Test Drive lead intake or destructive daily cleanup.**

## Verified from Render (JMC-only resources)

| Component | Status | Evidence |
|---|---|---|
| Web application | Live, Frankfurt | `srv-dbge2kflk1mc73dq4lpg`; commit `b6c0bd6880dc5a879309f84a579539300827804d` |
| Paid Cron | Live, Frankfurt, 03:00 UTC / 07:00 Tbilisi daily | `crn-dbi8i9ifngtc73cjspqg` |
| PostgreSQL | `basic_256mb`, PostgreSQL 18, Frankfurt, available | `dpg-dbi4ess9v7es738lu3c0-a` |
| External DB IP allowlist | Empty; leave it closed | Render instance metadata |
| Retention schema | `leads=true legal_hold=true heartbeat=true` | Read-only startup probe 2026-10-30 12:49 UTC |
| Aggregate records | `total=0 eligible=0 protected=0` at last probe only | No personal information logged |
| Last successful daily destructive cleanup | `ever_run=false fresh=false` | No heartbeat yet; intake remains fail-closed |
| One-time schema migration | Disabled again | `JMC_RETENTION_SCHEMA_MIGRATION_ONCE=false` |
| Cron destructive execution | Disabled | `JMC_RETENTION_EXECUTION_ENABLED=false`; status-only bridge |

## Checklist to complete before enabling destructive cleanup or accepting customer data

- [ ] **Real backup availability:** open [JMC PostgreSQL on Render](https://dashboard.render.com/d/dpg-dbi4ess9v7es738lu3c0-a) → **Recovery** and inspect the *Point-in-Time Recovery* section. Confirm it shows a selectable recovery window (not merely that the plan is paid), and record the inspection date/time internally. **Do not click Restore Database** during this read-only check.
- [ ] **Recovery test decision:** a full restoration spins up a *new billable database*, not an in-place overwrite. Obtain approval for extra spend before a restore exercise. For critical production, test restoring to a disposable instance, then verify sample schema/rows and discard per retention rules.
- [ ] **Optional export before production cleanup:** Recovery → **Create export**. Backups generated here are separate and can be downloaded, but contain sensitive personal data once lead intake starts; restrict, encrypt, and apply explicit backup retention.
- [ ] **Official legal entity:** check [Georgia's official Entrepreneurs Registry](https://enreg.reestri.gov.ge/main.php) for the exact controller, Georgian legal name, 9-digit identifier, and current registration. **Do not** copy unrelated similarly named organizations' ID numbers. Secondary listings are insufficient to approve a privacy policy.
- [ ] **Controller responsibilities:** confirm that this entity is legally responsible for JMC Georgia lead requests, the `compliance@ibg.ge` mailbox is actually serviced, whether DPO is required, Render subprocessor/international transfer terms, opt-out process for optional marketing, and backup/log retention.
- [ ] **Legal approval:** sign off draft [PR #44](https://github.com/IBGGeorgia/jmc-georgia-website/pull/44) and publish the complete public `/privacy` page with approved effective date and version. Until then, only a holding page should appear.
- [ ] **First safe Cron run:** check scheduled 31 October 07:00 Tbilisi job log for `JMC_RETENTION_BRIDGE_CONNECTED: schemaReady=true; cleanup disabled`. The separate automated review is configured for 07:15.
- [ ] **Active retention:** only with verified backup/recovery, legal signoff, dry-run, and explicit authorization, enable web `RETENTION_HTTP_EXECUTION_ENABLED=true` and Cron `JMC_RETENTION_EXECUTION_ENABLED=true` in a controlled, observed rollout. Then inspect true `RETENTION_COMPLETE` and fresh DB heartbeat. A `status` result **does not** count as a cleanup heartbeat.
- [ ] **Lead intake:** only after all above and tested production readiness may web `RETENTION_SCHEDULE_CONFIRMED`, `PRIVACY_POLICY_APPROVED`, `PRIVACY_POLICY_VERSION` and `TEST_DRIVE_ENABLED` be enabled.

## Capability boundary

Current Render connector can read database instance metadata, builds, events and logs. It **cannot** retrieve account-specific PITR availability from [Render's recovery status endpoint](https://api-docs.render.com/reference/retrieve-postgres-recovery-info) or click the authenticated **Recovery** dashboard. The paid database type makes PITR generally eligible, but does not prove `recoveryStatus=AVAILABLE` for this particular instance.

Render documentation:
- [Recovery/PITR](https://render.com/docs/postgresql-backups): all paid Postgres, 3 days Hobby / 7 days Pro+, not within last 10 minutes; recovery spawns a new instance.
- [Recovery status endpoint](https://api-docs.render.com/reference/retrieve-postgres-recovery-info): `AVAILABLE`, `BACKUP_NOT_READY`, `NOT_AVAILABLE`.

**No environment variables should be switched to destructive mode on the basis of this checklist alone.**

## Marketing consent withdrawal — implemented, limited to authorized Sales/Admin

The user-facing Test Drive form contains a **separate optional marketing consent**
checkbox and explains that requests can be emailed to `compliance@ibg.ge`.
Once public lead intake is legally enabled, authorized Sales/Admin staff can use
**Admin → Test Drive ლიდები → Marketing consent → გააუქმე თანხმობა** after
verifying the request from the data subject. This action:

- changes only the selected `marketing_opt_in` from true to false;
- records `lead.marketing_withdrawn` with actor and timestamp in
  `jmc_cms_audit_log`;
- preserves the lead's service-request status and its sales notes;
- is idempotent under concurrent clicks and cannot reinstate consent;
- requires a valid CMS session and same-origin protected POST.

Support staff must first **verify the requester's identity**, then carry out
the withdrawal. The website does **not** automatically parse emails or verify
requester ownership, and the legal team must approve the formal request SOP.
No outbound marketing sender or Zoho sync is connected yet. Future integrations
MUST honor the current DB opt-in flag and suppress withdrawn records. Follow
the approved response deadline; do not claim automated 7-day fulfillment until
the organizational procedure and mailbox responsibilities are confirmed.

## Automated live launch preflight — no customer records created

Run `npm run qa:launch:live` to check the deployed JMC site from the
command line. A manual workflow is also available under GitHub Actions:
**JMC — Production launch preflight (read-only)**.

This verifies five critical public endpoints without using Production
credentials or submitting any lead:

- GET `/api/test-drive`: responds with valid `ready:boolean`.
- GET `/privacy`: the public policy page is reachable. If it still says
  `პოლიტიკა მზადდება`, the intake API must report `ready=false`.
- GET `/test-drive`: its visible status agrees with the API's readiness.
- Unauthenticated POST `/api/internal/retention` (status only): HTTP 401.
- Anonymous GET `/api/lead-manager`: HTTP 401.

The default *observe* mode exits successfully when approval requirements
are still pending and prints `BLOCKED_PENDING_APPROVALS` in the CI log.
For **final go-live signoff**, set
`JMC_PREFLIGHT_REQUIRE_READY=true npm run qa:launch:live` or select
`require_ready=true` in the manual workflow; it fails until the real
Production readiness endpoint reports `ready=true`.

This only checks **observable public application behavior**. It does NOT
verify the Postgres PITR recovery status, whether the legal controller
has been registered correctly, or whether a signed policy was approved.
Those require independent human/operator evidence, and must be reviewed
before enabling any public intake flags.

Never submit actual customer data in the preflight. Never use this job to
perform or authorize cleanup execution.
