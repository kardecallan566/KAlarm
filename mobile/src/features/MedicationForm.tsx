import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Action, Body, Heading, Page, Panel } from '../components/ui';
import { SoftCareIcon } from '../components/icons/SoftCareIcon';
import { colors as c } from '../theme';
import type { DayPlan, Recurrence, Schedule, Unit, Weekday } from '../core/scheduling';
import { previewOccurrences } from '../core/scheduling';
import { deviceTimezone, formatDay, localToday, offsetDate, readableQuantity } from '../core/dates';
import { DayEditor, NO_DOSE, newDay } from './DayEditor';
import { getMedication, saveMedication } from '../data/medications';

const weekdayNames=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
const clone=(x:DayPlan):DayPlan=>JSON.parse(JSON.stringify(x)) as DayPlan;
const newWeek=():Record<Weekday,DayPlan>=>({1:clone(NO_DOSE),2:clone(NO_DOSE),3:clone(NO_DOSE),4:clone(NO_DOSE),5:clone(NO_DOSE),6:clone(NO_DOSE),7:clone(NO_DOSE)});
type Mode='daily'|'weekly-matrix'|'cycle';
export function MedicationForm({id}:{id?:string}) {
  const db=useSQLiteContext();const router=useRouter();const {width}=useWindowDimensions();
  const [loading,setLoading]=useState(!!id);const [saving,setSaving]=useState(false);
  const [name,setName]=useState('');const [strength,setStrength]=useState('');
  const [form,setForm]=useState<Unit>('tablet');const [startDate,setStartDate]=useState(localToday());
  const [mode,setMode]=useState<Mode>('daily');const [daily,setDaily]=useState<DayPlan>(newDay());
  const [week,setWeek]=useState<Record<Weekday,DayPlan>>(newWeek);
  const [steps,setSteps]=useState<DayPlan[]>([newDay(),newDay()]);
  const [selected,setSelected]=useState(1);const [reviewed,setReviewed]=useState(false);
  const [preview,setPreview]=useState<ReturnType<typeof previewOccurrences>>([]);const [error,setError]=useState('');
  const timezone=useMemo(deviceTimezone,[]);
  const changed=()=>{setReviewed(false);setError('');};
  useEffect(()=>{if(!id)return;let active=true;
    getMedication(db,id).then(m=>{if(!m||!active)return;const schedule=m.schedules.at(-1);if(!schedule)return;
      setName(m.name);setStrength(m.strengthLabel??'');setForm(m.form);setStartDate(schedule.startDate);
      const r=schedule.recurrence;
      if(r.mode==='daily'){setMode('daily');setDaily(r.plan);}
      if(r.mode==='weekly-matrix'){setMode('weekly-matrix');setWeek(r.days);}
      if(r.mode==='cycle'){setMode('cycle');setSteps(r.steps);}
      setLoading(false);
    }).catch(e=>{if(active){setError(String(e));setLoading(false);}});
    return()=>{active=false};
  },[db,id]);
  const makeRecurrence=():Recurrence=>mode==='daily'?{mode,plan:daily}:mode==='weekly-matrix'?{mode,days:week}:{mode,anchorDate:id?offsetDate(localToday(timezone),1):startDate,steps};
  const review=()=>{
    try {
      if(!name.trim())throw new Error('Escreva o nome do medicamento.');
      const effectiveStart=id?offsetDate(localToday(timezone),1):startDate;
      const schedule:Schedule={id:'preview',medicationId:'preview',version:1,timezone,startDate:effectiveStart,recurrence:makeRecurrence()};
      const result=previewOccurrences(schedule,{from:effectiveStart,to:offsetDate(effectiveStart,29)});
      if(result.length===0)throw new Error('Adicione ao menos uma dose nos próximos 30 dias.');
      setPreview(result);setReviewed(true);setError('');
    }catch(e){setError(e instanceof Error?e.message:String(e));setReviewed(false);}
  };
  const save=async()=>{
    if(!reviewed||saving)return;
    setSaving(true);
    try{await saveMedication(db,{name,form,strengthLabel:strength,startDate,timezone,recurrence:makeRecurrence()},id);router.replace('/(tabs)/medicines');}
    catch(e){setError(e instanceof Error?e.message:String(e));}
    finally{setSaving(false);}
  };
  if(loading)return <Page title="Carregando medicamento"><ActivityIndicator/></Page>;
  const activePlan=mode==='daily'?daily:mode==='weekly-matrix'?week[selected as Weekday]:steps[selected-1];
  const setPlan=(p:DayPlan)=>{changed();if(mode==='daily')setDaily(p);else if(mode==='weekly-matrix')setWeek(old=>({...old,[selected]:p}));else setSteps(old=>old.map((x,i)=>i===selected-1?p:x));};
  return <Page title={id?'Editar medicamento':'Novo medicamento'} subtitle="Organize as doses exatamente como foram prescritas. O KAlarm não recomenda quantidades.">
    <Panel>
      <Heading>1. Qual medicamento?</Heading>
      <Text style={label}>Nome</Text><TextInput style={field} value={name} onChangeText={v=>{setName(v);changed()}} maxLength={160} placeholder="Nome na embalagem" accessibilityLabel="Nome do medicamento"/>
      <Text style={label}>Concentração/apresentação (opcional)</Text><TextInput style={field} value={strength} onChangeText={v=>{setStrength(v);changed()}} placeholder="Ex.: 5 mg por comprimido" accessibilityLabel="Concentração"/>
      <Text style={label}>Forma do medicamento</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{([{value:'tablet',label:'Comprimido'},{value:'capsule',label:'Cápsula'},{value:'drop',label:'Gotas'},{value:'ml',label:'Líquido (mL)'},{value:'other',label:'Outro'}] as const).map(x=><Pressable key={x.value} accessibilityRole="button" accessibilityState={{selected:form===x.value}} onPress={()=>{setForm(x.value);changed()}} style={[chip,form===x.value?chipActive:null]}><Text style={{fontWeight:'700',color:form===x.value?c.surface:c.primary}}>{x.label}</Text></Pressable>)}</View>
      <Text style={label}>Início da programação (AAAA-MM-DD)</Text><TextInput style={field} value={startDate} onChangeText={v=>{setStartDate(v);changed()}} maxLength={10} placeholder="2026-10-21" accessibilityLabel="Data de início" editable={!id}/>
      {id?<Body muted>Para proteger o histórico, alterações em rotinas existentes começam amanhã.</Body>:null}
    </Panel>
    <Panel tone="mint"><Heading>2. Qual é a sua rotina?</Heading>
      {[{key:'daily',title:'Todos os dias',icon:'clock'},{key:'weekly-matrix',title:'Diferente em cada dia da semana',icon:'weekly'},{key:'cycle',title:'Alternância contínua de dias',icon:'repeat-cycle'}].map(x=><Pressable key={x.key} accessibilityRole="button" accessibilityState={{selected:mode===x.key}} onPress={()=>{setMode(x.key as Mode);setSelected(1);changed()}} style={{flexDirection:'row',alignItems:'center',gap:12,padding:11,marginBottom:7,borderRadius:15,backgroundColor:mode===x.key?'#C7E6D4':c.surface}}><SoftCareIcon name={x.icon as 'clock'|'weekly'|'repeat-cycle'} size={42}/><Text style={{color:c.ink,fontSize:16,fontWeight:mode===x.key?'800':'600',flex:1}}>{x.title}</Text></Pressable>)}
    </Panel>
    <Heading>3. Configure as doses</Heading>
    {mode!=='daily'?<View style={{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:12}}>{Array.from({length:mode==='weekly-matrix'?7:steps.length},(_,i)=>i+1).map(n=><Pressable key={n} onPress={()=>setSelected(n)} accessibilityRole="button" accessibilityState={{selected:n===selected}} style={[chip,n===selected?chipActive:null]}><Text style={{color:n===selected?c.surface:c.primary,fontWeight:'800'}}>{mode==='cycle'?`Etapa ${n}`:weekdayNames[n-1]}</Text></Pressable>)}</View>:null}
    {activePlan?<DayEditor label={mode==='daily'?'Dose diária':mode==='weekly-matrix'?`Dose de ${weekdayNames[selected-1]}`:`Dia ${selected} do ciclo`} plan={activePlan} onChange={setPlan}/>:null}
    {mode==='cycle'?<View style={{flexDirection:'row',gap:10,flexWrap:'wrap',marginBottom:18}}><Action label="Adicionar etapa" icon="add" secondary onPress={()=>{if(steps.length<30){setSteps(x=>[...x,newDay()]);changed();}}}/>{steps.length>2?<Action label="Remover última etapa" icon="delete" secondary onPress={()=>{setSteps(x=>x.slice(0,-1));setSelected(1);changed()}}/>:null}</View>:null}
    {mode==='weekly-matrix'?<Body muted>Os sete dias são independentes. Os dias marcados "Sem dose" não geram alarmes.</Body>:null}
    {mode==='cycle'?<Body muted>O ciclo não reinicia às segundas. A sequência continua a partir da data inicial.</Body>:null}
    <View style={{height:16}}/><Action label="4. Conferir próximas doses" icon="calendar" onPress={review}/>
    {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
    {reviewed?<Panel tone="blue"><Heading>Confira sua programação</Heading>
      <Body muted>Prévia de 30 dias. Revise as doses e os horários conforme sua prescrição antes de salvar.</Body>
      {preview.slice(0,24).map(o=><View key={o.id} style={{paddingVertical:8,borderBottomWidth:1,borderBottomColor:c.border,flexDirection:width>=520?'row':'column',gap:6,justifyContent:'space-between'}}><Text style={{color:c.ink,fontWeight:'700'}}>{formatDay(o.localDate)} · {o.localTime}</Text><Body>{readableQuantity(o.quantity,o.unit)}</Body></View>)}
      {preview.length>24?<Body muted>Mais {preview.length-24} tomadas previstas nesta janela.</Body>:null}
      <View style={{height:14}}/><Action label={saving?'Salvando...':'Confirmar e salvar tratamento'} disabled={saving} icon="confirm" onPress={save}/>
      <Body muted>Salva no celular. O agendamento automático de notificações de tratamento ainda está em desenvolvimento.</Body>
    </Panel>:null}
  </Page>;
}
const label={color:c.ink,fontSize:14,fontWeight:'700' as const,marginTop:10,marginBottom:6};
const field={backgroundColor:c.background,borderColor:c.border,borderWidth:1,borderRadius:14,padding:12,color:c.ink,fontSize:16,minHeight:48};
const chip={paddingHorizontal:13,paddingVertical:10,borderRadius:12,backgroundColor:c.surface,minHeight:40,justifyContent:'center' as const};
const chipActive={backgroundColor:c.primary};
