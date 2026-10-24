import type { SQLiteDatabase } from 'expo-sqlite';
import type { Schedule, Recurrence, Unit, Occurrence } from '../core/scheduling';
import { previewWindow, offsetDate, localToday } from '../core/dates';
import { previewOccurrences, normalizeQuantity } from '../core/scheduling';

export type Medication = {
  id:string; name:string; form:Unit; strengthLabel:string|null; archived:boolean;
  schedules:Schedule[];
};
export type IntakeConfirmation = {
  occurrence_id:string; medication_id:string; schedule_id:string; medication_name:string;
  local_date:string; scheduled_at_utc:string; quantity:string; unit:Unit; confirmed_at_utc:string;
};
export type MedicationDraft = { name:string; form:Unit; strengthLabel:string; startDate:string; recurrence:Recurrence; timezone:string };
type MedicationRow = {id:string;name:string;form:Unit;strength_label:string|null;archived:number};
type ScheduleRow = {id:string;medication_id:string;version:number;timezone:string;start_date:string;end_date:string|null;effective_from:string;effective_until:string|null;recurrence_json:string;overrides_json:string};
const newId=():string=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,11)}`;
const now=()=>new Date().toISOString();

function fromRow(row:ScheduleRow):Schedule {
  return {id:row.id,medicationId:row.medication_id,version:row.version,timezone:row.timezone,
    startDate:row.start_date,endDate:row.end_date??undefined,effectiveFrom:row.effective_from,
    effectiveUntil:row.effective_until??undefined,recurrence:JSON.parse(row.recurrence_json) as Recurrence,
    overrides:JSON.parse(row.overrides_json) as Schedule['overrides']};
}
export async function listMedications(db:SQLiteDatabase, includeArchived=false):Promise<Medication[]> {
  const rows=await db.getAllAsync<MedicationRow>(`SELECT * FROM medications ${includeArchived?'':'WHERE archived=0'} ORDER BY name COLLATE NOCASE`);
  const schedules=await db.getAllAsync<ScheduleRow>('SELECT * FROM schedules ORDER BY version');
  return rows.map(row=>({id:row.id,name:row.name,form:row.form,strengthLabel:row.strength_label,archived:row.archived===1,schedules:schedules.filter(s=>s.medication_id===row.id).map(fromRow)}));
}
export async function getMedication(db:SQLiteDatabase,id:string):Promise<Medication|null> {
  const rows=await listMedications(db,true);
  return rows.find(x=>x.id===id)??null;
}
export function upcomingForMedications(meds:Medication[],from:string,to:string):Array<Occurrence & {medicationName:string}> {
  return meds.filter(m=>!m.archived).flatMap(m=>m.schedules.flatMap(s=>
    previewWindow(s,from,to).map(o=>({...o,medicationName:m.name}))
  )).sort((a,b)=>a.plannedAtISO.localeCompare(b.plannedAtISO)||a.id.localeCompare(b.id));
}
function validateDraft(d:MedicationDraft,id:string,version:number):Schedule {
  if(!d.name.trim()||d.name.trim().length>160) throw new Error('Informe o nome do medicamento (até 160 caracteres).');
  const schedule:Schedule={id:`${id}:v${version}`,medicationId:id,version,timezone:d.timezone,startDate:d.startDate,effectiveFrom:d.startDate,recurrence:d.recurrence};
  previewOccurrences(schedule,{from:d.startDate,to:offsetDate(d.startDate,13)});
  return schedule;
}
/** New schedule on an edit always takes effect tomorrow. History is append-only. */
export async function saveMedication(db:SQLiteDatabase,draft:MedicationDraft,existingId?:string):Promise<string> {
  const id=existingId??newId();
  const existing=existingId?await getMedication(db,existingId):null;
  if(existingId&&!existing)throw new Error('Medicamento não encontrado.');
  const latest=existing?.schedules.at(-1);
  const start=existing?offsetDate(localToday(latest?.timezone??draft.timezone),1):draft.startDate;
  // A version that has not started can be corrected in place without touching historical events.
  const revisePending=Boolean(latest && latest.effectiveFrom && latest.effectiveFrom>=start);
  const version=revisePending?latest!.version:(latest?.version??0)+1;
  const prepared={...draft,startDate:start};
  const schedule=validateDraft(prepared,id,version);
  const updated=now();
  await db.withTransactionAsync(async()=>{
    if(existing) {
      await db.runAsync('UPDATE medications SET name=?,form=?,strength_label=?,updated_at=? WHERE id=?',draft.name.trim(),draft.form,draft.strengthLabel.trim()||null,updated,id);
      if(latest && !revisePending) await db.runAsync('UPDATE schedules SET effective_until=? WHERE id=?',offsetDate(start,-1),latest.id);
    } else {
      await db.runAsync('INSERT INTO medications(id,name,form,strength_label,created_at,updated_at) VALUES(?,?,?,?,?,?)',id,draft.name.trim(),draft.form,draft.strengthLabel.trim()||null,updated,updated);
    }
    if(revisePending) {
      await db.runAsync('UPDATE schedules SET timezone=?,start_date=?,effective_from=?,recurrence_json=?,overrides_json=? WHERE id=?',
        schedule.timezone,schedule.startDate,schedule.effectiveFrom!,JSON.stringify(schedule.recurrence),JSON.stringify({}),schedule.id);
    } else {
      await db.runAsync(`INSERT INTO schedules(id,medication_id,version,timezone,start_date,effective_from,recurrence_json,overrides_json,created_at)
        VALUES(?,?,?,?,?,?,?,?,?)`,schedule.id,id,version,schedule.timezone,schedule.startDate,schedule.effectiveFrom!,JSON.stringify(schedule.recurrence),JSON.stringify({}),updated);
    }
  });
  return id;
}
export async function setArchived(db:SQLiteDatabase,id:string,archived:boolean):Promise<void> {
  await db.runAsync('UPDATE medications SET archived=?,updated_at=? WHERE id=?',archived?1:0,now(),id);
}
export async function getConfirmations(db:SQLiteDatabase):Promise<IntakeConfirmation[]> {
  return db.getAllAsync<IntakeConfirmation>('SELECT * FROM intake_confirmations ORDER BY confirmed_at_utc DESC');
}
/** A confirmation records the user's declaration; a notification alone never inserts it. */
export async function confirmOccurrence(db:SQLiteDatabase,event:Occurrence,medicationName:string):Promise<boolean> {
  if(new Date(event.plannedAtISO).getTime()>Date.now()) throw new Error('Ainda não chegou o horário desta dose.');
  const res=await db.runAsync(`INSERT OR IGNORE INTO intake_confirmations
    (occurrence_id,medication_id,schedule_id,medication_name,local_date,scheduled_at_utc,quantity,unit,confirmed_at_utc)
    VALUES(?,?,?,?,?,?,?,?,?)`,event.id,event.medicationId,event.scheduleId,medicationName,event.localDate,event.plannedAtISO,normalizeQuantity(event.quantity),event.unit,now());
  return res.changes>0;
}
