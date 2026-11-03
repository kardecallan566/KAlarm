import React,{useCallback,useState} from 'react';
import {Platform,Linking,Text,View} from 'react-native';
import {useFocusEffect,useRouter} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import {Page,Panel,Heading,Body,Action,StatusLine} from '../src/components/ui';
import {updateReminderSettings} from '../src/data/reminderSettings';
import {readReminderDiagnostic,reconcileMedicationReminders,requestMedicationPermission,type ReminderDiagnostic} from '../src/services/medicationReminders';

export default function ReminderSettingsScreen(){
 const db=useSQLiteContext(),router=useRouter();
 const [status,setStatus]=useState<ReminderDiagnostic|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const refresh=useCallback(async()=>setStatus(await readReminderDiagnostic(db)),[db]);
 useFocusEffect(useCallback(()=>{void refresh().catch(e=>setMessage(String(e)));return()=>{}},[refresh]));
 const work=async(action:()=>Promise<void>)=>{
  if(busy)return;setBusy(true);
  try{await action();setMessage('Configuração atualizada.')}
  catch(e){setMessage(e instanceof Error?e.message:String(e))}
  finally{await refresh().catch(()=>{});setBusy(false)}
 };
 return <Page title="Meus alarmes" subtitle="Ative os lembretes e confira como o aparelho está agendando os avisos.">
  <Action label="Voltar" secondary onPress={()=>router.back()}/>
  <Panel tone="mint"><Heading>Estado dos lembretes</Heading>
   <StatusLine ok={status?.enabled??null} title="Lembretes" details={status?.enabled?'Ativados por você':'Desativados por padrão'}/>
   <StatusLine ok={status?.permitted??null} title="Permissão de notificação" details={status?.permitted?'Concedida':'Necessária para avisos'}/>
   <StatusLine ok={status?.exact??null} title="Permissão de alarme exato" details={Platform.OS==='android'?(status?.exact?'Disponível':'Podem ocorrer atrasos'):'Não aplicável ao Android neste aparelho'}/>
   <Body muted>Avisos futuros no sistema: {status?.scheduled??'–'}. Agendado não significa entregue.</Body>
   <Body muted>Modo: {status?.mode??'–'}. Até {status?.maximumNotifications??40} notificações numa janela inicial de {status?.horizonDays??30} dias.</Body>
  </Panel>
  <Panel><Heading>Ativação</Heading>
   <Body muted>O KAlarm só solicita permissões quando você decide ativar. Uma notificação nunca confirma uma dose.</Body>
   <View style={{height:12}}/>
   <Action icon={status?.enabled?'pause':'bell'} disabled={busy} label={status?.enabled?'Desativar lembretes':'Ativar lembretes de medicamentos'} onPress={()=>void work(async()=>{
    if(status?.enabled){await updateReminderSettings(db,{enabled:false});await reconcileMedicationReminders(db);return}
    if(!await requestMedicationPermission())throw new Error('Permissão negada. Ative as notificações nas configurações do aparelho.');
    await updateReminderSettings(db,{enabled:true});await reconcileMedicationReminders(db);
   })}/>
   {!status?.permitted?<Action label="Abrir configurações do aplicativo" icon="settings" secondary onPress={()=>void Linking.openSettings()}/>:null}
  </Panel>
  <Panel tone="blue"><Heading>Privacidade da notificação</Heading>
   <Body muted>O padrão é discreto: ocultar nome e dose do aviso para não expor informações na tela bloqueada.</Body>
   <View style={{height:12}}/>
   <Action secondary icon="edit" disabled={busy} label={status?.showDetails?'Ocultar nome e dose':'Mostrar nome e dose no aviso'} onPress={()=>void work(async()=>{
    await updateReminderSettings(db,{showDetails:!status?.showDetails});
    await reconcileMedicationReminders(db);
   })}/>
  </Panel>
  <Panel><Heading>Diagnóstico</Heading>
   <Action secondary icon="repeat-cycle" disabled={busy} label="Rever e atualizar alarmes" onPress={()=>void work(async()=>{await reconcileMedicationReminders(db)})}/>
   <Action secondary icon="alarm" label="Teste de aviso em 60 segundos" onPress={()=>router.push('/alarm-test')}/>
   <Body muted>Esta versão experimental renova avisos ao abrir o aplicativo ou editar rotinas. Se ele ficar fechado por muitas semanas, a cobertura pode terminar; ainda precisamos validar no Android.</Body>
  </Panel>
  {message?<Panel tone="peach"><Text accessibilityRole="alert">{message}</Text></Panel>:null}
 </Page>;
}
