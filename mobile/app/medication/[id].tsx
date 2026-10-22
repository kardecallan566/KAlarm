import React, { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';
import { useLocalSearchParams, useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Action, Body, Heading, Page, Panel } from '../../src/components/ui';
import { getMedication, setArchived, type Medication } from '../../src/data/medications';
import { previewWindow, localToday, offsetDate, readableQuantity, formatDay } from '../../src/core/dates';
export default function MedicationDetail(){
  const {id}=useLocalSearchParams<{id:string}>();const router=useRouter();const db=useSQLiteContext();
  const [med,setMed]=useState<Medication|null>(null);
  useFocusEffect(useCallback(()=>{let active=true;getMedication(db,id).then(x=>{if(active)setMed(x)});return()=>{active=false}},[id,db]));
  const today=localToday();const list=med?med.schedules.flatMap(s=>previewWindow(s,today,offsetDate(today,14))).sort((a,b)=>a.plannedAtISO.localeCompare(b.plannedAtISO)):[];
  return <Page title={med?.name??'Medicamento'} subtitle={med?.strengthLabel??'Confira sua programação'}>
    <Panel tone="mint"><Heading>Próximas tomadas</Heading>{list.length?list.slice(0,18).map(x=><Body key={x.id}>{formatDay(x.localDate)} às {x.localTime} — {readableQuantity(x.quantity,x.unit)}</Body>):<Body muted>Sem doses futuras nessa janela.</Body>}</Panel>
    {med&&!med.archived?<><Action label="Editar doses a partir de amanhã" icon="edit" onPress={()=>router.push({pathname:'/medication/new',params:{id:med.id}})}/>
      <Action label="Arquivar medicamento" secondary icon="pause" onPress={()=>Alert.alert('Arquivar medicamento?', 'Ele deixará de aparecer na rotina. O histórico confirmado será preservado.',[
        {text:'Cancelar',style:'cancel'},{text:'Arquivar',onPress:async()=>{await setArchived(db,med.id,true);router.replace('/(tabs)/medicines')}}])}/></>:null}
  </Page>;
}
