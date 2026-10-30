-- Run manually against managed PostgreSQL BEFORE enabling Test Drive.
-- Contains personal data. Restrict DB role, backups, exports and retention.
CREATE TABLE IF NOT EXISTS jmc_test_drive_leads (
 id uuid PRIMARY KEY,
 full_name varchar(100) NOT NULL,
 phone varchar(20) NOT NULL,
 model_slug varchar(50) NOT NULL CHECK (model_slug IN ('vigus','grand-avenue','grand-avenue-pro')),
 preferred_date date,
 source varchar(80),
 medium varchar(80),
 campaign varchar(100),
 content varchar(100),
 referrer varchar(500),
 status varchar(25) NOT NULL DEFAULT 'new'
   CHECK (status IN ('new','contacted','scheduled','completed','cancelled')),
 notes varchar(1000) NOT NULL DEFAULT '',
 consent_version varchar(30) NOT NULL,
 consented_at timestamptz NOT NULL DEFAULT now(),
 marketing_opt_in boolean NOT NULL DEFAULT false,
 ip_fingerprint varchar(64) NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
-- Safe, idempotent upgrade for already-initialized databases.
ALTER TABLE jmc_test_drive_leads ADD COLUMN IF NOT EXISTS consented_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS jmc_leads_created_idx ON jmc_test_drive_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS jmc_leads_ip_idx ON jmc_test_drive_leads(ip_fingerprint,created_at DESC);
CREATE INDEX IF NOT EXISTS jmc_leads_phone_idx ON jmc_test_drive_leads(phone,created_at DESC);
CREATE INDEX IF NOT EXISTS jmc_leads_status_idx ON jmc_test_drive_leads(status,created_at DESC);
CREATE TABLE IF NOT EXISTS jmc_admin_login_throttle(
 ip_fingerprint varchar(64) PRIMARY KEY,
 attempt_count integer NOT NULL DEFAULT 0,
 last_attempt timestamptz NOT NULL DEFAULT now()
);
-- Adopt a documented retention policy and backups before public activation.


-- CMS foundation: individual accounts, roles, revocable sessions.
-- Never store raw passwords, temporary passwords, or API keys in these tables.
CREATE TABLE IF NOT EXISTS jmc_cms_users (
 id uuid PRIMARY KEY,
 username varchar(64) NOT NULL UNIQUE
  CHECK (username ~ '^[a-z][a-z0-9._-]{2,63}$'),
 display_name varchar(120) NOT NULL,
 password_hash varchar(180) NOT NULL,
 role varchar(20) NOT NULL CHECK (role IN ('admin','sales','editor')),
 is_active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 last_login_at timestamptz
);
CREATE TABLE IF NOT EXISTS jmc_cms_sessions (
 session_hash char(64) PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES jmc_cms_users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS jmc_cms_sessions_user_idx ON jmc_cms_sessions(user_id);
CREATE INDEX IF NOT EXISTS jmc_cms_sessions_expiry_idx ON jmc_cms_sessions(expires_at);
CREATE TABLE IF NOT EXISTS jmc_cms_audit_log (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 actor_user_id uuid REFERENCES jmc_cms_users(id) ON DELETE SET NULL,
 action varchar(80) NOT NULL,
 subject_id uuid,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS jmc_cms_audit_created_idx ON jmc_cms_audit_log(created_at DESC);
-- Operators: delete expired sessions and aged login throttles periodically.
-- PII retention and admin activity audit retention require a formally approved policy.
