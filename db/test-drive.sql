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
 marketing_opt_in boolean NOT NULL DEFAULT false,
 ip_fingerprint varchar(64) NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
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
