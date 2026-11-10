import {useEffect,useRef} from 'react';
import {AppState} from 'react-native';
import {useRouter} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import {MEDICATION_KIND} from '../services/reminderPlan';
import {reconcileMedicationReminders} from '../services/medicationReminders';

/** Notifications never confirm a dose; a received/tapped alert opens the active alarm screen. */
export function ReminderLifecycle(){
 const db=useSQLiteContext(),router=useRouter(),handled=useRef<string|null>(null);
 useEffect(()=>{
  let active=true;
  const sync=()=>{if(active)void reconcileMedicationReminders(db).catch(e=>console.warn('KAlarm: falha ao atualizar lembretes',e instanceof Error?e.message:'erro'))};
  sync();
  const app=AppState.addEventListener('change',state=>{if(state==='active')sync()});
  const open=(notification:Notifications.Notification|null)=>{
   if(!active||!notification)return;
   const req=notification.request,data=req.content.data;
   if(data?.kind!==MEDICATION_KIND||handled.current===req.identifier)return;
   handled.current=req.identifier;
   router.push({pathname:'/alarm-active',params:{notificationId:req.identifier}});
  };
  const received=Notifications.addNotificationReceivedListener(open);
  const taps=Notifications.addNotificationResponseReceivedListener(response=>open(response.notification));
  void Notifications.getLastNotificationResponseAsync().then(response=>open(response?.notification??null)).catch(()=>{});
  return ()=>{active=false;app.remove();received.remove();taps.remove()};
 },[db,router]);
 return null;
}
