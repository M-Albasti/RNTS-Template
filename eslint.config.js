/**
 * ESLint 9 flat config without eslint-plugin-ft-flow (incompatible with ESLint 9).
 * Extends @react-native/eslint-config/flat and drops the Flow-only override block.
 */
const rnFlat = require('@react-native/eslint-config/flat');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');

const hasFtFlowPlugin = config =>
  config.plugins != null &&
  Object.prototype.hasOwnProperty.call(config.plugins, 'ft-flow');

module.exports = [
  ...rnFlat.filter(config => !hasFtFlowPlugin(config)),
  {
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
      ],
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
