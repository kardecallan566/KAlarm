import React,{useCallback,useState} from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Page, Panel, Heading, Body } from '../../src/components/ui';
import { SoftCareIcon } from '../../src/components/icons/SoftCareIcon';
import { listMedications,upcomingForMedications,getConfirmations } from '../../src/data/medications';
import { localToday,offsetDate,formatDay,readableQuantity } from '../../src/core/dates';
import type { Occurrence } from '../../src/core/scheduling';
type Item=Occurrence & {medicationName:string};
export default function Calendar(){
  const db=useSQLiteContext();const [list,setList]=useState<Item[]>([]);const [confirmed,setConfirmed]=useState(new Set<string>());const [error,setError]=useState('');
  useFocusEffect(useCallback(()=>{let active=true;const from=localToday();Promise.all([listMedications(db),getConfirmations(db)]).then(([meds,logs])=>{
    if(active){setList(upcomingForMedications(meds,from,offsetDate(from,13)));setConfirmed(new Set(logs.map(x=>x.occurrence_id)));setError('');}
  }).catch(e=>active&&setError(String(e)));return()=>{active=false}},[db]));
  const days=Array.from(new Set(list.map(x=>x.localDate)));
  return <Page title="Calendário" subtitle="Próximos 14 dias, conforme a programação cadastrada.">
    {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
    {days.length===0?<Panel tone="blue"><SoftCareIcon name="weekly" size={76}/><Heading>Sem programações</Heading><Body muted>As doses aparecerão aqui depois que você cadastrar um medicamento.</Body></Panel>:days.map(day=><Panel key={day} tone="blue"><Heading>{formatDay(day)}</Heading>{list.filter(x=>x.localDate===day).map(x=><Body key={x.id}>• {x.localTime} — {x.medicationName} — {readableQuantity(x.quantity,x.unit)}{confirmed.has(x.id)?' · Confirmado':''}</Body>)}</Panel>)}
  </Page>;
}
