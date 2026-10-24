import { useCallback, useEffect, useState } from 'react';
import { AppState, Platform, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Action, Body, Heading, Page, Panel, StatusLine } from '../src/components/ui';
import { colors } from '../src/theme';
import { askForNotifications, cancelPendingTests, readDiagnostic, scheduleTestAlert, type AlarmDiagnostic } from '../src/services/alarmSpike';

export default function AlarmTest(){
  const router=useRouter();
  const [diag,setDiag]=useState<AlarmDiagnostic|null>(null);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('Ainda não foi realizado nenhum teste neste aparelho.');
  const refresh=useCallback(async()=>{
    try {setDiag(await readDiagnostic());}
    catch(e){setMessage(`Falha ao consultar permissões: ${String(e)}`);}
  },[]);
  useEffect(()=>{
    void refresh();
    const subscription=AppState.addEventListener('change',state=>{if(state==='active')void refresh();});
    return ()=>subscription.remove();
  },[refresh]);
  const safely=async(operation:()=>Promise<unknown>,success:string)=>{
    if(busy) return;setBusy(true);
    try {await operation();if (success) setMessage(success);}
    catch(error){setMessage(`Não foi possível concluir: ${String(error)}`);}
    finally{await refresh();setBusy(false);}
  };
  return <Page title="Verificar alarmes" subtitle="Teste técnico de notificações do KAlarm, sem cadastrar medicamentos.">
    <Action label="Voltar" secondary onPress={()=>router.back()}/>
    <Action label="Gerenciar alarmes de medicamentos" secondary onPress={()=>router.push('/reminder-settings')}/>
    <Panel tone="mint"><Heading>Estado do aparelho</Heading>
      <StatusLine ok={diag?.notificationPermission??null} title="Permissão de notificações" details={diag?.notificationPermission?'Concedida':'Negada ou indisponível'}/>
      <StatusLine ok={diag?.exactAlarmPermission??null} title="Alarme exato" details={Platform.OS==='android'?'Não disponível neste SDK; o aviso pode atrasar.':'Não avaliado neste teste.'}/>
      <StatusLine ok={diag?diag.pendingTests>0:null} title="Testes pendentes" details={`${diag?.pendingTests??'–'} notificação(ões) de teste registradas no SO`}/>
      <Body muted style={{fontSize:13,marginTop:10}}>Última consulta: {diag?.collectedAt??'–'}</Body>
    </Panel>
    <Panel><Heading>Permissões</Heading>
      <Action label="Solicitar notificações" secondary disabled={busy} onPress={()=>{void safely(askForNotifications,'Solicitação concluída. Confira o estado acima.');}} icon="bell"/>
      <Action label="Atualizar diagnóstico" secondary disabled={busy} onPress={()=>{void safely(refresh,'Diagnóstico atualizado.');}}/>
    </Panel>
    <Panel tone="blue"><Heading>Teste: aviso em 60 segundos</Heading>
      <Body>O teste agenda uma notificação local. Bloqueie a tela e observe o horário em que ela aparece. O app não confirma automaticamente o recebimento.</Body>
      <View style={{height:14}}/>
      <Action label="Programar aviso de teste" disabled={busy||!diag?.notificationPermission} onPress={()=>{void safely(async()=>{
        const result=await scheduleTestAlert();
        setMessage(`Teste registrado para ${result.time} (${result.mode}). ID: ${result.id.slice(0,12)}…`);
      },'');}} icon="alarm"/>
      <Action label="Cancelar apenas testes pendentes" secondary disabled={busy||!diag?.pendingTests} onPress={()=>{void safely(async()=>{
        const count=await cancelPendingTests();setMessage(`${count} teste(s) cancelado(s).`);
      },'');}} icon="pause"/>
    </Panel>
    <Panel><Heading>Resultado da última operação</Heading>
      <Body>{message}</Body>
      <Text style={{color:colors.muted,fontSize:13,marginTop:12,lineHeight:19}}>"Registrado no sistema" não significa "entregue". O teste exige observação real e deve ser repetido com app fechado, aparelho bloqueado e após reiniciar o telefone.</Text>
    </Panel>
  </Page>;
}
