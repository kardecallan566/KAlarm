import { Image, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Action, Body, Heading, Page, Panel } from '../../src/components/ui';
import { SoftCareIcon } from '../../src/components/icons/SoftCareIcon';

export default function Home(){
  const router=useRouter();
  const {width}=useWindowDimensions();
  const wide=width>=760;
  return <Page title="Olá! Bem-vindo ao KAlarm" subtitle="Seus lembretes de cuidado, com calma e clareza.">
    <View style={{flexDirection:wide?'row':'column',gap:wide?16:0}}>
      <View style={{flex:1}}>
        <Panel tone="mint">
          <Image source={require('../../assets/brandmark.png')} style={{width:120,height:120,alignSelf:'center',marginBottom:8}} resizeMode="contain" accessibilityLabel="Marca KAlarm: cápsula e despertador"/>
          <Heading>Seus alarmes em primeiro lugar</Heading>
          <Body>Antes de cadastrar medicamentos, vamos verificar como seu celular recebe notificações.</Body>
          <View style={{height:16}}/>
          <Action label="Verificar alarmes" onPress={()=>router.push('/alarm-test')} icon="alarm"/>
        </Panel>
      </View>
      <View style={{flex:1}}>
        <Panel><SoftCareIcon name="medicines" size={76}/>
          <Heading>Nenhum medicamento cadastrado</Heading>
          <Body muted>O cadastro com doses alternadas e horários personalizados será integrado ao banco local em um próximo checkpoint.</Body>
        </Panel>
        <Panel tone="blue">
          <SoftCareIcon name="day-plan" size={56}/>
          <Heading>Ícones feitos para o KAlarm</Heading>
          <Body>Explore a nova biblioteca SoftCare, com ícones ilustrados e contornos arredondados.</Body>
          <View style={{height:12}}/>
          <Action label="Ver biblioteca de ícones" secondary icon="settings" onPress={()=>router.push('/icon-gallery')}/>
        </Panel>
      </View>
    </View>
  </Page>;
}
