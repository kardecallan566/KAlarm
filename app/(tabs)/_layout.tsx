import { Tabs } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { colors } from '../../src/theme';
import { SoftCareIcon, type IconName } from '../../src/components/icons/SoftCareIcon';
import {useLanguage} from '../../src/i18n/LanguageProvider';
const icons:Record<string,IconName>={index:'home',medicines:'medicines',calendar:'calendar',history:'history'};
export default function TabsLayout(){
 const {width}=useWindowDimensions();const {t}=useLanguage();const large=width>=840;
 const titles:Record<string,string>={index:t('tabs.home'),medicines:t('tabs.medicines'),calendar:t('tabs.calendar'),history:t('tabs.history')};
 return <Tabs screenOptions={({route})=>({
  headerShown:false,tabBarActiveTintColor:colors.primary,tabBarInactiveTintColor:colors.muted,
  tabBarStyle:{height:large?72:68,paddingBottom:large?8:7,paddingTop:7,backgroundColor:colors.surface,borderTopColor:colors.border},
  tabBarLabelStyle:{fontSize:12,fontWeight:'700'},
  tabBarIcon:({focused})=><View style={{opacity:focused?1:.65}}><SoftCareIcon name={icons[route.name]??'home'} size={30}/></View>,
 })}>
  <Tabs.Screen name="index" options={{title:titles.index}}/>
  <Tabs.Screen name="medicines" options={{title:titles.medicines}}/>
  <Tabs.Screen name="calendar" options={{title:titles.calendar}}/>
  <Tabs.Screen name="history" options={{title:titles.history}}/>
 </Tabs>;
}
