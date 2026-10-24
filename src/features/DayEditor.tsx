import React from 'react';
import { Text,TextInput,Pressable,View,StyleSheet } from 'react-native';
import { colors as c } from '../theme';
import type { DayPlan, Slot, Unit } from '../core/scheduling';
import { SoftCareIcon } from '../components/icons/SoftCareIcon';

export const NO_DOSE:DayPlan={kind:'no-dose'};
const makeSlot=():Slot=>({id:`dose-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,time:'08:00',quantity:'',unit:'tablet'});
export const newDay=():DayPlan=>({kind:'slots',slots:[makeSlot()]});
const units:{value:Unit;label:string}[]=[
  {value:'tablet',label:'Comprimidos'}, {value:'capsule',label:'Cápsulas'},
  {value:'drop',label:'Gotas'}, {value:'ml',label:'mL'}, {value:'other',label:'Outros'}
];
export function DayEditor({label,plan,onChange}:{label:string;plan:DayPlan;onChange:(next:DayPlan)=>void}) {
  const active=plan.kind==='slots';
  const modify=(id:string, field:keyof Slot,value:string)=>{
    if(plan.kind==='no-dose') return;
    onChange({kind:'slots',slots:plan.slots.map(s=>s.id===id?{...s,[field]:value}:s)});
  };
  return <View style={styles.container}>
    <Text style={styles.title}>{label}</Text>
    <Pressable accessibilityRole="switch" accessibilityState={{checked:active}} onPress={()=>onChange(active?NO_DOSE:newDay())} style={styles.toggle}>
      <SoftCareIcon name={active?'confirm':'pause'} size={28}/>
      <Text style={styles.toggleText}>{active?'Há dose neste dia':'Sem dose neste dia'}</Text>
    </Pressable>
    {active && plan.slots.map((slot,index)=><View key={slot.id} style={styles.slot}>
      <View style={styles.row}><Text style={styles.slotTitle}>Tomada {index+1}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Remover tomada ${index+1}`} onPress={()=>onChange(plan.slots.length===1?NO_DOSE:{kind:'slots',slots:plan.slots.filter(s=>s.id!==slot.id)})}><SoftCareIcon name="delete" size={28}/></Pressable>
      </View>
      <View style={styles.row}>
        <View style={styles.col}><Text style={styles.label}>Horário (HH:mm)</Text>
          <TextInput style={styles.field} value={slot.time} placeholder="08:00" keyboardType="numbers-and-punctuation" maxLength={5} onChangeText={v=>modify(slot.id,'time',v)} accessibilityLabel={`Horário da tomada ${index+1}`}/></View>
        <View style={styles.col}><Text style={styles.label}>Quantidade</Text>
          <TextInput style={styles.field} value={slot.quantity} placeholder="Ex.: 0,5" keyboardType="decimal-pad" onChangeText={v=>modify(slot.id,'quantity',v)} accessibilityLabel={`Quantidade da tomada ${index+1}`}/></View>
      </View>
      <Text style={styles.label}>Unidade</Text>
      <View style={styles.chips}>{units.map(item=><Pressable key={item.value} accessibilityRole="button" accessibilityState={{selected:slot.unit===item.value}} onPress={()=>modify(slot.id,'unit',item.value)} style={[styles.chip,slot.unit===item.value&&styles.chipActive]}><Text style={{fontSize:13,fontWeight:'700',color:slot.unit===item.value?c.surface:c.primary}}>{item.label}</Text></Pressable>)}</View>
      {slot.unit==='other' ? <TextInput style={styles.field} value={slot.unitLabel??''} placeholder="Informe a unidade" onChangeText={v=>modify(slot.id,'unitLabel',v)} accessibilityLabel="Nome da unidade personalizada"/>:null}
    </View>)}
    {active?<Pressable accessibilityRole="button" onPress={()=>onChange({kind:'slots',slots:[...plan.slots,makeSlot()]})} style={styles.add}><SoftCareIcon name="add" size={27}/><Text style={styles.addText}>Adicionar outro horário</Text></Pressable>:null}
  </View>;
}
const styles=StyleSheet.create({container:{backgroundColor:c.surface,borderRadius:20,padding:16,borderWidth:1,borderColor:c.border,marginBottom:16},title:{fontWeight:'800',fontSize:18,color:c.ink,marginBottom:10},toggle:{flexDirection:'row',alignItems:'center',gap:10,minHeight:50},toggleText:{fontSize:15,fontWeight:'700',color:c.ink},slot:{marginTop:8,paddingTop:14,borderTopWidth:1,borderTopColor:c.border},slotTitle:{fontWeight:'800',fontSize:15,color:c.ink},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:8},col:{flex:1},label:{fontSize:13,fontWeight:'700',color:c.muted,marginBottom:5},field:{backgroundColor:c.background,borderRadius:13,borderColor:c.border,borderWidth:1,padding:12,fontSize:16,color:c.ink,minHeight:48},chips:{flexDirection:'row',flexWrap:'wrap',gap:7,marginBottom:12},chip:{minHeight:38,backgroundColor:c.mint,borderRadius:12,paddingHorizontal:12,justifyContent:'center'},chipActive:{backgroundColor:c.primary},add:{flexDirection:'row',alignItems:'center',gap:8,minHeight:48,marginTop:10},addText:{fontSize:15,fontWeight:'800',color:c.primary}});
