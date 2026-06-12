declare module '@env' {
  export const APP_ENV: 'development' | 'production' | 'staging';
  export const SENTRY_DSN: string;
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
}
