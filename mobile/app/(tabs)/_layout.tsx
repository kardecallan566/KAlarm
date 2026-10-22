import { Tabs } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { colors } from '../../src/theme';
import { SoftCareIcon, type IconName } from '../../src/components/icons/SoftCareIcon';

const icons:Record<string,IconName>={index:'home',medicines:'medicines',calendar:'calendar',history:'history'};
export default function TabsLayout(){
  const {width}=useWindowDimensions();
  const large=width>=840;
  return <Tabs screenOptions={({route})=>({
    headerShown:false,
    tabBarActiveTintColor:colors.primary,
    tabBarInactiveTintColor:colors.muted,
    tabBarStyle: { height:large?72:68, paddingBottom:large?8:7, paddingTop:7, backgroundColor:colors.surface, borderTopColor:colors.border },
    tabBarLabelStyle:{fontSize:12,fontWeight:'700'},
    tabBarIcon:({focused})=><View style={{opacity:focused?1:.65}}><SoftCareIcon name={icons[route.name] ?? 'home'} size={30}/></View>,
  })}>
    <Tabs.Screen name="index" options={{title:'Início'}}/>
    <Tabs.Screen name="medicines" options={{title:'Remédios'}}/>
    <Tabs.Screen name="calendar" options={{title:'Calendário'}}/>
    <Tabs.Screen name="history" options={{title:'Histórico'}}/>
  </Tabs>;
}
