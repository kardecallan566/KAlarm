-- KAlarm prototype schema; no encryption at rest is provided by ordinary SQLite.
-- Enable PRAGMA foreign_keys=ON on EVERY opened connection in application code.
-- Medication and intake records are sensitive health data.

CREATE TABLE medications (
  id TEXT PRIMARY KEY NOT NULL,
  display_name TEXT NOT NULL CHECK (length(trim(display_name)) BETWEEN 1 AND 160),
  dosage_form TEXT NOT NULL CHECK (dosage_form IN ('tablet','capsule','drop','ml','other')),
  strength_label TEXT,
  photo_uri TEXT,
  is_archived INTEGER NOT NULL DEFAULT 0 CHECK (is_archived IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE schedule_versions (
  id TEXT PRIMARY KEY NOT NULL,
  schedule_key TEXT NOT NULL,
  medication_id TEXT NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
  version INTEGER NOT NULL CHECK (version > 0),
  recurrence_mode TEXT NOT NULL CHECK (recurrence_mode IN ('daily','weekdays','weekly-matrix','cycle','dates')),
  recurrence_json TEXT NOT NULL CHECK (json_valid(recurrence_json)),
  timezone TEXT NOT NULL,
  start_local_date TEXT NOT NULL,
  end_local_date TEXT,
  effective_from TEXT NOT NULL,
  effective_until TEXT,
  state TEXT NOT NULL DEFAULT 'active' CHECK (state IN ('active','paused','ended')),
  created_at TEXT NOT NULL,
  UNIQUE (schedule_key, version),
  CHECK (end_local_date IS NULL OR end_local_date >= start_local_date),
  CHECK (effective_until IS NULL OR effective_until >= effective_from)
);
CREATE INDEX idx_schedule_versions_medication ON schedule_versions(medication_id, state);

CREATE TABLE date_overrides (
  schedule_version_id TEXT NOT NULL REFERENCES schedule_versions(id) ON DELETE CASCADE,
  local_date TEXT NOT NULL,
  day_plan_json TEXT NOT NULL CHECK (json_valid(day_plan_json)),
  revised_at TEXT NOT NULL,
  PRIMARY KEY(schedule_version_id, local_date)
);

CREATE TABLE dose_occurrences (
  id TEXT PRIMARY KEY NOT NULL,
  schedule_version_id TEXT NOT NULL REFERENCES schedule_versions(id) ON DELETE RESTRICT,
  medication_id TEXT NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
  local_date TEXT NOT NULL,
  local_time TEXT NOT NULL,
  planned_at_utc TEXT NOT NULL,
  slot_id TEXT NOT NULL,
  quantity_decimal TEXT NOT NULL,
  quantity_unit TEXT NOT NULL CHECK (quantity_unit IN ('tablet','capsule','drop','ml','other')),
  unit_label TEXT,
  occurrence_state TEXT NOT NULL DEFAULT 'planned' CHECK (occurrence_state IN ('planned','cancelled')),
  materialized_at TEXT NOT NULL,
  UNIQUE(schedule_version_id, local_date, slot_id)
);
CREATE INDEX idx_occurrences_planned ON dose_occurrences(planned_at_utc, occurrence_state);

-- Append-only event log. Reverting a confirmation adds an event; it does not erase the original.
CREATE TABLE intake_events (
  id TEXT PRIMARY KEY NOT NULL,
  event_key TEXT NOT NULL UNIQUE,
  occurrence_id TEXT NOT NULL REFERENCES dose_occurrences(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL CHECK (event_type IN ('confirmed','confirmation_reverted','snoozed','explicitly_skipped')),
  event_at_utc TEXT NOT NULL,
  actual_taken_at_utc TEXT,
  source TEXT NOT NULL CHECK (source IN ('app','notification')),
  CHECK (event_type <> 'confirmed' OR actual_taken_at_utc IS NOT NULL)
);
CREATE INDEX idx_intake_occurrence ON intake_events(occurrence_id, event_at_utc);

-- Native notification IDs may become stale; reconciliation compares against the OS.
CREATE TABLE notification_outbox (
  occurrence_id TEXT PRIMARY KEY NOT NULL REFERENCES dose_occurrences(id) ON DELETE CASCADE,
  native_notification_id TEXT UNIQUE,
  scheduled_at_utc TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('pending','scheduled','cancel_requested','cancelled','error')),
  last_checked_at_utc TEXT,
  error_code TEXT
);

CREATE TABLE app_preferences (
  preference_key TEXT PRIMARY KEY NOT NULL,
  preference_json TEXT NOT NULL CHECK (json_valid(preference_json)),
  updated_at TEXT NOT NULL
);
