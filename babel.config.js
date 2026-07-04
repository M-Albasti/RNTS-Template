const path = require('path');

const isTest =
  process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID != null;

const moduleAliases = {
  '@api': './src/api',
  '@assets': './src/assets',
  '@atoms': './src/components/atoms',
  '@molecules': './src/components/molecules',
  '@organisms': './src/components/organisms',
  '@templates': './src/components/templates',
  '@constants': './src/constants',
  '@config': './src/config',
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
};

if (isTest) {
  // Jest + coverage must not use react-native-dotenv (it breaks when .env vars are empty).
  moduleAliases['@env'] = path.resolve(__dirname, '__mocks__/env.js');
}

const plugins = [
  ['module-resolver', {alias: moduleAliases}],
  ...(!isTest
    ? [
        [
          'module:react-native-dotenv',
          {
            envName: 'APP_ENV',
            moduleName: '@env',
            path: '.env',
            blocklist: null,
            allowlist: null,
            safe: false,
            allowUndefined: false,
            verbose: false,
          },
        ],
      ]
    : []),
  '@babel/plugin-transform-export-namespace-from',
  'react-native-reanimated/plugin',
];

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins,
};
