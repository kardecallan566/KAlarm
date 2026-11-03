/** Funções puras, sem dependências de Expo ou SQLite. */
export type ReminderCandidate={id:string;plannedAtISO:string;localTime:string;medicationName:string;quantity:string;unit:string};
export type DeliveryMode='alarmClock'|'bestEffort';
export type PlannedReminder=ReminderCandidate&{fingerprint:string};
export type QueueAudit={expected:number;matched:number;missing:number;obsolete:number;firstPlannedAtISO:string|null;lastPlannedAtISO:string|null;atCapacity:boolean};
export type NativeReminder={identifier:string;occurrenceId?:string;fingerprint?:string};
export const MEDICATION_KIND='kalarm-medication-v1';
export const REMINDER_HORIZON_DAYS=30;
export const MAX_MEDICATION_NOTIFICATIONS=40;
export function makeReminderPlan(events:ReminderCandidate[],confirmed:ReadonlySet<string>,nowMs:number,showDetails:boolean,limit=MAX_MEDICATION_NOTIFICATIONS,deliveryMode:DeliveryMode='bestEffort'):PlannedReminder[]{
  if(!Number.isInteger(limit)||limit<1||limit>48)throw new Error('Limite de avisos inválido');
  const seen=new Set<string>();
  return events.filter(e=>Number.isFinite(Date.parse(e.plannedAtISO))&&Date.parse(e.plannedAtISO)>nowMs+2000&&!confirmed.has(e.id))
    .sort((a,b)=>a.plannedAtISO.localeCompare(b.plannedAtISO)||a.id.localeCompare(b.id))
    .filter(e=>{if(seen.has(e.id))return false;seen.add(e.id);return true})
    .slice(0,limit).map(e=>({...e,fingerprint:JSON.stringify([e.id,e.plannedAtISO,showDetails?e.medicationName:'',showDetails?e.quantity:'',showDetails?e.unit:'',e.localTime,showDetails,deliveryMode])}));
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

/** Consistência de agendamento, nunca confirmação de entrega. */
export function auditReminderQueue(desired:PlannedReminder[],native:NativeReminder[],limit=MAX_MEDICATION_NOTIFICATIONS):QueueAudit{
 const d=diffReminderPlan(desired,native);
 return {expected:desired.length,matched:d.keep.length,missing:d.create.length,obsolete:d.cancelIds.length,
  firstPlannedAtISO:desired[0]?.plannedAtISO??null,lastPlannedAtISO:desired.at(-1)?.plannedAtISO??null,atCapacity:desired.length>=limit};
}
/** Se o estado muda durante a sincronização, executar mais uma passagem. */
export function createReconcileGate<T>(task:()=>Promise<T>):()=>Promise<T>{
 let active:Promise<T>|null=null,again=false;
 return ()=>{
  again=true;
  if(!active) active=(async()=>{
   let result!:T;
   do{again=false;result=await task()}while(again);
   return result;
  })().finally(()=>{active=null});
  return active;
 };
}
