"""Smoke tests for the migration SQL embedded in the Expo app (no runtime Expo dependency)."""
import re
import sqlite3
import unittest
from pathlib import Path

SCHEMA = Path(__file__).resolve().parents[3] / 'mobile/src/data/schema.ts'

class MobileSchemaTest(unittest.TestCase):
    def setUp(self):
        src = SCHEMA.read_text()
        match = re.search(r'await db\.execAsync\(`(.*?)`\);',src,re.S)
        assert match, 'embedded migration SQL missing'
        self.db = sqlite3.connect(':memory:')
        self.db.execute('PRAGMA foreign_keys=ON')
        self.db.executescript(match.group(1))

    def tearDown(self):
        self.db.close()

    def test_core_tables_and_relations(self):
        tables={row[0] for row in self.db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        self.assertTrue({'medications','schedules','intake_confirmations'}.issubset(tables))

    def test_prevent_duplicate_confirmations(self):
        self.db.execute("INSERT INTO medications(id,name,form,created_at,updated_at) VALUES('m','Med A','tablet','x','x')")
        self.db.execute("INSERT INTO schedules(id,medication_id,version,timezone,start_date,effective_from,recurrence_json,created_at) VALUES('m:v1','m',1,'UTC','2026-10-21','2026-10-21','{}','x')")
        args=('o','m','m:v1','Med A','2026-10-21','2026-10-21T08:00:00Z','1','tablet','2026-10-21T08:12:00Z')
        query='INSERT OR IGNORE INTO intake_confirmations(occurrence_id,medication_id,schedule_id,medication_name,local_date,scheduled_at_utc,quantity,unit,confirmed_at_utc) VALUES(?,?,?,?,?,?,?,?,?)'
        self.db.execute(query,args)
        self.db.execute(query,args)
        self.assertEqual(self.db.execute('SELECT count(*) FROM intake_confirmations').fetchone()[0],1)

    def test_orphan_schedule_is_rejected(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.db.execute("INSERT INTO schedules(id,medication_id,version,timezone,start_date,effective_from,recurrence_json,created_at) VALUES('s','missing',1,'UTC','2026-10-21','2026-10-21','{}','x')")

if __name__=='__main__':unittest.main()
