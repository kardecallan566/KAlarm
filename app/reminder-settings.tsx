import React,{useCallback,useEffect,useState} from 'react';
import {AppState,Platform,Linking,Text,View} from 'react-native';
import {useFocusEffect,useRouter} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import {Page,Panel,Heading,Body,Action,StatusLine} from '../src/components/ui';
import {updateReminderSettings} from '../src/data/reminderSettings';
import {readReminderDiagnostic,reconcileMedicationReminders,requestMedicationPermission,type ReminderDiagnostic} from '../src/services/medicationReminders';
import {useLanguage} from '../src/i18n/LanguageProvider';
const expoGoSafe=process.env.EXPO_PUBLIC_KALARM_GO_SAFE==='1';
export default function ReminderSettingsScreen(){
 const db=useSQLiteContext(),router=useRouter();const {t,language}=useLanguage();
 const [status,setStatus]=useState<ReminderDiagnostic|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const refresh=useCallback(async()=>setStatus(await readReminderDiagnostic(db)),[db]);
 useFocusEffect(useCallback(()=>{void refresh().catch(e=>setMessage(String(e)))},[refresh]));
 useEffect(()=>{const sub=AppState.addEventListener('change',s=>{if(s==='active')void refresh().catch(e=>setMessage(String(e)))});return()=>sub.remove()},[refresh]);
 const work=async(action:()=>Promise<void>)=>{if(busy)return;setBusy(true);try{await action();const checked=await readReminderDiagnostic(db);setStatus(checked);setMessage(checked.missing||checked.obsolete?t('reminders.syncWarning'):t('reminders.syncMessage'))}catch(e){setMessage(e instanceof Error?e.message:String(e))}finally{await refresh().catch(()=>{});setBusy(false)}};
 return <Page title={t('reminders.title')} subtitle={t('reminders.subtitle')}>
  <Action label={t('reminders.goBack')} secondary onPress={()=>router.back()}/>
  {expoGoSafe?<Panel tone="peach"><Heading>{t('reminders.expoTitle')}</Heading><Body>{t('reminders.expoBody')}</Body></Panel>:null}
  <Panel tone="mint"><Heading>{t('reminders.state')}</Heading>
   <StatusLine ok={status?.enabled??null} title={t('reminders.enabled')} details={status?.enabled?t('reminders.enabledDetails'):t('reminders.disabledDetails')}/>
   <StatusLine ok={status?.permitted??null} title={t('reminders.permission')} details={status?.permitted?t('reminders.granted'):t('reminders.required')}/>
   <StatusLine ok={status?.exact??null} title={t('reminders.exact')} details={Platform.OS==='android'?t('reminders.exactAndroid'):t('reminders.exactOther')}/>
   <StatusLine ok={status?.enabled&&status.permitted?(status.missing||status.obsolete?false:status.expected?true:null):null} title={t('reminders.queue')} details={status?.missing||status?.obsolete?t('reminders.queueWarning'):t('reminders.queueDetails')}/>
   <Body muted>{t('reminders.expected',{expected:status?.expected??'–',matched:status?.matched??'–',missing:status?.missing??'–',obsolete:status?.obsolete??'–'})}</Body>
   <Body muted>{t('reminders.next')} {status?.firstPlannedAtISO?new Date(status.firstPlannedAtISO).toLocaleString(language):t('reminders.none')}</Body>
   <Body muted>{t('reminders.last')} {status?.lastPlannedAtISO?new Date(status.lastPlannedAtISO).toLocaleString(language):t('reminders.none')}</Body>
   {status?.atCapacity?<Body muted>{t('reminders.capacity')}</Body>:null}
   <Body muted>{t('reminders.scheduled',{n:status?.scheduled??'–'})}</Body>
   <Body muted>{t('reminders.mode',{mode:status?.mode??'–',max:status?.maximumNotifications??40,days:status?.horizonDays??30})}</Body>
  </Panel>
  <Panel><Heading>{t('reminders.activation')}</Heading><Body muted>{t('reminders.activationBody')}</Body><View style={{height:12}}/>
   <Action icon={status?.enabled?'pause':'bell'} disabled={busy||expoGoSafe} label={expoGoSafe?t('reminders.unavailable'):status?.enabled?t('reminders.disable'):t('reminders.activate')} onPress={()=>void work(async()=>{
    if(status?.enabled){await updateReminderSettings(db,{enabled:false});await reconcileMedicationReminders(db);return}
    if(!await requestMedicationPermission())throw new Error(t('reminders.permissionDenied'));
    await updateReminderSettings(db,{enabled:true});await reconcileMedicationReminders(db);
   })}/>
   {!status?.permitted?<Action label={t('reminders.openSystem')} icon="settings" secondary onPress={()=>void Linking.openSettings()}/>:null}
  </Panel>
  <Panel tone="blue"><Heading>{t('reminders.privacy')}</Heading><Body muted>{t('reminders.privacyBody')}</Body><Body muted>{status?.showDetails?t('reminders.exampleDetailed'):t('reminders.examplePrivate')}</Body><View style={{height:12}}/>
   <Action secondary icon="edit" disabled={busy} label={status?.showDetails?t('reminders.hideDetails'):t('reminders.showDetails')} onPress={()=>void work(async()=>{await updateReminderSettings(db,{showDetails:!status?.showDetails});await reconcileMedicationReminders(db)})}/>
  </Panel>
  <Panel><Heading>{t('reminders.diagnostics')}</Heading>
   <Action secondary icon="repeat-cycle" disabled={busy} label={t('reminders.reconcile')} onPress={()=>void work(async()=>{const result=await reconcileMedicationReminders(db);if(result.lastError)throw new Error(result.lastError)})}/>
   <Action secondary icon="alarm" label={t('reminders.test')} onPress={()=>router.push('/alarm-test')}/>
   <Body muted>{t('reminders.limitNote')}</Body>
  </Panel>
  {message?<Panel tone="peach"><Text accessibilityRole="alert">{message}</Text></Panel>:null}
 </Page>;
}
