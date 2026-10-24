const React = require('react');
const { View, Text, ScrollView } = require('react-native');
const { registerRootComponent } = require('expo');

function KAlarmSmoke() {
  return React.createElement(
    ScrollView,
    { contentContainerStyle: {
        flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 28,
        backgroundColor: '#F7FAF8',
      }
    },
    React.createElement(View, { style: {
      width: 84, height: 84, borderRadius: 24,
      backgroundColor: '#D9F3E9', alignItems: 'center', justifyContent: 'center',
    } }, React.createElement(Text, { style: {fontSize: 40} }, '✓')),
    React.createElement(Text, { accessibilityRole: 'header', style: {
      fontSize: 27, fontWeight: '800', color: '#244F42', marginTop: 18
    } }, 'KAlarm · Teste básico OK'),
    React.createElement(Text, { style: {
      fontSize: 16, textAlign: 'center', color: '#365C51', marginTop: 12,
      lineHeight: 24
    } }, 'Se esta tela permanecer aberta, o Expo Go e o React Native conseguiram iniciar.'),
    React.createElement(Text, { style: {
      fontSize: 14, textAlign: 'center', color: '#617C73', marginTop: 12,
      lineHeight: 21
    } }, 'Este diagnóstico não acessa o banco, as rotas nem as notificações.'),
  );
}
registerRootComponent(KAlarmSmoke);
