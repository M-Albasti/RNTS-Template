import type {AxiosError} from 'axios';

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (typeof error === 'object' && error !== null && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{message?: string}>;
    return {
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Request failed',
      status: axiosError.response?.status,
      code: axiosError.code,
      details: axiosError.response?.data,
    };
  }

  if (error instanceof Error) {
    return {message: error.message};
  }

  return {message: 'An unexpected error occurred'};
};
