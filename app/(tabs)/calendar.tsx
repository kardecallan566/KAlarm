import React,{useCallback,useState} from 'react';
import {useFocusEffect} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import {Page,Panel,Heading,Body} from '../../src/components/ui';
import {SoftCareIcon} from '../../src/components/icons/SoftCareIcon';
import {listMedications,upcomingForMedications,getConfirmations} from '../../src/data/medications';
import {localToday,offsetDate} from '../../src/core/dates';
import {localizedDay} from '../../src/i18n/date';
import {useLanguage} from '../../src/i18n/LanguageProvider';
import {localizedQuantity} from '../../src/i18n/quantity';
import type {Occurrence} from '../../src/core/scheduling';
type Item=Occurrence&{medicationName:string};
export default function Calendar(){
 const db=useSQLiteContext();const {t,language}=useLanguage();const [list,setList]=useState<Item[]>([]);const [confirmed,setConfirmed]=useState(new Set<string>());const [error,setError]=useState('');
 useFocusEffect(useCallback(()=>{let active=true;const from=localToday();Promise.all([listMedications(db),getConfirmations(db)]).then(([meds,logs])=>{if(active){setList(upcomingForMedications(meds,from,offsetDate(from,13)));setConfirmed(new Set(logs.map(x=>x.occurrence_id)));setError('')}}).catch(e=>active&&setError(String(e)));return()=>{active=false}},[db]));
 const days=Array.from(new Set(list.map(x=>x.localDate)));
 return <Page title={t('calendar.title')} subtitle={t('calendar.subtitle')}>
  {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
  {days.length===0?<Panel tone="blue"><SoftCareIcon name="weekly" size={76}/><Heading>{t('calendar.emptyTitle')}</Heading><Body muted>{t('calendar.emptyBody')}</Body></Panel>:days.map(day=><Panel key={day} tone="blue"><Heading>{localizedDay(day,language)}</Heading>{list.filter(x=>x.localDate===day).map(x=><Body key={x.id}>• {x.localTime} — {x.medicationName} — {localizedQuantity(x.quantity,x.unit,language)}{confirmed.has(x.id)?' · '+t('calendar.confirmed'):''}</Body>)}</Panel>)}
 </Page>;
}
