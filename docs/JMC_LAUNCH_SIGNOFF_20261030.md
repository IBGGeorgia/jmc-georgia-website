# JMC Georgia — Production Launch Signoff / 30.10.2026

**State (2026-10-30 ~20:28 Tbilisi): management authorization recorded; approved public Privacy Policy published. Retention execution enabled for the paid daily Cron, but real cleanup heartbeat NOT yet verified; Test Drive remains fail-closed until heartbeat exists.**

## Verified from Render (JMC-only resources)

| Component | Status | Evidence |
|---|---|---|
| Web application | Live, Frankfurt; paid `0.5c-512mb` plan | `srv-dbge2kflk1mc73dq4lpg`; commit `fdd9aa8cfb908bea24f0079c3979982a90d7f382`, Render 2026-10-30 |
| Paid Cron | Live, Frankfurt, 03:00 UTC / 07:00 Tbilisi daily | `crn-dbi8i9ifngtc73cjspqg` |
| PostgreSQL | `basic_256mb`, PostgreSQL 18, Frankfurt, available; Recovery UI advertises 7-day PITR | `dpg-dbi4ess9v7es738lu3c0-a`; read-only Recovery page 2026-10-30 |
| External DB IP allowlist | Empty; leave it closed | Render instance metadata |
| Retention schema | `leads=true legal_hold=true heartbeat=true` | Read-only startup probe 2026-10-30 12:49 UTC |
| Aggregate records | `total=0 eligible=0 protected=0` at last probe only | No personal information logged |
| Last successful daily retention cleanup | `ever_run=false fresh=false` at last read-only log | No production completion heartbeat yet; intake remains fail-closed until completed |
| One-time schema migration | Disabled again | `JMC_RETENTION_SCHEMA_MIGRATION_ONCE=false` |
| Cron execution | **Enabled by management request 2026-10-30**, first scheduled run 2026-10-31 07:00 Asia/Tbilisi | `JMC_RETENTION_EXECUTION_ENABLED=true` on paid Cron; actual successful result still to be observed |

## Checklist to complete before enabling destructive cleanup or accepting customer data

- [x] **Recovery UI inspected, PITR window advertised:** on **2026-10-30 ~20:06 Tbilisi** the authenticated [JMC PostgreSQL Recovery page](https://dashboard.render.com/d/dpg-dbi4ess9v7es738lu3c0-a/recovery) for database `dpg-dbi4ess9v7es738lu3c0-a` explicitly displayed **“You can choose to restore from any timestamp in the past 7 days”** and a **Restore database** control. Read-only inspection only; **no restore executed**. Database was created 2026-10-30, so seven complete days of actual history are not yet available. The UI does not attest a successful restoration test or expose a specific programmatic `recoveryStatus=AVAILABLE` enum.
- [ ] **Recovery test decision:** a full restoration spins up a *new billable database*, not an in-place overwrite. Obtain approval for extra spend before a restore exercise. For critical production, test restoring to a disposable instance, then verify sample schema/rows and discard per retention rules.
- [ ] **Optional export before production cleanup:** Recovery → **Create export**. Backups generated here are separate and can be downloaded, but contain sensitive personal data once lead intake starts; restrict, encrypt, and apply explicit backup retention.
- [x] **Legal name and 9-digit company ID confirmed:** **შპს „იბერია ბიზნეს ჯგუფი“**, **204975376**. The project owner supplied these details 2026-10-30, and they match the [Geostat official statistical business register](https://www.br.geostat.ge/register_geo/index.php?Stat_ID=20753109&action=History). Official entrepreneurs-registry extract and any separate controller authorization/legal signoff remain matters for legal review; this does not approve the entire privacy policy.
- [ ] **Controller operating procedures:** IBG management designated the controller (შპს „იბერია ბიზნეს ჯგუფი“, 204975376); still verify that `compliance@ibg.ge` is staffed, any DPO obligations, Render subprocessor/international transfer and backup/log-retention arrangements, and the internal request/identity verification SOP.
- [x] **Management approval of public Privacy Policy and deployment:** authorized expressly on 2026-10-30 in project chat. Live JMC website web settings updated to `PRIVACY_POLICY_APPROVED=true`, `PRIVACY_POLICY_VERSION=1.3`, `PRIVACY_POLICY_EFFECTIVE_DATE=2026-10-30`. Final public `/privacy` copy exists in [PR #58](https://github.com/IBGGeorgia/jmc-georgia-website/pull/58). The prior [internal draft PR #44](https://github.com/IBGGeorgia/jmc-georgia-website/pull/44) remains a review artifact; this management decision is not external counsel certification.
- [ ] **First actual Cron run:** check scheduled 31 October **07:00 Tbilisi** job log for `JMC_RETENTION_COMPLETE` and matching database heartbeat, instead of previous status-only result. The separate 07:15 automated review is configured. Do not count a deploy as a cleanup execution.
- [ ] **Active retention completion evidence:** read-only Production probe showed `total=0 eligible=0 protected=0` on 2026-10-30. Authorized web `RETENTION_HTTP_EXECUTION_ENABLED=true` and paid Cron `JMC_RETENTION_EXECUTION_ENABLED=true` were staged for the **next scheduled run**; shared bridge token was rotated on both services (secret never recorded in docs). Confirm `JMC_RETENTION_COMPLETE` and fresh DB heartbeat after the scheduled run. A `status` result **does not** count as a cleanup heartbeat.
- [ ] **Lead intake live verification:** web flags `RETENTION_SCHEDULE_CONFIRMED=true`, `TEST_DRIVE_ENABLED=true` were pre-staged on 2026-10-30 after management approval, but the actual `GET /api/test-drive` remains `ready:false` until **real** database cleanup success within 36 hours. On first successful Cron execution, server readiness should transition automatically; verify public form status, API and Lead Inbox before declaring publicly LIVE. If Cron fails, remain fail-closed and investigate; do not override the heartbeat requirement.

## Capability boundary

The authenticated browser **read-only Recovery page** has now been inspected and shows a 7-day Point-in-Time Recovery selection statement and **Restore database** control for the specific JMC database. The Render connector still cannot retrieve the [Recovery status endpoint](https://api-docs.render.com/reference/retrieve-postgres-recovery-info) enum; **a restoration itself has not been tested**. Paid plan eligibility alone is not the evidence: the actual account's visible Recovery page is.

Render documentation:
- [Recovery/PITR](https://render.com/docs/postgresql-backups): all paid Postgres, 3 days Hobby / 7 days Pro+, not within last 10 minutes; recovery spawns a new instance.
- [Recovery status endpoint](https://api-docs.render.com/reference/retrieve-postgres-recovery-info): `AVAILABLE`, `BACKUP_NOT_READY`, `NOT_AVAILABLE`.

**Operational rule:** activation flags were changed only after explicit management approval and authenticated recovery verification; never manually write a synthetic cleanup heartbeat or override a failed retention execution.

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

## Publication-ready Privacy page — conditional until signoff

The customer-facing `/privacy` route now contains complete Georgian JMC
privacy copy (controller: **შპს „იბერია ბიზნეს ჯგუფი“, 204975376**; consent
and data types; marketing withdrawal; Frankfurt hosting; 12-month retention;
data-subject rights). It is **not** published as an approved policy by a
code deploy alone.

All three conditions must hold simultaneously:
- `PRIVACY_POLICY_APPROVED=true` — legal/management signoff of actual text
- `PRIVACY_POLICY_VERSION=1.3` — immutable recorded consent version
- `PRIVACY_POLICY_EFFECTIVE_DATE=YYYY-MM-DD` — validated, real calendar
  date for the legal effective date, not an auto-changing display date

If any are missing, the current holding page remains public and data
collection stays disabled. The Test Drive readiness gate and authorized
destructive cron bridge also require all three, preventing half-activated
states. These flags must NOT be set before legal review and verified
PITR/recovery and operational controls. The effective date must reflect
the actual date of approval/publication, not an earlier code commit.

**CI coverage:** ordinary Browser QA uses unapproved mode; disposable
Test Drive E2E enables approved mode and verifies the full public policy
before writing synthetic leads into ephemeral PostgreSQL. No Production
customer leads are created by either test.
