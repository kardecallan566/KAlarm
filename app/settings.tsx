import React from 'react';
import {Pressable,Text,View} from 'react-native';
import {useRouter} from 'expo-router';
import {Page,Panel,Heading,Body,Action} from '../src/components/ui';
import {SoftCareIcon} from '../src/components/icons/SoftCareIcon';
import {colors as c} from '../src/theme';
import {useLanguage} from '../src/i18n/LanguageProvider';
export default function SettingsScreen(){
 const router=useRouter();const {language,setLanguage,t}=useLanguage();
 const choose=async(next:'pt-BR'|'en-US')=>{try{await setLanguage(next)}catch(_error){}};
 return <Page title={t('settings.title')} subtitle={t('settings.subtitle')} showSettingsButton={false}>
  <Action label={t('common.back')} secondary icon="home" onPress={()=>router.back()}/>
  <Panel tone="mint"><Heading>{t('settings.languageTitle')}</Heading><Body muted>{t('settings.languageBody')}</Body><View style={{height:14}}/>
   {([{value:'pt-BR' as const,label:t('settings.languagePt'),flag:'🇧🇷'},{value:'en-US' as const,label:t('settings.languageEn'),flag:'🇺🇸'}]).map(item=>{
    const active=language===item.value;
    return <Pressable key={item.value} accessibilityRole="radio" accessibilityState={{checked:active}} onPress={()=>void choose(item.value)} style={({pressed})=>({minHeight:62,flexDirection:'row',alignItems:'center',gap:12,padding:14,borderRadius:16,borderWidth:1,borderColor:active?c.primary:c.border,backgroundColor:active?'#C7E6D4':c.surface,marginBottom:9,opacity:pressed?0.85:1})}>
      <Text style={{fontSize:24}}>{item.flag}</Text><Text style={{flex:1,fontSize:16,fontWeight:active?'800':'600',color:c.ink}}>{item.label}</Text><SoftCareIcon name={active?'confirm':'unresolved'} size={26}/>
    </Pressable>;
   })}
   <Body muted>{t('settings.languageSelected')}: {language==='pt-BR'?t('settings.languagePt'):t('settings.languageEn')}</Body>
  </Panel>
  <Panel><View style={{flexDirection:'row',alignItems:'center',gap:12}}><SoftCareIcon name="alarm" size={42}/><View style={{flex:1}}><Heading>{t('settings.remindersTitle')}</Heading><Body muted>{t('settings.remindersBody')}</Body></View></View><View style={{height:12}}/><Action label={t('settings.remindersAction')} icon="settings" onPress={()=>router.push('/reminder-settings')}/></Panel>
  <Panel tone="blue"><View style={{flexDirection:'row',alignItems:'center',gap:12}}><SoftCareIcon name="home" size={42}/><View style={{flex:1}}><Heading>{t('settings.aboutTitle')}</Heading><Body muted>{t('settings.aboutBody')}</Body></View></View><Body muted style={{marginTop:10}}>{t('settings.version')} · 0.2.0</Body></Panel>
  <Panel tone="peach"><Heading>{t('settings.privacyTitle')}</Heading><Body muted>{t('settings.privacyBody')}</Body></Panel>
 </Page>;
}
