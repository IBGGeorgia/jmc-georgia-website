# JMC Admin — CMS foundation & Test Drive lead collection

## Architecture — 2026-10-30
The public Next.js website and the internal CMS coexist in the same deployment:
- `/admin`: protected dashboard and user login
- `/admin/leads`: protected Test Drive lead list (admin, sales)
- `/admin/settings`: system readiness and future module roadmap
- `/lead-manager`: legacy redirect to `/admin/leads`
- `/api/test-drive`: public lead intake, **disabled until privacy and infrastructure approval**
- `/api/lead-manager/auth`: username/password login + session revocation
- `/api/lead-manager`: protected lead status/notes updates
- `/api/lead-manager/export`: admin-only CSV export

## User management and security
`jmc_cms_users` stores individual account records, display names, scrypt-hashed passwords and roles:
- `admin`: dashboard, leads, status edits, CSV
- `sales`: dashboard, leads, status edits, no CSV export
- `editor`: dashboard and readiness; no access to lead data

Authentication uses per-user salted scrypt hashes, DB-stored hash-only eight-hour sessions, HttpOnly Secure SameSite=Strict cookie, login throttling, request origin validation and authorization checks on every protected API.
Logout revokes the active session. CMS access is deliberately **fail-closed** until the database and required secrets exist. Never publish username/password or DB URLs in a repository, public frontend variables or chat.

## Paid Render PostgreSQL
The approved PostgreSQL 18 instance `jmc-test-drive-leads` (`dpg-dbi4ess9v7es738lu3c0-a`) was created in Frankfurt with Basic 256MB and 1GB disk.
The connector cannot read its **internal connection string** or password; do not attempt to replace it with an external URL or open its IP allowlist. Connect the JMC web service `srv-dbge2kflk1mc73dq4lpg` to the database using Render's Internal Database URL in a secure service environment variable named `DATABASE_URL`. Keep credentials off GitHub and chat.

Required service environment values:
- `DATABASE_URL`: internal Render Postgres connection string (secret)
- `LEAD_HASH_SECRET`: cryptographically random 32+ characters (secret)
- `CMS_SESSION_SECRET`: independent cryptographically random 32+ characters (secret)
- `NEXT_PUBLIC_SITE_URL`: public site origin `https://jmc-georgia.onrender.com`
- `TEST_DRIVE_ENABLED=false` and `PRIVACY_POLICY_APPROVED=false` until fully approved
- `PRIVACY_POLICY_VERSION`: approved published policy version before launch

No email inbox, sender, Resend, or `SALES_NOTIFY_TO` is necessary in this design. A successful lead is written to PostgreSQL and becomes visible immediately in the dashboard. The DB is the source of truth.

## Initialize the database (after internal connection is available)
From a trusted and authorized execution environment that can reach the database:

1. Set `DATABASE_URL` securely.
2. Run `npm run db:migrate:leads` to create/upgrade `jmc_test_drive_leads`, `jmc_cms_users`, `jmc_cms_sessions`, throttling and audit tables.
3. Verify migrations and access using a least-privilege DB user where supported.

**Bootstrap the first CMS administrator explicitly:** from a trusted environment, supply `CMS_BOOTSTRAP_USERNAME`, `CMS_BOOTSTRAP_DISPLAY_NAME` and `CMS_BOOTSTRAP_PASSWORD` (unique 16+ characters) and run `npm run cms:admin:create`. The password is salted/scrypt-hashed; no default password is shipped. The command refuses to overwrite an existing username.

Subsequent accounts can be provisioned via a vetted users-management flow; never share an administrator password between multiple employees. Retention periods, backups and user access must be approved before activating public submissions.

## Privacy / go-live gate
Data controller: **Eastgate Automotive LLC**.
The draft `docs/TEST_DRIVE_PRIVACY_DRAFT_KA.md` is not approved. Confirm company registration identifier, designated data/privacy contact, lawful basis, processors, international transfers, access rights, retention and deletion before publishing `/privacy`.
Only after public policy approval, server secrets, DB migrations, a real admin account, tested lead intake, and permission checks:
- Set `PRIVACY_POLICY_APPROVED=true`
- Set `TEST_DRIVE_ENABLED=true`
- Verify `GET /api/test-drive` returns `{"ready":true}`.
- Verify one **synthetic** test lead in PostgreSQL and its visibility in `/admin/leads`, plus status updates and appropriate role restrictions. Remove synthetic data after tests.
- Never put name, phone number, session secrets or lead identifiers in GA4/GTM events.

## Zoho later
Preserve local UUIDs, CRM status, opt-in, UTM attribution and timestamps. Introduce `zoho_id`, `sync_state`, `last_synced_at` and a retry-safe idempotent sync queue in a migration. Initially write locally, then push to Zoho. Avoid silent duplicate creation and keep status ownership rules explicit.

## CMS expansion
Future modules should live under `/admin/*` and use the same identity, role authorization, audit log, navigation and style system. Next candidates are vehicle catalog management, editable text/images, campaign banners and analytics. Do not expose fake editing controls before their backing APIs exist.

## Users & Permissions — next CMS milestone (2026-10-30)
- `/admin/users`: available only to the `admin` role; create a named account with a unique username, a password of at least 16 characters and `admin`, `sales` or `editor` role.
- `GET/POST/PATCH /api/admin/users`: protected admin-only endpoints. Never disclose password hashes through GET responses.
- An administrator can change another user's role, disable/enable their account, and reset their password. Existing sessions are revoked immediately on those changes; all account mutations create an audit record.
- Self-modification and deletion/demotion of the last active administrator are refused. There is deliberately no default administrator username/password.
- Account creation and password resets are performed inside the protected CMS; hand off a generated initial password to the employee by an approved secure channel (not email notifications from the site).
- A real logout button is available in the CMS sidebar and revokes the logged-in session.
- A dedicated GitHub Actions integration workflow uses **disposable CI PostgreSQL** and randomly generated test credentials to test admin login, account creation, role restrictions and session revocation. Its data and credentials are unrelated to the paid production database.
- Before relying on the system operationally, connect the paid Render database's internal `DATABASE_URL`, apply `npm run db:migrate:leads`, and run `npm run cms:admin:create` in an authorized environment. Never enable public lead collection until the approved privacy notice is published.


## Secure self-service first-admin setup (2026-10-30)
A one-time setup wizard at `/admin/setup` replaces the previous need to run database migration and bootstrap CLI by hand.

1. In **Render > Postgres > jmc-test-drive-leads > Connect**, copy the **Internal Database URL**, not the External URL. Keep the Postgres external IP allowlist empty.
2. In **Render > jmc-georgia > Environment**, add `DATABASE_URL` as a **secret environment variable**, pasting that internal URL. Never place it in GitHub, a file, a screenshot or this chat.
3. The same service must have `LEAD_HASH_SECRET` and `CMS_SESSION_SECRET` (independent, random 32+ characters). `NEXT_PUBLIC_SITE_URL` must match `https://jmc-georgia.onrender.com`.
4. Set `CMS_SETUP_ENABLED=true` and `CMS_SETUP_TOKEN` to a cryptographically random **43+ character** secret that the authorized administrator can retrieve securely from Render. Do not reuse passwords or expose the token in messages. Render redeploys after env updates.
5. Open `https://jmc-georgia.onrender.com/admin/setup`. Supply the one-time setup token and choose a unique first username, display name and password (16+ characters). The server runs canonical schema migrations and creates the first admin **in a single PostgreSQL transaction**.
6. Return to `/admin`, log in, verify the dashboard and Users & Permissions.
7. **Immediately set `CMS_SETUP_ENABLED=false` and remove `CMS_SETUP_TOKEN` from Render.** Even if a token remains configured, reinitialization is blocked once an account exists, but the setup surface should be disabled.
8. Keep `TEST_DRIVE_ENABLED=false` and `PRIVACY_POLICY_APPROVED=false` until the company-approved data privacy policy has been published and a complete customer-lead end-to-end test succeeds.

The form never exposes DB credentials or hashes to the browser. It uses strict origin, size and password validation and constant-time token verification. The migration rolls back completely if any step fails, and an advisory lock prevents simultaneous bootstrap requests.

The integration test uses **ephemeral PostgreSQL** with randomly generated secrets and verifies invalid token/origin rejection, initial bootstrap, replay rejection, admin login and privacy-gated Test Drive behavior.

### Operational blocker
The Render connector currently does **not** provide the database's private connection URL/password, and its hosted SQL query function cannot connect to a database with an empty external IP allowlist. The missing `DATABASE_URL` must therefore be entered securely once in the Render Dashboard. We must not weaken the database's network security to get around this.
