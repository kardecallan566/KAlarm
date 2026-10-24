import {useEffect,useRef} from 'react';
import {AppState} from 'react-native';
import {useRouter} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import {MEDICATION_KIND} from '../services/reminderPlan';
import {reconcileMedicationReminders} from '../services/medicationReminders';

/** Notificações nunca registram tomada automaticamente. */
export function ReminderLifecycle(){
 const db=useSQLiteContext(),router=useRouter(),handled=useRef<string|null>(null);
 useEffect(()=>{
  let active=true;
  const sync=()=>{if(active)void reconcileMedicationReminders(db).catch(e=>console.warn('KAlarm: falha ao atualizar lembretes',e instanceof Error?e.message:'erro'))};
  sync();
  const app=AppState.addEventListener('change',state=>{if(state==='active')sync()});
  const open=(response:Notifications.NotificationResponse|null)=>{
   if(!active||!response)return;
   const req=response.notification.request;
   if(req.content.data?.kind!==MEDICATION_KIND||handled.current===req.identifier)return;
   handled.current=req.identifier;
   router.replace('/(tabs)'); // Nunca confirma a tomada ao abrir.
  };
  const taps=Notifications.addNotificationResponseReceivedListener(open);
  void Notifications.getLastNotificationResponseAsync().then(open).catch(()=>{});
  return ()=>{active=false;app.remove();taps.remove()};
 },[db,router]);
 return null;
}
