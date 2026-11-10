require('./scripts/generate-notification-sounds.cjs')();

module.exports = ({ config }) => {
  const sounds = ['./assets/sounds/bell.wav', './assets/sounds/chime.wav', './assets/sounds/pulse.wav'];
  const plugins = (config.plugins ?? []).map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === 'expo-notifications') {
      return [plugin[0], { ...plugin[1], sounds }];
    }
    return plugin;
  });
  return { ...config, plugins };
};
