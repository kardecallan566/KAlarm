import React, { useCallback, useState } from 'react';
import { Alert,Image,View,Text } from 'react-native';
import { useFocusEffect,useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Action, Body, Heading, Page, Panel } from '../../src/components/ui';
import { SoftCareIcon } from '../../src/components/icons/SoftCareIcon';
import { reconcileMedicationReminders } from '../../src/services/medicationReminders';
import { listMedications,upcomingForMedications,getConfirmations,confirmOccurrence } from '../../src/data/medications';
import { localToday,offsetDate,readableQuantity,formatDay } from '../../src/core/dates';
import { colors as c } from '../../src/theme';
import type { Occurrence } from '../../src/core/scheduling';
type DisplayOccurrence=Occurrence & {medicationName:string};
const expoGoSafe = process.env.EXPO_PUBLIC_KALARM_GO_SAFE === '1';
export default function Home(){
  const router=useRouter();const db=useSQLiteContext();
  const [events,setEvents]=useState<DisplayOccurrence[]>([]);const [confirmed,setConfirmed]=useState<Set<string>>(new Set());const [error,setError]=useState('');const [busy,setBusy]=useState('');
  const refresh=useCallback(async()=>{const today=localToday();try{
    const [meds,logs]=await Promise.all([listMedications(db),getConfirmations(db)]);
    const planned=upcomingForMedications(meds,today,offsetDate(today,3));
    setEvents(planned);setConfirmed(new Set(logs.map(x=>x.occurrence_id)));setError('');
  }catch(e){setError(e instanceof Error?e.message:String(e));}},[db]);
  useFocusEffect(useCallback(()=>{void refresh()},[refresh]));
  const now=Date.now();const todo=events.filter(e=>!confirmed.has(e.id));const due=todo.filter(x=>new Date(x.plannedAtISO).getTime()<=now);
  const next=todo[0];
  const take=async(item:DisplayOccurrence)=>{
    if(busy)return;setBusy(item.id);
    try{const inserted=await confirmOccurrence(db,item,item.medicationName);await refresh();try{await reconcileMedicationReminders(db)}catch(_error){Alert.alert('Tomada registrada','O registro foi salvo, mas os avisos precisam ser conferidos em Meus alarmes.')}if(!inserted)Alert.alert('Já confirmado','Esta tomada já foi registrada.');}
    catch(e){Alert.alert('Não foi possível confirmar',String(e));}
    finally{setBusy('');}
  };
  return <Page title="Sua rotina de cuidado" subtitle="Organize seus horários com tranquilidade.">
    {expoGoSafe?<Panel tone="peach"><Heading>Modo de teste Expo Go</Heading><Body>Este modo permite testar telas, cadastro e banco local. Os alarmes estão desativados neste teste. Para testá-los, instale a Development Build do KAlarm.</Body></Panel>:null}
    <Panel tone="mint"><Image source={require('../../assets/brandmark.png')} style={{width:82,height:82,alignSelf:'center'}} resizeMode="contain" accessibilityLabel="KAlarm"/>
      <Heading>{next?'Próxima dose programada':'Seus lembretes em um só lugar'}</Heading>
      {next?<><Text style={{fontSize:27,fontWeight:'800',color:c.ink}}>{next.localTime}</Text><Body>{next.medicationName}</Body><Body>{readableQuantity(next.quantity,next.unit)} · {formatDay(next.localDate)}</Body></>:<Body muted>Adicione seu primeiro medicamento para montar a rotina.</Body>}
      <View style={{height:12}}/><Action label="Adicionar medicamento" icon="add" onPress={()=>router.push('/medication/new')}/>
    </Panel>
    {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
    <Heading>Tomadas previstas</Heading>
    {events.length===0?<Panel><SoftCareIcon name="calendar" size={60}/><Body muted>Nenhuma dose programada nos próximos dias.</Body></Panel>:events.slice(0,12).map(item=>{
      const isConfirmed=confirmed.has(item.id);const isDue=new Date(item.plannedAtISO).getTime()<=now;
      return <Panel key={item.id}><View style={{flexDirection:'row',alignItems:'center',gap:12}}><SoftCareIcon name={isConfirmed?'taken':isDue?'pending':'alarm'} size={46}/><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'800',color:c.ink}}>{item.medicationName}</Text><Body>{formatDay(item.localDate)} · {item.localTime}</Body><Body>{readableQuantity(item.quantity,item.unit)}</Body><Text style={{color:c.muted,fontSize:13}}>{isConfirmed?'Confirmada por você':isDue?'Horário atingido, ainda não confirmada':'Dose prevista · confira os alarmes em Ajustes'}</Text></View></View>
        {!isConfirmed&&isDue?<View style={{marginTop:14}}><Action label={busy===item.id?'Registrando...':'Confirmar que tomei'} icon="confirm" disabled={!!busy} onPress={()=>void take(item)}/></View>:null}
      </Panel>;
    })}
    <Panel tone="blue"><Heading>Lembretes de medicamentos</Heading><Body muted>Ative os alarmes e confira as permissões. Os avisos estão sujeitos às limitações do aparelho e precisam de testes reais.</Body><View style={{height:10}}/><Action label={expoGoSafe?'Ver por que os avisos estão desativados':'Ativar e conferir alarmes'} secondary icon="alarm" onPress={()=>router.push('/reminder-settings')}/></Panel>
    <Action label="Ver biblioteca de ícones" secondary icon="settings" onPress={()=>router.push('/icon-gallery')}/>
  </Page>;
}
