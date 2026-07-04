import {loadString, remove, saveString} from '@redux/storage/mmkv';

const ACCESS_TOKEN_KEY = 'api_access_token';

export const getAccessToken = (): string | null => loadString(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string): void => {
  saveString(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = (): void => {
  remove(ACCESS_TOKEN_KEY);
};
