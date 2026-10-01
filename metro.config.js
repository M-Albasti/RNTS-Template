const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const { withSentryConfig } = require('@sentry/react-native/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * React Native CLI uses `withSentryConfig`. Expo apps should use:
 * `getSentryExpoConfig(__dirname, { autoWrapExpoRouterErrorBoundary: true })`.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = withSentryConfig(
  mergeConfig(
    getDefaultConfig(__dirname),
    wrapWithReanimatedMetroConfig(config),
  ),
);
