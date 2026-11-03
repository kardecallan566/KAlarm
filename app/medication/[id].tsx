import React,{useCallback,useState} from 'react';
import {Alert} from 'react-native';
import {useLocalSearchParams,useFocusEffect,useRouter} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import {Action,Body,Heading,Page,Panel} from '../../src/components/ui';
import {reconcileMedicationReminders} from '../../src/services/medicationReminders';
import {getMedication,setArchived,type Medication} from '../../src/data/medications';
import {previewWindow,localToday,offsetDate} from '../../src/core/dates';
import {useLanguage} from '../../src/i18n/LanguageProvider';
import {localizedQuantity} from '../../src/i18n/quantity';
import {localizedDay} from '../../src/i18n/date';
export default function MedicationDetail(){
 const {id}=useLocalSearchParams<{id:string}>();const router=useRouter();const db=useSQLiteContext();const {t,language}=useLanguage();const [med,setMed]=useState<Medication|null>(null);
 useFocusEffect(useCallback(()=>{let active=true;getMedication(db,id).then(x=>{if(active)setMed(x)});return()=>{active=false}},[id,db]));
 const today=localToday();const list=med?med.schedules.flatMap(s=>previewWindow(s,today,offsetDate(today,14))).sort((a,b)=>a.plannedAtISO.localeCompare(b.plannedAtISO)):[];
 return <Page title={med?.name??t('medDetail.title')} subtitle={med?.strengthLabel??t('medDetail.subtitle')}>
  <Panel tone="mint"><Heading>{t('medDetail.upcoming')}</Heading>{list.length?list.slice(0,18).map(x=><Body key={x.id}>{localizedDay(x.localDate,language)} {language==='pt-BR'?'às':'at'} {x.localTime} — {localizedQuantity(x.quantity,x.unit,language)}</Body>):<Body muted>{t('medDetail.noUpcoming')}</Body>}</Panel>
  {med&&!med.archived?<><Action label={t('medDetail.edit')} icon="edit" onPress={()=>router.push({pathname:'/medication/new',params:{id:med.id}})}/>
   <Action label={t('medDetail.archive')} secondary icon="pause" onPress={()=>Alert.alert(t('medDetail.archiveTitle'),t('medDetail.archiveBody'),[{text:t('common.cancel'),style:'cancel'},{text:t('medDetail.archive'),onPress:async()=>{await setArchived(db,med.id,true);try{await reconcileMedicationReminders(db)}catch(_error){Alert.alert(t('medDetail.archived'),t('reminders.syncWarning'))}router.replace('/(tabs)/medicines')}}])}/>:null}
 </Page>;
}
