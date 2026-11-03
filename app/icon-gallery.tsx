import { useRouter } from 'expo-router';
import { View, Text, useWindowDimensions } from 'react-native';
import { Action, Page, Panel, Body } from '../src/components/ui';
import { SoftCareIcon, type IconName } from '../src/components/icons/SoftCareIcon';
import { colors } from '../src/theme';

const families: { title:string; names: IconName[] }[] = [
  { title: "Navegação", names: ['home', 'medicines', 'calendar', 'history', 'settings'] },
  { title: "Medicamentos", names: ['tablet', 'capsule', 'liquid', 'drops', 'package'] },
  { title: "Programação", names: ['clock', 'weekly', 'repeat-cycle', 'duration', 'day-plan'] },
  { title: "Notificações", names: ['bell', 'alarm', 'snooze', 'muted', 'pending'] },
  { title: "Ações", names: ['add', 'edit', 'delete', 'confirm', 'pause'] },
  { title: "Estados", names: ['taken', 'unconfirmed', 'overdue', 'completed', 'empty'] },
];
export default function IconGallery(){
  const router=useRouter();
  const {width}=useWindowDimensions();
  const count=width>=840?5:width>=600?4:width>=380?3:2;
  const availableWidth=Math.min(width,1040)-(width<360?28:40)-38;
  const cellWidth=Math.max(80,Math.floor((availableWidth-(count-1)*10)/count));
  return <Page title="Ícones SoftCare" subtitle="Coleção ilustrada original do KAlarm · 30 ícones em seis famílias.">
    <Action label="Voltar" secondary onPress={()=>router.back()}/>
    {families.map(family=><Panel key={family.title}>
      <Text accessibilityRole="header" style={{fontSize:19,fontWeight:'800',color:colors.ink,marginBottom:12}}>{family.title}</Text>
      <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
        {family.names.map(name=><View key={name} style={{width:cellWidth,alignItems:'center',justifyContent:'center',paddingVertical:12,backgroundColor:colors.background,borderRadius:14,minHeight:112}}>
          <SoftCareIcon name={name} size={width<360?60:68} label={name}/>
          <Text style={{fontSize:11,color:colors.muted,textAlign:'center',marginTop:5}}>{name}</Text>
        </View>)}
      </View>
    </Panel>)}
    <Body muted>Estes ícones são imagens PNG independentes. Os pictogramas utilitários antigos permanecem como SVG até serem substituídos.</Body>
  </Page>;
}
