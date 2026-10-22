/** Funções puras, sem dependências de Expo ou SQLite. */
export type ReminderCandidate={id:string;plannedAtISO:string;localTime:string;medicationName:string;quantity:string;unit:string};
export type PlannedReminder=ReminderCandidate&{fingerprint:string};
export type NativeReminder={identifier:string;occurrenceId?:string;fingerprint?:string};
export const MEDICATION_KIND='kalarm-medication-v1';
export const REMINDER_HORIZON_DAYS=30;
export const MAX_MEDICATION_NOTIFICATIONS=40;
export function makeReminderPlan(events:ReminderCandidate[],confirmed:ReadonlySet<string>,nowMs:number,showDetails:boolean,limit=MAX_MEDICATION_NOTIFICATIONS):PlannedReminder[]{
  if(!Number.isInteger(limit)||limit<1||limit>48)throw new Error('Limite de avisos inválido');
  const seen=new Set<string>();
  return events.filter(e=>Number.isFinite(Date.parse(e.plannedAtISO))&&Date.parse(e.plannedAtISO)>nowMs+2000&&!confirmed.has(e.id))
    .sort((a,b)=>a.plannedAtISO.localeCompare(b.plannedAtISO)||a.id.localeCompare(b.id))
    .filter(e=>{if(seen.has(e.id))return false;seen.add(e.id);return true})
    .slice(0,limit).map(e=>({...e,fingerprint:JSON.stringify([e.id,e.plannedAtISO,showDetails?e.medicationName:'',showDetails?e.quantity:'',showDetails?e.unit:'',e.localTime,showDetails])}));
}
export function diffReminderPlan(desired:PlannedReminder[],native:NativeReminder[]){
  const wanted=new Map(desired.map(e=>[e.id,e]));
  const used=new Set<string>(),keep:NativeReminder[]=[],cancelIds:string[]=[];
  for(const n of native){
    const current=n.occurrenceId?wanted.get(n.occurrenceId):undefined;
    if(current&&current.fingerprint===n.fingerprint&&!used.has(current.id)){keep.push(n);used.add(current.id)}
    else cancelIds.push(n.identifier);
  }
  return {keep,cancelIds,create:desired.filter(x=>!used.has(x.id))};
}
