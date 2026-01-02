module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['babel-plugin-react-compiler', {
      // Optional: Add compiler options here
      // For example, to enable compilation warnings:
      // compilationMode: 'annotation',
    }],
    'react-native-reanimated/plugin',
  ],
};
