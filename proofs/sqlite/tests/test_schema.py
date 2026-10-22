from pathlib import Path
import sqlite3
import unittest

SQL=Path(__file__).resolve().parent.parent/'migrations'/'0001_core.sql'

class SQLiteSchemaTests(unittest.TestCase):
    def setUp(self):
        self.db=sqlite3.connect(':memory:')
        self.db.execute('PRAGMA foreign_keys=ON')
        self.db.executescript(SQL.read_text(encoding='utf-8'))
        self.db.execute("INSERT INTO medications(id, display_name,dosage_form,created_at,updated_at) VALUES (?,?,?,?,?)",('m1','Medicação fictícia','tablet','2026-11-01T00:00:00Z','2026-11-01T00:00:00Z'))
        self.db.execute("""INSERT INTO schedule_versions(id,schedule_key,medication_id,version,recurrence_mode,recurrence_json,timezone,start_local_date,effective_from,created_at)
        VALUES(?,?,?,?,?,?,?,?,?,?)""", ('s1','r1','m1',1,'daily','{"mode":"daily"}','America/Sao_Paulo','2026-11-01','2026-11-01','2026-11-01T00:00:00Z'))
    def tearDown(self): self.db.close()
    def event(self, id='o1', slot='morning'):
        self.db.execute("""INSERT INTO dose_occurrences(id,schedule_version_id,medication_id,local_date,local_time,planned_at_utc,slot_id,quantity_decimal,quantity_unit,materialized_at)
             VALUES (?,?,?,?,?,?,?,?,?,?)""", (id,'s1','m1','2026-11-02','08:00','2026-11-02T11:00:00Z',slot,'0.5','tablet','2026-11-01T00:00:00Z'))
    def test_fk_rejects_unknown_medication(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("""INSERT INTO schedule_versions(id,schedule_key,medication_id,version,recurrence_mode,recurrence_json,timezone,start_local_date,effective_from,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)""",
                ('bad','r9','missing',1,'daily','{}','UTC','2026-11-01','2026-11-01','2026-11-01T00:00:00Z'))
    def test_revision_must_have_unique_version(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("""INSERT INTO schedule_versions(id,schedule_key,medication_id,version,recurrence_mode,recurrence_json,timezone,start_local_date,effective_from,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)""",
                ('s2','r1','m1',1,'daily','{}','UTC','2026-11-01','2026-11-01','2026-11-01T00:00:00Z'))
    def test_duplicate_occurrence_prevented(self):
        self.event()
        with self.assertRaises(sqlite3.IntegrityError): self.event('o2')
    def test_confirmation_requires_real_taken_at(self):
        self.event()
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO intake_events(id,event_key,occurrence_id,event_type,event_at_utc,source) VALUES ('e1','key1','o1','confirmed','2026-11-02T11:00:00Z','app')")
    def test_idempotency_key_unique(self):
        self.event()
        self.db.execute("""INSERT INTO intake_events(id,event_key,occurrence_id,event_type,event_at_utc,actual_taken_at_utc,source)
            VALUES ('e1','same-click','o1','confirmed','2026-11-02T11:00:00Z','2026-11-02T11:00:00Z','app')""")
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("""INSERT INTO intake_events(id,event_key,occurrence_id,event_type,event_at_utc,actual_taken_at_utc,source)
                VALUES ('e2','same-click','o1','confirmed','2026-11-02T11:00:00Z','2026-11-02T11:00:00Z','app')""")
    def test_notif_outbox_unique_per_occurrence(self):
        self.event()
        self.db.execute("INSERT INTO notification_outbox(occurrence_id,scheduled_at_utc,state) VALUES ('o1','2026-11-02T11:00:00Z','pending')")
        with self.assertRaises(sqlite3.IntegrityError): self.db.execute("INSERT INTO notification_outbox(occurrence_id,scheduled_at_utc,state) VALUES ('o1','2026-11-02T11:00:00Z','scheduled')")
    def test_invalid_json_rejected(self):
        with self.assertRaises(sqlite3.IntegrityError): self.db.execute("UPDATE schedule_versions SET recurrence_json='bad_json' WHERE id='s1'")

if __name__=='__main__': unittest.main()
