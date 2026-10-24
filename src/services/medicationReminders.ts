import {Platform} from 'react-native';
import type {SQLiteDatabase} from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import {localToday,offsetDate,readableQuantity} from '../core/dates';
import {getConfirmations,listMedications,upcomingForMedications} from '../data/medications';
import {getReminderSettings,writeReminderJobs} from '../data/reminderSettings';
import {MEDICATION_KIND,MAX_MEDICATION_NOTIFICATIONS,REMINDER_HORIZON_DAYS,makeReminderPlan,diffReminderPlan,auditReminderQueue,createReconcileGate,type NativeReminder} from './reminderPlan';

export const MEDICATION_CHANNEL='kalarm-medication-v1';
export type ReminderDiagnostic={enabled:boolean;showDetails:boolean;permitted:boolean;exact:boolean|null;scheduled:number;horizonDays:number;maximumNotifications:number;mode:'alarmClock'|'bestEffort';expected:number;matched:number;missing:number;obsolete:number;firstPlannedAtISO:string|null;lastPlannedAtISO:string|null;atCapacity:boolean;lastError?:string};
const allowed=(p:Notifications.NotificationPermissionsStatus)=>p.granted||p.ios?.status===Notifications.IosAuthorizationStatus.PROVISIONAL;
export async function ensureMedicationChannel(){
 if(Platform.OS==='android')await Notifications.setNotificationChannelAsync(MEDICATION_CHANNEL,{name:'KAlarm · Medicamentos',description:'Avisos de doses que você programou',importance:Notifications.AndroidImportance.HIGH,sound:'default',vibrationPattern:[0,350,200,350]});
}
export async function notificationPermissionGranted(){return allowed(await Notifications.getPermissionsAsync())}
export async function requestMedicationPermission(){await ensureMedicationChannel();return allowed(await Notifications.requestPermissionsAsync())}
async function exactPermission():Promise<boolean|null>{return null} // Não exposto por expo-notifications 57.
async function ownedPending(){return (await Notifications.getAllScheduledNotificationsAsync()).filter(x=>x.content.data?.kind===MEDICATION_KIND)}
const gates=new WeakMap<SQLiteDatabase,()=>Promise<ReminderDiagnostic>>();
export function reconcileMedicationReminders(db:SQLiteDatabase):Promise<ReminderDiagnostic>{
 let gate=gates.get(db);
 if(!gate){gate=createReconcileGate(()=>runReconciliation(db));gates.set(db,gate)}
 return gate();
}
async function runReconciliation(db:SQLiteDatabase):Promise<ReminderDiagnostic>{
 const settings=await getReminderSettings(db),permitted=await notificationPermissionGranted(),exact=await exactPermission();
 const mode:'alarmClock'|'bestEffort'=Platform.OS==='android'&&exact===true?'alarmClock':'bestEffort';
 const old=await ownedPending();
 const common={...settings,permitted,exact,horizonDays:REMINDER_HORIZON_DAYS,maximumNotifications:MAX_MEDICATION_NOTIFICATIONS,mode};
 if(!settings.enabled){
  for(const n of old)await Notifications.cancelScheduledNotificationAsync(n.identifier);
  await writeReminderJobs(db,[]);
  return readReminderDiagnostic(db);
 }
 if(!permitted)return {...await readReminderDiagnostic(db),lastError:'Permissão de notificação desativada. Verifique os ajustes do celular.'};
 await ensureMedicationChannel();
 const today=localToday(),meds=await listMedications(db),confirmed=await getConfirmations(db);
 const occurrences=upcomingForMedications(meds,today,offsetDate(today,REMINDER_HORIZON_DAYS-1));
 const desired=makeReminderPlan(occurrences,new Set(confirmed.map(x=>x.occurrence_id)),Date.now(),settings.showDetails,MAX_MEDICATION_NOTIFICATIONS,mode);
 const native:NativeReminder[]=old.map(x=>({
  identifier:x.identifier,
  occurrenceId:typeof x.content.data?.occurrenceId==='string'?x.content.data.occurrenceId:undefined,
  fingerprint:typeof x.content.data?.fingerprint==='string'?x.content.data.fingerprint:undefined
 }));
 const diff=diffReminderPlan(desired,native);
 for(const id of diff.cancelIds)await Notifications.cancelScheduledNotificationAsync(id);
 for(const event of diff.create)await Notifications.scheduleNotificationAsync({
  content:{
   title:settings.showDetails?'KAlarm · '+event.medicationName:'KAlarm · Hora de conferir seu medicamento',
   body:settings.showDetails?readableQuantity(event.quantity,event.unit)+' · '+event.localTime:'Toque para consultar a dose e confirmar apenas depois de tomar.',
   data:{kind:MEDICATION_KIND,occurrenceId:event.id,fingerprint:event.fingerprint},
   sound:'default',
   ...(Platform.OS==='android'?{priority:Notifications.AndroidNotificationPriority.HIGH}:{})
  },
  trigger:{type:Notifications.SchedulableTriggerInputTypes.DATE,date:new Date(event.plannedAtISO),
   ...(Platform.OS==='android'?{channelId:MEDICATION_CHANNEL}:{})}
 });
 const finalPending=await ownedPending(),byId=new Map(desired.map(x=>[x.id,x]));
 const stamp=new Date().toISOString(),seen=new Set<string>();
 await writeReminderJobs(db,finalPending.flatMap(request=>{
  const id=request.content.data?.occurrenceId,fp=request.content.data?.fingerprint;
  if(typeof id!=='string'||typeof fp!=='string'||seen.has(id))return [];
  const event=byId.get(id);
  if(!event||event.fingerprint!==fp)return [];
  seen.add(id);
  return [{occurrence_id:id,notification_id:request.identifier,planned_at_utc:event.plannedAtISO,fingerprint:fp,reconciled_at_utc:stamp}];
 }));
 const audit=auditReminderQueue(desired,finalPending.map(x=>({identifier:x.identifier,
  occurrenceId:typeof x.content.data?.occurrenceId==='string'?x.content.data.occurrenceId:undefined,
  fingerprint:typeof x.content.data?.fingerprint==='string'?x.content.data.fingerprint:undefined})));
 const diagnostic=await readReminderDiagnostic(db);
 return audit.missing||audit.obsolete?{...diagnostic,lastError:'Avisos pendentes não correspondem à programação. Refaça a verificação.'}:diagnostic;
}
export async function readReminderDiagnostic(db:SQLiteDatabase):Promise<ReminderDiagnostic>{
 const settings=await getReminderSettings(db),permitted=await notificationPermissionGranted(),exact=await exactPermission();
 const pending=await ownedPending(),mode:'alarmClock'|'bestEffort'=Platform.OS==='android'&&exact===true?'alarmClock':'bestEffort';
 let desired:ReturnType<typeof makeReminderPlan>=[];
 if(settings.enabled){
  const today=localToday(),[meds,logs]=await Promise.all([listMedications(db),getConfirmations(db)]);
  const events=upcomingForMedications(meds,today,offsetDate(today,REMINDER_HORIZON_DAYS-1));
  desired=makeReminderPlan(events,new Set(logs.map(x=>x.occurrence_id)),Date.now(),settings.showDetails,MAX_MEDICATION_NOTIFICATIONS,mode);
 }
 const native:NativeReminder[]=pending.map(x=>({identifier:x.identifier,occurrenceId:typeof x.content.data?.occurrenceId==='string'?x.content.data.occurrenceId:undefined,
  fingerprint:typeof x.content.data?.fingerprint==='string'?x.content.data.fingerprint:undefined}));
 return {...settings,...auditReminderQueue(desired,native),permitted,exact,scheduled:pending.length,
  horizonDays:REMINDER_HORIZON_DAYS,maximumNotifications:MAX_MEDICATION_NOTIFICATIONS,mode};
}
