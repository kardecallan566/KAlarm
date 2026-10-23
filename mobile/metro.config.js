const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Isolamento explícito SOMENTE para testes com Expo Go.
// Development Builds e builds de produção continuam usando expo-notifications real.
if (process.env.KALARM_EXPO_GO_SAFE === '1') {
  const stub = path.resolve(__dirname, 'src/compat/expo-notifications-disabled.js');
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'expo-notifications') {
      return { type: 'sourceFile', filePath: stub };
    }
    return context.resolveRequest(context, moduleName, platform);
  };
}

module.exports = config;
