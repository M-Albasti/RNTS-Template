jest.mock('@core/logging/useCrashReporter', () => ({
  initCrashReporter: jest.fn(),
}));

jest.mock('@config/sentryConfig', () => ({
  initCrashReporter: jest.fn(),
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  getClient: jest.fn(() => null),
  getGlobalScope: jest.fn(() => ({addEventProcessor: jest.fn()})),
  getIsolationScope: jest.fn(() => ({addEventProcessor: jest.fn()})),
  wrap: (component: unknown) => component,
  wrapExpoRouter: (router: unknown) => router,
  mobileReplayIntegration: jest.fn(() => ({})),
  feedbackIntegration: jest.fn(() => ({})),
  httpClientIntegration: jest.fn(() => ({})),
  httpContextIntegration: jest.fn(() => ({})),
  reactNavigationIntegration: jest.fn(() => ({})),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  withScope: jest.fn((callback: (scope: {setContext: jest.Mock}) => void) =>
    callback({setContext: jest.fn()}),
  ),
  startInactiveSpan: jest.fn(() => ({
    setAttribute: jest.fn(),
    end: jest.fn(),
  })),
  addBreadcrumb: jest.fn(),
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));
