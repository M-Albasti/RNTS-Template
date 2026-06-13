declare module '@env' {
  export const APP_ENV: 'development' | 'production' | 'staging';
  export const SENTRY_DSN: string;
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
  export const API_BASE_URL: string;
  export const API_USE_MOCKS: string;
  export const MEDIA_API_BASE_URL: string;
}
