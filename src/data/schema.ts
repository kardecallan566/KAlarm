import type { SQLiteDatabase } from 'expo-sqlite';

/** All health data stays on-device. SQLite is not encrypted by this prototype. */
export async function migrate(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{user_version:number}>('PRAGMA user_version');
  const version=row?.user_version??0;
  if(version>=4)return;
  if (version < 1) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 160),
        form TEXT NOT NULL,
        strength_label TEXT,
        archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY NOT NULL,
        medication_id TEXT NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
        version INTEGER NOT NULL CHECK(version>0),
        timezone TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        effective_from TEXT NOT NULL,
        effective_until TEXT,
        recurrence_json TEXT NOT NULL CHECK(json_valid(recurrence_json)),
        overrides_json TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(overrides_json)),
        created_at TEXT NOT NULL,
        UNIQUE(medication_id,version)
      );
      CREATE INDEX IF NOT EXISTS idx_schedules_medication ON schedules(medication_id, version);
      CREATE TABLE IF NOT EXISTS intake_confirmations (
        occurrence_id TEXT PRIMARY KEY NOT NULL,
        medication_id TEXT NOT NULL REFERENCES medications(id) ON DELETE RESTRICT,
        schedule_id TEXT NOT NULL REFERENCES schedules(id) ON DELETE RESTRICT,
        medication_name TEXT NOT NULL,
        local_date TEXT NOT NULL,
        scheduled_at_utc TEXT NOT NULL,
        quantity TEXT NOT NULL,
        unit TEXT NOT NULL,
        confirmed_at_utc TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_confirmed_at ON intake_confirmations(confirmed_at_utc DESC);
    `);
    await db.execAsync('PRAGMA user_version = 1;');
  });
  }
  await db.withTransactionAsync(async()=>{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS reminder_settings (
        id INTEGER PRIMARY KEY NOT NULL CHECK(id=1),
        enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
        show_details INTEGER NOT NULL DEFAULT 0 CHECK(show_details IN (0,1))
      );
      INSERT OR IGNORE INTO reminder_settings(id,enabled,show_details) VALUES(1,0,0);
      CREATE TABLE IF NOT EXISTS reminder_jobs (
        occurrence_id TEXT PRIMARY KEY NOT NULL,
        notification_id TEXT NOT NULL UNIQUE,
        planned_at_utc TEXT NOT NULL,
        fingerprint TEXT NOT NULL,
        reconciled_at_utc TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_reminder_jobs_date ON reminder_jobs(planned_at_utc);
    `);
    await db.execAsync('PRAGMA user_version = 2;');
  });
  await db.withTransactionAsync(async()=>{
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS app_preferences (
        id INTEGER PRIMARY KEY NOT NULL CHECK(id=1),
        language TEXT NOT NULL DEFAULT 'pt-BR' CHECK(language IN ('pt-BR','en-US'))
      );
      INSERT OR IGNORE INTO app_preferences(id,language) VALUES(1,'pt-BR');
    `);
    await db.execAsync('PRAGMA user_version = 3;');
  });
  if(version<4){
    await db.withTransactionAsync(async()=>{
      await db.execAsync(`
        ALTER TABLE medications ADD COLUMN alarm_sound TEXT NOT NULL DEFAULT 'default' CHECK(alarm_sound IN ('default','bell','chime','pulse'));
        UPDATE schedules SET effective_until=effective_from WHERE effective_until IS NOT NULL AND effective_until<effective_from;
      `);
      await db.execAsync('PRAGMA user_version = 4;');
    });
  }
}
