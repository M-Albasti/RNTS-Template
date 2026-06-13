import MockAdapter from 'axios-mock-adapter';

import {apiClient} from '@config/network/client';

let mockAdapter: MockAdapter | null = null;

/** Lazily attach axios-mock-adapter to the shared API client. */
export const getMockAdapter = (): MockAdapter => {
  if (!mockAdapter) {
    mockAdapter = new MockAdapter(apiClient, {
      delayResponse: 400,
      onNoMatch: 'passthrough',
    });
  }
  return mockAdapter;
};
