import {reactNavigationIntegration} from '@sentry/react-native';

/** Shared Sentry React Navigation integration — keep in a leaf module to avoid circular imports. */
export const navigationIntegration = reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});
