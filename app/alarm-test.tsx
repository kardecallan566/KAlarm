import {useCallback,useEffect,useState} from 'react';
import {AppState,Platform,Text,View} from 'react-native';
import {useRouter} from 'expo-router';
import {Action,Body,Heading,Page,Panel,StatusLine} from '../src/components/ui';
import {colors} from '../src/theme';
import {askForNotifications,cancelPendingTests,readDiagnostic,scheduleTestAlert,type AlarmDiagnostic} from '../src/services/alarmSpike';
import {useLanguage} from '../src/i18n/LanguageProvider';
export default function AlarmTest(){
 const router=useRouter();const {t,language}=useLanguage();const [diag,setDiag]=useState<AlarmDiagnostic|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(t('alarmTest.initial'));
 const refresh=useCallback(async()=>{try{setDiag(await readDiagnostic())}catch(e){setMessage(t('alarmTest.permissionError',{error:String(e)}))}},[t]);
 useEffect(()=>{void refresh();const subscription=AppState.addEventListener('change',state=>{if(state==='active')void refresh()});return()=>subscription.remove()},[refresh]);
 const safely=async(operation:()=>Promise<unknown>,success:string)=>{if(busy)return;setBusy(true);try{await operation();if(success)setMessage(success)}catch(error){setMessage(t('alarmTest.operationError',{error:String(error)}))}finally{await refresh();setBusy(false)}};
 return <Page title={t('alarmTest.title')} subtitle={t('alarmTest.subtitle')}>
  <Action label={t('alarmTest.back')} secondary onPress={()=>router.back()}/>
  <Action label={t('alarmTest.manage')} secondary onPress={()=>router.push('/reminder-settings')}/>
  <Panel tone="mint"><Heading>{t('alarmTest.device')}</Heading>
   <StatusLine ok={diag?.notificationPermission??null} title={t('alarmTest.permission')} details={diag?.notificationPermission?t('reminders.granted'):t('alarmTest.permissionDenied')}/>
   <StatusLine ok={diag?.exactAlarmPermission??null} title={t('alarmTest.exact')} details={Platform.OS==='android'?t('alarmTest.exactAndroid'):t('alarmTest.exactOther')}/>
   <StatusLine ok={diag?diag.pendingTests>0:null} title={t('alarmTest.pending')} details={t('alarmTest.pendingDetail',{n:diag?.pendingTests??'–'})}/>
   <Body muted style={{fontSize:13,marginTop:10}}>{t('alarmTest.lastCheck')} {diag?.collectedAt??'–'}</Body>
  </Panel>
  <Panel><Heading>{t('alarmTest.permissions')}</Heading>
   <Action label={t('alarmTest.request')} secondary disabled={busy} onPress={()=>void safely(askForNotifications,t('alarmTest.requestDone'))} icon="bell"/>
   <Action label={t('alarmTest.refresh')} secondary disabled={busy} onPress={()=>void safely(refresh,t('alarmTest.refreshDone'))}/>
  </Panel>
  <Panel tone="blue"><Heading>{t('alarmTest.testTitle')}</Heading><Body>{t('alarmTest.testBody')}</Body><View style={{height:14}}/>
   <Action label={t('alarmTest.schedule')} disabled={busy||!diag?.notificationPermission} onPress={()=>void safely(async()=>{const result=await scheduleTestAlert();setMessage(t('alarmTest.registered',{time:result.time,mode:result.mode,id:result.id.slice(0,12)}))},'')} icon="alarm"/>
   <Action label={t('alarmTest.cancel')} secondary disabled={busy||!diag?.pendingTests} onPress={()=>void safely(async()=>{const count=await cancelPendingTests();setMessage(t('alarmTest.cancelled',{n:count}))},'')} icon="pause"/>
  </Panel>
  <Panel><Heading>{t('alarmTest.result')}</Heading><Body>{message}</Body><Text style={{color:colors.muted,fontSize:13,marginTop:12,lineHeight:19}}>{t('alarmTest.notDelivered')}</Text></Panel>
 </Page>;
}
