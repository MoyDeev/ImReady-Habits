// Expo's preset. In SDK 57 babel-preset-expo already wires up the
// react-native-worklets plugin required by react-native-reanimated 4, so no
// extra plugin entry is needed here. This file is kept explicit as a safeguard.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
