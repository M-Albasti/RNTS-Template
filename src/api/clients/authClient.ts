import {apiClient} from '@config/network/client';

import type {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '@api/server/auth.dto';

export const authClient = {
  login: async (payload: LoginRequestDto): Promise<LoginResponseDto> => {
    const {data} = await apiClient.post<LoginResponseDto>('/login', payload);
    return data;
  },

  register: async (
    payload: RegisterRequestDto,
  ): Promise<RegisterResponseDto> => {
    const {data} = await apiClient.post<RegisterResponseDto>(
      '/register',
      payload,
    );
    return data;
  },
};
