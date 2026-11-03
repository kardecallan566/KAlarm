import React,{useCallback,useState} from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Page, Panel, Heading, Body } from '../../src/components/ui';
import { SoftCareIcon } from '../../src/components/icons/SoftCareIcon';
import { getConfirmations, type IntakeConfirmation } from '../../src/data/medications';
import { formatDay,readableQuantity } from '../../src/core/dates';
export default function History(){
  const db=useSQLiteContext();const [logs,setLogs]=useState<IntakeConfirmation[]>([]);const [error,setError]=useState('');
  useFocusEffect(useCallback(()=>{let active=true;getConfirmations(db).then(x=>active&&setLogs(x)).catch(e=>active&&setError(String(e)));return()=>{active=false}},[db]));
  return <Page title="Histórico" subtitle="Somente tomadas que você confirmou manualmente.">
    {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
    {logs.length===0?<Panel><SoftCareIcon name="empty" size={76}/><Heading>Nenhuma confirmação registrada</Heading><Body muted>Notificação recebida ou dispensada não significa que um medicamento foi tomado.</Body></Panel>:logs.map(l=><Panel key={l.occurrence_id}><SoftCareIcon name="taken" size={42}/><Heading>{l.medication_name}</Heading><Body>{formatDay(l.local_date)} — {readableQuantity(l.quantity,l.unit)}</Body><Body muted>Registrado: {new Date(l.confirmed_at_utc).toLocaleString('pt-BR')}</Body></Panel>)}
  </Page>;
}
