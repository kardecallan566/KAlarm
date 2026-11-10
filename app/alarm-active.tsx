import React,{useEffect,useState} from 'react';
import {Vibration,View} from 'react-native';
import {useLocalSearchParams,useRouter} from 'expo-router';
import * as Notifications from 'expo-notifications';
import {Action,Body,Heading,Page,Panel} from '../src/components/ui';
import {SoftCareIcon} from '../src/components/icons/SoftCareIcon';
import {useLanguage} from '../src/i18n/LanguageProvider';

/** Repeated vibration while this in-app alarm screen remains active; never confirms a dose. */
export default function AlarmActive(){
 const router=useRouter(),{notificationId}=useLocalSearchParams<{notificationId?:string}>();
 const {t}=useLanguage();const [stopped,setStopped]=useState(false);
 useEffect(()=>{Vibration.vibrate([0,900,500,900],true);return()=>Vibration.cancel()},[]);
 const stop=async()=>{
  Vibration.cancel();setStopped(true);
  if(typeof notificationId==='string')await Notifications.dismissNotificationAsync(notificationId).catch(()=>{});
  router.replace('/(tabs)');
 };
 return <Page title={t('alarmActive.title')} subtitle={t('alarmActive.subtitle')} showSettingsButton={false}>
  <Panel tone="peach"><View style={{alignItems:'center',paddingVertical:12}}><SoftCareIcon name="alarm" size={82}/><Heading>{t('alarmActive.heading')}</Heading><Body style={{textAlign:'center'}}>{t('alarmActive.body')}</Body></View></Panel>
  <Panel tone="mint"><Heading>{t('alarmActive.actionTitle')}</Heading><Body muted>{t('alarmActive.actionBody')}</Body><View style={{height:14}}/>
   <Action label={stopped?t('alarmActive.stopped'):t('alarmActive.stop')} icon="confirm" onPress={()=>void stop()}/>
  </Panel>
  <Body muted>{t('alarmActive.safety')}</Body>
 </Page>;
}
