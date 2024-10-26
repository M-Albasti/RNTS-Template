module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@atoms': './src/components/atoms',
          '@molecules': './src/components/molecules',
          '@organisms': './src/components/organisms',
          '@templates': './src/components/templates',
          '@constants': './src/constants',
          '@helpers': './src/helpers',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@redux': './src/redux',
          '@screens': './src/screens',
          '@services': './src/services',
          '@theme': './src/theme',
          '@translation': './src/translation',
          '@Types': './src/types',
          '@utils': './src/utils',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
