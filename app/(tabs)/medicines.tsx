import React,{useCallback,useState} from 'react';
import {Pressable,Text,View} from 'react-native';
import {useFocusEffect,useRouter} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite';
import {Page,Panel,Heading,Body,Action} from '../../src/components/ui';
import {SoftCareIcon} from '../../src/components/icons/SoftCareIcon';
import {listMedications,type Medication} from '../../src/data/medications';
import {colors as c} from '../../src/theme';
import {useLanguage} from '../../src/i18n/LanguageProvider';
export default function Medicines(){
 const db=useSQLiteContext();const router=useRouter();const {t}=useLanguage();const [list,setList]=useState<Medication[]>([]);const [error,setError]=useState('');
 useFocusEffect(useCallback(()=>{let active=true;listMedications(db).then(m=>{if(active){setList(m);setError('')}}).catch(e=>active&&setError(String(e)));return()=>{active=false}},[db]));
 return <Page title={t('medicines.title')} subtitle={t('medicines.subtitle')}>
  <Action label={t('medicines.add')} icon="add" onPress={()=>router.push('/medication/new')}/>
  {error?<Panel tone="peach"><Body>{error}</Body></Panel>:null}
  {list.length===0?<Panel tone="mint"><SoftCareIcon name="medicines" size={78}/><Heading>{t('medicines.emptyTitle')}</Heading><Body muted>{t('medicines.emptyBody')}</Body></Panel>:
   list.map(m=><Pressable key={m.id} accessibilityRole="button" accessibilityLabel={t('medicines.open',{name:m.name})} onPress={()=>router.push({pathname:'/medication/[id]',params:{id:m.id}})}>
    <Panel><View style={{flexDirection:'row',alignItems:'center',gap:12}}><SoftCareIcon name="medicines" size={52}/><View style={{flex:1}}><Heading>{m.name}</Heading><Text style={{color:c.muted,fontSize:14}}>{m.strengthLabel||t('medicines.noStrength')}</Text><Text style={{color:c.primary,fontWeight:'700',marginTop:4}}>{m.schedules.length} {m.schedules.length===1?t('medicines.oneVersion'):t('medicines.manyVersions')}</Text></View><SoftCareIcon name="edit" size={28}/></View></Panel>
   </Pressable>)}
  <Panel tone="blue"><Body muted>{t('medicines.storageNote')}</Body></Panel>
 </Page>;
}
