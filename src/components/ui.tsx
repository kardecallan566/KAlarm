import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors as c } from '../theme';
import { SoftCareIcon, type IconName } from './icons/SoftCareIcon';

export function Page({title, subtitle, children}:{title:string;subtitle?:string;children:React.ReactNode}) {
  const { width } = useWindowDimensions();
  return <SafeAreaView style={{ flex:1, backgroundColor:c.background }} edges={['top']}>
    <ScrollView contentContainerStyle={{ padding:width<360?14:20, paddingBottom:45, width:'100%', maxWidth:1040, alignSelf:'center' }} keyboardShouldPersistTaps="handled">
      <Text accessibilityRole="header" style={{ color:c.ink, fontSize:width<360?25:30, fontWeight:'800', letterSpacing:-0.7 }}>{title}</Text>
      {subtitle ? <Text style={{ color:c.muted, fontSize:16, lineHeight:24, marginTop:6, marginBottom:23 }}>{subtitle}</Text>: <View style={{height:18}}/>}
      {children}
    </ScrollView>
  </SafeAreaView>;
}
export function Panel({children, tone='white'}:{children:React.ReactNode; tone?:'white'|'mint'|'blue'|'peach'}) {
  const color=tone==='mint'?c.mint:tone==='blue'?c.blue:tone==='peach'?c.peach:c.surface;
  return <View style={{ backgroundColor:color, borderRadius:22, padding:18, borderWidth:1, borderColor:tone==='white'?c.border:color, marginBottom:14 }}>{children}</View>;
}
export function Body({children, muted=false, style}:{children:React.ReactNode; muted?:boolean; style?:object}) {
  return <Text style={[{ fontSize:16, color:muted?c.muted:c.ink, lineHeight:24 },style]}>{children}</Text>;
}
export function Heading({children}:{children:React.ReactNode}) {
  return <Text style={{fontSize:21, fontWeight:'800', color:c.ink, marginBottom:10}}>{children}</Text>;
}
export function Action({label, onPress, disabled=false, secondary=false, icon}:{label:string;onPress:()=>void;disabled?:boolean;secondary?:boolean;icon?:IconName}) {
  return <Pressable accessible accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled}} onPress={onPress} disabled={disabled} style={({pressed})=>({minHeight:54, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, paddingHorizontal:15, paddingVertical:12, backgroundColor:secondary?c.surface:c.primary, borderColor:secondary?c.border:c.primary,borderWidth:1, borderRadius:16, opacity:disabled?0.45:pressed?0.85:1, marginBottom:10})}>
    {icon?<View style={{backgroundColor:secondary?c.mint:'#FFFFFF',borderRadius:12,padding:4}}><SoftCareIcon name={icon} size={23}/></View>:null}
    <Text style={{fontSize:16,fontWeight:'800',color:secondary?c.primary:'#FFFFFF',textAlign:'center'}}>{label}</Text>
  </Pressable>;
}
export function StatusLine({ok, title, details}:{ok:boolean | null;title:string;details?:string}) {
  return <View style={{flexDirection:'row',gap:12,alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:c.border}}>
    <SoftCareIcon name={ok===true?'confirm':ok===false?'pending':'unresolved'} size={32}/>
    <View style={{flex:1}}><Text style={{fontSize:16,fontWeight:'700',color:c.ink}}>{title}</Text>{details?<Text style={{fontSize:13,color:c.muted,lineHeight:20}}>{details}</Text>:null}</View>
  </View>;
}
