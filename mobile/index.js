// Diagnóstico mínimo para separar crashes do Expo Go de falhas do KAlarm.
// Variável EXPO_PUBLIC_* é incorporada pelo Metro ao bundle.
// O modo normal continua com Expo Router.
if (process.env.EXPO_PUBLIC_KALARM_SMOKE === '1') {
  require('./src/diagnostics/smokeEntry');
} else {
  require('expo-router/entry');
}
