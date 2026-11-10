import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ActivityIndicator, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Action, Body, Heading, Page, Panel } from '../components/ui';
import { SoftCareIcon } from '../components/icons/SoftCareIcon';
import { colors as c } from '../theme';
import type { DayPlan, Recurrence, Schedule, Unit, Weekday } from '../core/scheduling';
import { previewOccurrences } from '../core/scheduling';
import { deviceTimezone, localToday, offsetDate } from '../core/dates';
import { DayEditor, NO_DOSE, newDay } from './DayEditor';
import { getMedication, saveMedication, type AlarmSound } from '../data/medications';
import { reconcileMedicationReminders } from '../services/medicationReminders';
import {useLanguage} from '../i18n/LanguageProvider';
import {localizedQuantity} from '../i18n/quantity';
import {localizedDay} from '../i18n/date';


const clone=(x:DayPlan):DayPlan=>JSON.parse(JSON.stringify(x)) as DayPlan;
const newWeek=():Record<Weekday,DayPlan>=>({1:clone(NO_DOSE),2:clone(NO_DOSE),3:clone(NO_DOSE),4:clone(NO_DOSE),5:clone(NO_DOSE),6:clone(NO_DOSE),7:clone(NO_DOSE)});
type Mode='daily'|'weekly-matrix'|'cycle';
export function MedicationForm({id}:{id?:string}) {
  const db=useSQLiteContext();const router=useRouter();const {width}=useWindowDimensions();const {t,language}=useLanguage();const weekdayNames=language==='pt-BR'?['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const [loading,setLoading]=useState(!!id);const [saving,setSaving]=useState(false);
  const [name,setName]=useState('');const [strength,setStrength]=useState('');
  const [form,setForm]=useState<Unit>('tablet');const [alarmSound,setAlarmSound]=useState<AlarmSound>('default');const [startDate,setStartDate]=useState(localToday());
  const [mode,setMode]=useState<Mode>('daily');const [daily,setDaily]=useState<DayPlan>(newDay());
  const [week,setWeek]=useState<Record<Weekday,DayPlan>>(newWeek);
  const [steps,setSteps]=useState<DayPlan[]>([newDay(),newDay()]);
  const [selected,setSelected]=useState(1);const [reviewed,setReviewed]=useState(false);
  const [preview,setPreview]=useState<ReturnType<typeof previewOccurrences>>([]);const [error,setError]=useState('');
  const timezone=useMemo(deviceTimezone,[]);
  const changed=()=>{setReviewed(false);setError('');};
  useEffect(()=>{if(!id)return;let active=true;
    getMedication(db,id).then(m=>{if(!m||!active)return;const schedule=m.schedules.at(-1);if(!schedule)return;
      setName(m.name);setStrength(m.strengthLabel??'');setForm(m.form);setAlarmSound(m.alarmSound);setStartDate(schedule.startDate);
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
      if(!name.trim())throw new Error(t('form.nameError'));
      const effectiveStart=id?offsetDate(localToday(timezone),1):startDate;
      const schedule:Schedule={id:'preview',medicationId:'preview',version:1,timezone,startDate:effectiveStart,recurrence:makeRecurrence()};
      const result=previewOccurrences(schedule,{from:effectiveStart,to:offsetDate(effectiveStart,29)});
      if(result.length===0)throw new Error(t('form.noDosesError'));
      setPreview(result);setReviewed(true);setError('');
    }catch(e){setError(e instanceof Error?e.message:String(e));setReviewed(false);}
  };
  const save=async()=>{
    if(!reviewed||saving)return;
    setSaving(true);
    try{await saveMedication(db,{name,form,strengthLabel:strength,alarmSound,startDate,timezone,recurrence:makeRecurrence()},id);try{await reconcileMedicationReminders(db)}catch(_error){Alert.alert(t('form.saveErrorTitle'),t('form.saveErrorBody'))}router.replace('/(tabs)/medicines');}
    catch(e){setError(e instanceof Error?e.message:String(e));}
    finally{setSaving(false);}
  };
  if(loading)return <Page title={t('form.loading')}><ActivityIndicator/></Page>;
  const activePlan=mode==='daily'?daily:mode==='weekly-matrix'?week[selected as Weekday]:steps[selected-1];
  const setPlan=(p:DayPlan)=>{changed();if(mode==='daily')setDaily(p);else if(mode==='weekly-matrix')setWeek(old=>({...old,[selected]:p}));else setSteps(old=>old.map((x,i)=>i===selected-1?p:x));};
  return <Page title={id?t('form.editTitle'):t('form.newTitle')} subtitle={t('form.subtitle')}>
    <Panel>
      <Heading>{t('form.sectionMedication')}</Heading>
      <Text style={label}>{t('form.name')}</Text><TextInput style={field} value={name} onChangeText={v=>{setName(v);changed()}} maxLength={160} placeholder={t('form.namePlaceholder')} accessibilityLabel={t('form.name')}/>
      <Text style={label}>{t('form.strength')}</Text><TextInput style={field} value={strength} onChangeText={v=>{setStrength(v);changed()}} placeholder={t('form.strengthPlaceholder')} accessibilityLabel={t('form.strength')}/>
      <Text style={label}>{t('form.form')}</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{([{value:'tablet',label:t('unit.tablet')},{value:'capsule',label:t('unit.capsule')},{value:'drop',label:t('unit.drop')},{value:'ml',label:t('unit.ml')},{value:'other',label:t('unit.other')}] as const).map(x=><Pressable key={x.value} accessibilityRole="button" accessibilityState={{selected:form===x.value}} onPress={()=>{setForm(x.value);changed()}} style={[chip,form===x.value?chipActive:null]}><Text style={{fontWeight:'700',color:form===x.value?c.surface:c.primary}}>{x.label}</Text></Pressable>)}</View>
      <Text style={label}>{t('form.alarmSound')}</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:4}}>{([{value:'default' as const,label:t('form.soundDefault')},{value:'bell' as const,label:t('form.soundBell')},{value:'chime' as const,label:t('form.soundChime')},{value:'pulse' as const,label:t('form.soundPulse')}] as const).map(x=><Pressable key={x.value} accessibilityRole="button" accessibilityState={{selected:alarmSound===x.value}} onPress={()=>{setAlarmSound(x.value);changed()}} style={[chip,alarmSound===x.value?chipActive:null]}><Text style={{fontWeight:'700',color:alarmSound===x.value?c.surface:c.primary}}>{x.label}</Text></Pressable>)}</View><Body muted>{t('form.alarmSoundNote')}</Body>
      <Text style={label}>{t('form.startDate')}</Text><TextInput style={field} value={startDate} onChangeText={v=>{setStartDate(v);changed()}} maxLength={10} placeholder={t('form.startDatePlaceholder')} accessibilityLabel={t('form.startDateAccessibility')} editable={!id}/>
      {id?<Body muted>{t('form.editStartsTomorrow')}</Body>:null}
    </Panel>
    <Panel tone="mint"><Heading>{t('form.sectionRoutine')}</Heading>
      {[{key:'daily',title:t('form.daily'),icon:'clock'},{key:'weekly-matrix',title:t('form.weekly'),icon:'weekly'},{key:'cycle',title:t('form.cycle'),icon:'repeat-cycle'}].map(x=><Pressable key={x.key} accessibilityRole="button" accessibilityState={{selected:mode===x.key}} onPress={()=>{setMode(x.key as Mode);setSelected(1);changed()}} style={{flexDirection:'row',alignItems:'center',gap:12,padding:11,marginBottom:7,borderRadius:15,backgroundColor:mode===x.key?'#C7E6D4':c.surface}}><SoftCareIcon name={x.icon as 'clock'|'weekly'|'repeat-cycle'} size={42}/><Text style={{color:c.ink,fontSize:16,fontWeight:mode===x.key?'800':'600',flex:1}}>{x.title}</Text></Pressable>)}
    </Panel>
    <Heading>{t('form.sectionDoses')}</Heading>
    {mode!=='daily'?<View style={{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:12}}>{Array.from({length:mode==='weekly-matrix'?7:steps.length},(_,i)=>i+1).map(n=><Pressable key={n} onPress={()=>setSelected(n)} accessibilityRole="button" accessibilityState={{selected:n===selected}} style={[chip,n===selected?chipActive:null]}><Text style={{color:n===selected?c.surface:c.primary,fontWeight:'800'}}>{mode==='cycle'?t('form.cycleStep',{n}):weekdayNames[n-1]}</Text></Pressable>)}</View>:null}
    {activePlan?<DayEditor label={mode==='daily'?t('form.dailyDose'):mode==='weekly-matrix'?t('form.weekdayDose',{day:weekdayNames[selected-1]}):t('form.cycleDay',{n:selected})} plan={activePlan} onChange={setPlan}/>:null}
    {mode==='cycle'?<View style={{flexDirection:'row',gap:10,flexWrap:'wrap',marginBottom:18}}><Action label={t('form.addStep')} icon="add" secondary onPress={()=>{if(steps.length<30){setSteps(x=>[...x,newDay()]);changed();}}}/>{steps.length>2?<Action label={t('form.removeStep')} icon="delete" secondary onPress={()=>{setSteps(x=>x.slice(0,-1));setSelected(1);changed()}}/>:null}</View>:null}
    {mode==='weekly-matrix'?<Body muted>{t('form.weeklyNote')}</Body>:null}
    {mode==='cycle'?<Body muted>{t('form.cycleNote')}</Body>:null}
    <View style={{height:16}}/><Action label={t('form.review')} icon="calendar" onPress={review}/>
    {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
    {reviewed?<Panel tone="blue"><Heading>{t('form.reviewTitle')}</Heading>
      <Body muted>{t('form.reviewBody')}</Body>
      {preview.slice(0,24).map(o=><View key={o.id} style={{paddingVertical:8,borderBottomWidth:1,borderBottomColor:c.border,flexDirection:width>=520?'row':'column',gap:6,justifyContent:'space-between'}}><Text style={{color:c.ink,fontWeight:'700'}}>{localizedDay(o.localDate,language)} · {o.localTime}</Text><Body>{localizedQuantity(o.quantity,o.unit,language)}</Body></View>)}
      {preview.length>24?<Body muted>{t('form.moreDoses',{n:preview.length-24})}</Body>:null}
      <View style={{height:14}}/><Action label={saving?t('form.saving'):t('form.saveTreatment')} disabled={saving} icon="confirm" onPress={save}/>
      <Body muted>{t('form.savedNote')}</Body>
    </Panel>:null}
  </Page>;
}
const label={color:c.ink,fontSize:14,fontWeight:'700' as const,marginTop:10,marginBottom:6};
const field={backgroundColor:c.background,borderColor:c.border,borderWidth:1,borderRadius:14,padding:12,color:c.ink,fontSize:16,minHeight:48};
const chip={paddingHorizontal:13,paddingVertical:10,borderRadius:12,backgroundColor:c.surface,minHeight:40,justifyContent:'center' as const};
const chipActive={backgroundColor:c.primary};
