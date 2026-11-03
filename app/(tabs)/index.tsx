import React,{useCallback,useState} from 'react';
import {Alert,Image,Text,View} from 'react-native';
import {useFocusEffect,useRouter} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import {Action,Body,Heading,Page,Panel} from '../../src/components/ui';
import {SoftCareIcon} from '../../src/components/icons/SoftCareIcon';
import {reconcileMedicationReminders} from '../../src/services/medicationReminders';
import {listMedications,upcomingForMedications,getConfirmations,confirmOccurrence} from '../../src/data/medications';
import {localToday,offsetDate,formatDay} from '../../src/core/dates';
import {colors as c} from '../../src/theme';
import {useLanguage} from '../../src/i18n/LanguageProvider';
import {localizedQuantity} from '../../src/i18n/quantity';
import type {Occurrence} from '../../src/core/scheduling';
type DisplayOccurrence=Occurrence&{medicationName:string};
const expoGoSafe=process.env.EXPO_PUBLIC_KALARM_GO_SAFE==='1';
export default function Home(){
 const router=useRouter();const db=useSQLiteContext();const {t,language}=useLanguage();
 const [events,setEvents]=useState<DisplayOccurrence[]>([]);const [confirmed,setConfirmed]=useState<Set<string>>(new Set());const [medicationCount,setMedicationCount]=useState(0);const [error,setError]=useState('');const [busy,setBusy]=useState('');
 const refresh=useCallback(async()=>{const today=localToday();try{
  const [meds,logs]=await Promise.all([listMedications(db),getConfirmations(db)]);
  setMedicationCount(meds.length);setEvents(upcomingForMedications(meds,today,offsetDate(today,3)));setConfirmed(new Set(logs.map(x=>x.occurrence_id)));setError('');
 }catch(e){setError(e instanceof Error?e.message:String(e));}},[db]);
 useFocusEffect(useCallback(()=>{void refresh()},[refresh]));
 const now=Date.now(),today=localToday();const todo=events.filter(e=>!confirmed.has(e.id));const next=todo[0];
 const todayEvents=events.filter(e=>e.localDate===today),todayDone=todayEvents.filter(e=>confirmed.has(e.id)).length;
 const take=async(item:DisplayOccurrence)=>{
  if(busy)return;setBusy(item.id);
  try{const inserted=await confirmOccurrence(db,item,item.medicationName);await refresh();try{await reconcileMedicationReminders(db)}catch(_error){Alert.alert(t('home.confirmSaved'),t('home.reminderUpdateError'))}if(!inserted)Alert.alert(t('home.confirmSaved'),t('home.alreadyConfirmed'));}
  catch(e){Alert.alert(t('home.confirmError'),String(e));}finally{setBusy('');}
 };
 return <Page title={t('home.title')} subtitle={t('home.subtitle')}>
  {expoGoSafe?<Panel tone="peach"><Heading>{t('home.expoTitle')}</Heading><Body>{t('home.expoBody')}</Body></Panel>:null}
  <Panel tone="mint">
   <Image source={require('../../assets/brandmark.png')} style={{width:74,height:74,alignSelf:'center',marginBottom:8}} resizeMode="contain" accessibilityLabel="KAlarm"/>
   <Heading>{next?t('home.nextDose'):medicationCount===0?t('home.welcome'):t('home.nextDoseEmpty')}</Heading>
   {next?<><Text style={{fontSize:34,fontWeight:'900',color:c.ink,textAlign:'center',marginVertical:4}}>{next.localTime}</Text><Text style={{fontSize:18,fontWeight:'800',color:c.primary,textAlign:'center'}}>{next.medicationName}</Text><Body style={{textAlign:'center'}}>{localizedQuantity(next.quantity,next.unit,language)} · {formatDay(next.localDate)}</Body></>:<Body muted style={{textAlign:'center'}}>{medicationCount===0?t('home.welcomeBody'):t('home.todayEmpty')}</Body>}
   <View style={{height:14}}/><Action label={t('home.addMedication')} icon="add" onPress={()=>router.push('/medication/new')}/>
  </Panel>
  <Panel><View style={{flexDirection:'row',alignItems:'center',gap:12}}><SoftCareIcon name="calendar" size={42}/><View style={{flex:1}}><Heading>{t('common.today')}</Heading><Body>{t('home.todaySummary',{total:todayEvents.length,done:todayDone})}</Body></View></View></Panel>
  {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
  <Heading>{t('home.scheduleTitle')}</Heading>
  {events.length===0?<Panel><SoftCareIcon name="calendar" size={58}/><Body muted>{t('home.noSchedule')}</Body></Panel>:events.slice(0,12).map(item=>{
   const isConfirmed=confirmed.has(item.id),isDue=new Date(item.plannedAtISO).getTime()<=now;
   return <Panel key={item.id}><View style={{flexDirection:'row',alignItems:'center',gap:12}}><SoftCareIcon name={isConfirmed?'taken':isDue?'pending':'alarm'} size={44}/><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:c.ink}}>{item.medicationName}</Text><Body>{formatDay(item.localDate)} · {item.localTime}</Body><Body>{localizedQuantity(item.quantity,item.unit,language)}</Body><Text style={{color:c.muted,fontSize:13}}>{isConfirmed?t('home.confirmed'):isDue?t('home.due'):t('home.upcoming')}</Text></View></View>
   {!isConfirmed&&isDue?<View style={{marginTop:14}}><Action label={busy===item.id?t('home.registering'):t('home.confirmTake')} icon="confirm" disabled={!!busy} onPress={()=>void take(item)}/></View>:null}
  </Panel>;
  })}
  <Panel tone="blue"><Heading>{t('home.reminderTitle')}</Heading><Body muted>{t('home.reminderBody')}</Body><View style={{height:10}}/><Action label={expoGoSafe?t('home.reminderActionSafe'):t('home.reminderAction')} secondary icon="alarm" onPress={()=>router.push('/reminder-settings')}/></Panel>
 </Page>;
}
