"""Testes da migração incremental v2 no SQLite sem depender do Expo."""
import re
import sqlite3
import unittest
from pathlib import Path
SOURCE=Path(__file__).resolve().parents[3]/'src/data/schema.ts'
class ReminderMigrationTests(unittest.TestCase):
 def setUp(self):
  blocks=re.findall(r'await db\.execAsync\(`(.*?)`\);',SOURCE.read_text(),re.S)
  assert len(blocks)>=2
  self.blocks=blocks
  self.db=sqlite3.connect(':memory:')
  self.db.execute('PRAGMA foreign_keys=ON')
  self.db.executescript(blocks[0])
  self.db.executescript(blocks[1])
 def tearDown(self):self.db.close()
 def test_default_off_and_private(self):
  self.assertEqual(self.db.execute('SELECT enabled,show_details FROM reminder_settings').fetchone(),(0,0))
 def test_unique_native_and_occurrence(self):
  sql='INSERT INTO reminder_jobs(occurrence_id,notification_id,planned_at_utc,fingerprint,reconciled_at_utc) VALUES(?,?,?,?,?)'
  self.db.execute(sql,('o','n','2026-10-22T08:00:00Z','f','now'))
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute(sql,('o','n2','2026-10-22T08:00:00Z','f','now'))
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute(sql,('o2','n','2026-10-22T08:00:00Z','f','now'))
 def test_invalid_setting_fails(self):
  with self.assertRaises(sqlite3.IntegrityError):self.db.execute('UPDATE reminder_settings SET enabled=2 WHERE id=1')
 def test_repeated_migration_has_no_extra_settings(self):
  self.db.executescript(self.blocks[1])
  self.assertEqual(self.db.execute('SELECT COUNT(*) FROM reminder_settings').fetchone()[0],1)
