import {useEffect} from 'react';
import {AppState} from 'react-native';
import {useRouter} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import {MEDICATION_KIND} from '../services/reminderPlan';
import {reconcileMedicationReminders} from '../services/medicationReminders';

/** Notificações nunca registram tomada automaticamente. */
export function ReminderLifecycle(){
 const db=useSQLiteContext(),router=useRouter();
 useEffect(()=>{
  let active=true;
  const sync=()=>{if(active)void reconcileMedicationReminders(db).catch(e=>console.warn('KAlarm: falha ao atualizar lembretes',e instanceof Error?e.message:'erro'))};
  sync();
  const app=AppState.addEventListener('change',state=>{if(state==='active')sync()});
  const taps=Notifications.addNotificationResponseReceivedListener(response=>{
   if(response.notification.request.content.data?.kind===MEDICATION_KIND)router.replace('/(tabs)');
  });
  return ()=>{active=false;app.remove();taps.remove()};
 },[db,router]);
 return null;
}
