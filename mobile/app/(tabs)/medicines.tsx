import React, { useCallback, useState } from 'react';
import { Pressable,Text,View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Page, Panel, Heading, Body, Action } from '../../src/components/ui';
import { SoftCareIcon } from '../../src/components/icons/SoftCareIcon';
import { listMedications,type Medication } from '../../src/data/medications';
import { colors as c } from '../../src/theme';

export default function Medicines(){
  const db=useSQLiteContext();const router=useRouter();const [list,setList]=useState<Medication[]>([]);const [error,setError]=useState('');
  useFocusEffect(useCallback(()=>{let active=true;listMedications(db).then(m=>{if(active){setList(m);setError('')}}).catch(e=>active&&setError(String(e)));return()=>{active=false}},[db]));
  return <Page title="Meus medicamentos" subtitle="Cadastre e personalize cada rotina com clareza.">
    <Action label="Adicionar medicamento" icon="add" onPress={()=>router.push('/medication/new')}/>
    {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
    {list.length===0?<Panel tone="mint"><SoftCareIcon name="medicines" size={78}/><Heading>Ainda não há medicamentos</Heading><Body muted>Comece com uma dose diária ou personalize os horários para cada dia da semana.</Body></Panel>:
      list.map(m=><Pressable key={m.id} accessibilityRole="button" accessibilityLabel={`Abrir ${m.name}`} onPress={()=>router.push({pathname:'/medication/[id]',params:{id:m.id}})}>
        <Panel><View style={{flexDirection:'row',alignItems:'center',gap:12}}><SoftCareIcon name="medicines" size={52}/><View style={{flex:1}}><Heading>{m.name}</Heading><Text style={{color:c.muted,fontSize:14}}>{m.strengthLabel||'Sem concentração informada'}</Text><Text style={{color:c.primary,fontWeight:'700',marginTop:4}}>{m.schedules.length} {m.schedules.length===1?'versão da rotina':'versões da rotina'}</Text></View><SoftCareIcon name="edit" size={28}/></View></Panel>
      </Pressable>)}
    <Panel tone="blue"><Body muted>As programações estão armazenadas neste aparelho. Os alarmes de medicamentos ainda não são disparados automaticamente nesta versão experimental.</Body></Panel>
  </Page>;
}
