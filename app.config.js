const staticConfig = require('./app.json');
require('./scripts/generate-notification-sounds.cjs')();

const sounds = ['./assets/sounds/bell.wav', './assets/sounds/chime.wav', './assets/sounds/pulse.wav'];
const plugins = staticConfig.expo.plugins.map((plugin) => {
  if (Array.isArray(plugin) && plugin[0] === 'expo-notifications') {
    return [plugin[0], { ...plugin[1], sounds }];
  }
  return plugin;
});

module.exports = { expo: { ...staticConfig.expo, plugins } };
