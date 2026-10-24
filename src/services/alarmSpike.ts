import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const TEST_CHANNEL = 'kalarm-test-v1';
export type AlarmDiagnostic = {
  notificationPermission: boolean;
  exactAlarmPermission: boolean | null;
  pendingTests: number;
  pendingIds: string[];
  collectedAt: string;
};

export async function readDiagnostic():Promise<AlarmDiagnostic> {
  const permission=await Notifications.getPermissionsAsync();
  const allowed=permission.granted || permission.ios?.status===Notifications.IosAuthorizationStatus.PROVISIONAL;
  // SDK 57 does not expose the Android exact-alarm permission APIs.
  const exact:null=null;
  const pending=(await Notifications.getAllScheduledNotificationsAsync()).filter(item=>item.content.data?.kind==='kalarm-spike');
  return { notificationPermission:allowed, exactAlarmPermission:exact, pendingTests:pending.length,
    pendingIds:pending.map(item=>item.identifier), collectedAt:new Date().toLocaleString('pt-BR') };
}

export async function askForNotifications():Promise<boolean> {
  if(Platform.OS==='android'){
    await Notifications.setNotificationChannelAsync(TEST_CHANNEL,{
      name:'KAlarm · Testes técnicos',
      importance:Notifications.AndroidImportance.HIGH,
      sound:'default',
      vibrationPattern:[0,250,150,250],
    });
  }
  const permission=await Notifications.requestPermissionsAsync();
  return permission.granted || permission.ios?.status===Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function scheduleTestAlert():Promise<{id:string;mode:'alarmClock'|'bestEffort';time:string}> {
  const current=await readDiagnostic();
  if(!current.notificationPermission) throw new Error('Ative a permissão de notificações antes do teste.');
  if(Platform.OS==='android'){
    await Notifications.setNotificationChannelAsync(TEST_CHANNEL,{
      name:'KAlarm · Testes técnicos', importance:Notifications.AndroidImportance.HIGH,
      sound:'default', vibrationPattern:[0,250,150,250],
    });
  }
  const mode: 'alarmClock'|'bestEffort'='bestEffort';
  const time=new Date(Date.now()+60_000);
  const id=await Notifications.scheduleNotificationAsync({
    content:{
      title:'KAlarm · Teste de alarme',
      body:'Este é um aviso de teste. Nenhum medicamento foi registrado.',
      data:{kind:'kalarm-spike',version:1},
      sound:'default',
      ...(Platform.OS==='android'?{priority:Notifications.AndroidNotificationPriority.HIGH}:{}),
    },
    trigger:{
      type:Notifications.SchedulableTriggerInputTypes.DATE,
      date:time,
      ...(Platform.OS==='android'?{channelId:TEST_CHANNEL}:{}),
    },
  });
  return {id,mode,time:time.toLocaleString('pt-BR')};
}

export async function cancelPendingTests():Promise<number>{
  const current=await readDiagnostic();
  await Promise.all(current.pendingIds.map(id=>Notifications.cancelScheduledNotificationAsync(id)));
  return current.pendingIds.length;
}
