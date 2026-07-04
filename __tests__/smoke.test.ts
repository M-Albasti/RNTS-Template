/**
 * @format
 */

import {apiConfig} from '../src/config/apiConfig';
import en from '../src/translation/en/index.json';
import ar from '../src/translation/ar/index.json';
import {store} from '../src/redux/store';

describe('application smoke', () => {
  it('loads api configuration', () => {
    expect(apiConfig.baseURL).toContain('/v1');
    expect(apiConfig.timeoutMs).toBeGreaterThan(0);
  });

  it('has English and Arabic translation roots', () => {
    expect(en.home).toBeDefined();
    expect(en.services).toBeDefined();
    expect(en.islamic).toBeDefined();
    expect(ar.home).toBeDefined();
    expect(ar.services).toBeDefined();
    expect(ar.islamic).toBeDefined();
  });

  it('initializes redux store', () => {
    const state = store.getState();
    expect(state.auth).toBeDefined();
    expect(state.appSettings).toBeDefined();
  });
});
