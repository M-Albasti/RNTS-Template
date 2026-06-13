import React from 'react';
import {QueryClientProvider} from '@tanstack/react-query';

import {queryClient} from '@api/query/queryClient';

type AppProvidersProps = {
  children: React.ReactNode;
};

const AppProviders = ({children}: AppProvidersProps): React.JSX.Element => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export default AppProviders;
