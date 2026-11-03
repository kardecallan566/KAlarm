import type {SQLiteDatabase} from 'expo-sqlite';
export type ReminderSettings={enabled:boolean;showDetails:boolean};
export type ReminderJobRow={occurrence_id:string;notification_id:string;planned_at_utc:string;fingerprint:string;reconciled_at_utc:string};
export async function getReminderSettings(db:SQLiteDatabase):Promise<ReminderSettings>{
 const row=await db.getFirstAsync<{enabled:number;show_details:number}>('SELECT enabled,show_details FROM reminder_settings WHERE id=1');
 return {enabled:row?.enabled===1,showDetails:row?.show_details===1};
}
export async function updateReminderSettings(db:SQLiteDatabase,next:Partial<ReminderSettings>){
 const current=await getReminderSettings(db),updated={...current,...next};
 await db.runAsync('UPDATE reminder_settings SET enabled=?,show_details=? WHERE id=1',updated.enabled?1:0,updated.showDetails?1:0);
 return updated;
}
export async function writeReminderJobs(db:SQLiteDatabase,jobs:ReminderJobRow[]){
 await db.withTransactionAsync(async()=>{await db.runAsync('DELETE FROM reminder_jobs');
 for(const j of jobs)await db.runAsync('INSERT INTO reminder_jobs(occurrence_id,notification_id,planned_at_utc,fingerprint,reconciled_at_utc) VALUES(?,?,?,?,?)',j.occurrence_id,j.notification_id,j.planned_at_utc,j.fingerprint,j.reconciled_at_utc);
 });
}
