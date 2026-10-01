import type {AxiosInstance} from 'axios';

import {wireAxiosForSentry} from '@core/logging/sentryHttpTracing';

/** Attach Sentry HTTP spans, breadcrumbs, and structured logs to an Axios client. */
export const wireHttpClientForSentry = (client: AxiosInstance): AxiosInstance =>
  wireAxiosForSentry(client);
