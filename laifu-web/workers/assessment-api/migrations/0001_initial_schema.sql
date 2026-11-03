PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS assessment_results (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  assessment_type TEXT,
  result_payload TEXT,
  service_intent TEXT,
  total_score INTEGER NOT NULL,
  dynamic_full_score INTEGER NOT NULL,
  score_rate REAL NOT NULL,
  result_level TEXT NOT NULL,
  result_label TEXT NOT NULL,
  child_gate_answer INTEGER,
  cross_border_gate_answer INTEGER,
  weaknesses TEXT,
  dimension_scores TEXT NOT NULL,
  answers TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_wechat TEXT,
  submission_source TEXT NOT NULL,
  follow_up_status TEXT NOT NULL DEFAULT 'new',
  admin_note TEXT,
  service_type TEXT,
  assigned_to TEXT,
  appointment_owner TEXT,
  appointment_time TEXT,
  client_age INTEGER,
  client_gender TEXT,
  client_location TEXT,
  asset_tier_level TEXT,
  marital_dispute_summary TEXT,
  last_follow_up_at TEXT,
  updated_by TEXT,
  updated_at TEXT NOT NULL,
  report_visibility TEXT NOT NULL DEFAULT 'internal_only',
  report_version TEXT,
  report_generated_at TEXT,
  CHECK (assessment_type IS NULL OR assessment_type IN ('', 'divorce_scale', 'divorce_readiness', 'spousal_narcissism_risk')),
  CHECK (follow_up_status IN ('new', 'to_follow', 'contacted', 'consulting', 'converted', 'invalid')),
  CHECK (client_gender IS NULL OR client_gender IN ('male', 'female')),
  CHECK (client_age IS NULL OR client_age >= 0)
);

CREATE INDEX IF NOT EXISTS idx_assessment_results_created_at
ON assessment_results(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_type
ON assessment_results(assessment_type);

CREATE INDEX IF NOT EXISTS idx_assessment_results_follow_up_status
ON assessment_results(follow_up_status);

CREATE INDEX IF NOT EXISTS idx_assessment_results_result_level
ON assessment_results(result_level);

CREATE INDEX IF NOT EXISTS idx_assessment_results_contact_phone
ON assessment_results(contact_phone);

CREATE INDEX IF NOT EXISTS idx_assessment_results_assigned_to
ON assessment_results(assigned_to);
