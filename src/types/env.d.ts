declare module '@env' {
  export const APP_ENV: 'development' | 'production' | 'staging';
  export const SENTRY_DSN: string;
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
  export const API_BASE_URL: string;
  export const API_USE_MOCKS: string;
  export const MEDIA_API_BASE_URL: string;
  export const GOOGLE_MAPS_API_KEY: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_SENTRY_DSN?: string;
    EXPO_PUBLIC_ENV?: string;
    SENTRY_DSN?: string;
    SENTRY_AUTH_TOKEN?: string;
    SENTRY_DISABLE_AUTO_UPLOAD?: string;
    SENTRY_PROPERTIES?: string;
  }
}
