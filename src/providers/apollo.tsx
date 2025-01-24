'use client';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

type Props = {
  children: React.ReactNode;
};

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

const Provider = ({ children }: Props) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { Provider };
