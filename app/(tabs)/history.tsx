import React,{useCallback,useState} from 'react';
import {useFocusEffect} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import {Page,Panel,Heading,Body} from '../../src/components/ui';
import {SoftCareIcon} from '../../src/components/icons/SoftCareIcon';
import {getConfirmations,type IntakeConfirmation} from '../../src/data/medications';
import {formatDay} from '../../src/core/dates';
import {useLanguage} from '../../src/i18n/LanguageProvider';
import {localizedQuantity} from '../../src/i18n/quantity';
export default function History(){
 const db=useSQLiteContext();const {t,language}=useLanguage();const [logs,setLogs]=useState<IntakeConfirmation[]>([]);const [error,setError]=useState('');
 useFocusEffect(useCallback(()=>{let active=true;getConfirmations(db).then(x=>active&&setLogs(x)).catch(e=>active&&setError(String(e)));return()=>{active=false}},[db]));
 return <Page title={t('history.title')} subtitle={t('history.subtitle')}>
  {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
  {logs.length===0?<Panel><SoftCareIcon name="empty" size={76}/><Heading>{t('history.emptyTitle')}</Heading><Body muted>{t('history.emptyBody')}</Body></Panel>:logs.map(l=><Panel key={l.occurrence_id}><SoftCareIcon name="taken" size={42}/><Heading>{l.medication_name}</Heading><Body>{formatDay(l.local_date)} — {localizedQuantity(l.quantity,l.unit,language)}</Body><Body muted>{t('history.recorded')} {new Date(l.confirmed_at_utc).toLocaleString(language==='pt-BR'?'pt-BR':'en-US')}</Body></Panel>)}
 </Page>;
}
