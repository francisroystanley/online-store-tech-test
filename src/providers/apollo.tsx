'use client';

import { ApolloProvider } from '@apollo/client';
import createApolloClient from '@/lib/apollo';

type Props = {
  children: React.ReactNode;
};

const client = createApolloClient();

const Provider = ({ children }: Props) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { Provider };
