import {useMutation} from '@tanstack/react-query';

import {authClient} from '@api/clients/authClient';
import {mapLoginResponseToUser} from '@api/mappers/auth.mapper';
import {queryKeys} from '@api/query/queryKeys';
import {queryClient} from '@api/query/queryClient';
import {setAccessToken} from '@config/network/tokenStorage';
import type {LoginTypes} from '@Types/loginTypes';

type LoginMutationInput = {
  email: string;
  password: string;
  loginType: LoginTypes;
};

export const useLoginMutation = () =>
  useMutation({
    mutationKey: queryKeys.auth.session(),
    mutationFn: async ({email, password}: LoginMutationInput) => {
      const response = await authClient.login({email, password});
      setAccessToken(response.token);
      return mapLoginResponseToUser(response, 'Normal');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.dashboard()});
      queryClient.invalidateQueries({queryKey: queryKeys.all});
    },
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      name?: string;
    }) => {
      const response = await authClient.register(payload);
      setAccessToken(response.token);
      return mapLoginResponseToUser(response, 'Normal');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.dashboard()});
    },
  });
