# Render Cron → authenticated JMC web bridge

**Purpose:** A secure daily connection from the paid Frankfurt Cron to the
existing JMC web service, which already owns an internal PostgreSQL connection.
The PostgreSQL external firewall and DB credentials remain unchanged.

The dedicated cron does **not** require a copy of `DATABASE_URL`.

## Authentication and activation

- `JMC_RETENTION_BRIDGE_TOKEN`: a dedicated cryptographically random 64+ character
  value, stored in **both** Render services as a secret environment variable.
  Never put it in GitHub, URLs, app logs or customer-facing pages.
- Cron URL: `https://jmc-georgia.onrender.com/api/internal/retention`.
  Route accepts **POST only**, `Authorization: Bearer`, and `{"mode":"status"}`
  or `{"mode":"execute"}`. No user records are returned.
- With `JMC_RETENTION_EXECUTION_ENABLED=false` in the Cron env, it performs a
  **read-only status check** at the scheduled time. This verifies actual web → DB
  schema visibility but NEVER triggers deletion or heartbeat updates.
- To enable real deletion after backup, schema migration, legal review and
  approval: the Cron must have `JMC_RETENTION_EXECUTION_ENABLED=true` **and**
  the web service must have `RETENTION_HTTP_EXECUTION_ENABLED=true` **and**
  `PRIVACY_POLICY_APPROVED=true`. These two separate execution gates are
  intentionally *not enabled* during bridge provisioning.
- The web endpoint executes bounded, serialized deletion of leads more than
  12 calendar months after their last update, respecting time-limited legal
  holds; only a complete successful run records the retention heartbeat.
- Only after real scheduled execution and backup rules are confirmed may
  `RETENTION_SCHEDULE_CONFIRMED=true` be considered for the web service's
  Test Drive intake gate. Intake also requires its separate privacy approval
  and feature flag.

## No-op, errors and troubleshooting

- If token is absent, the cron logs `JMC_RETENTION_PAUSED` and does nothing.
- Invalid token returns HTTP 401; disallowed destructive mode returns 403;
  unavailable DB returns 503. The cron exits nonzero on unexpected errors,
  so Render notifications can detect them.
- With `mode=status`, response contains only `schemaReady`,
  `fresh`, and `lastSuccessAt`. No PII.
- The daily schedule remains 03:00 UTC (07:00 Asia/Tbilisi).
- Do not change PostgreSQL IP allowlists or deploy database credentials via
  Github Actions as a workaround.
