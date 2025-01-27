import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const createIsomorphLink = () =>
  new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
    credentials: 'same-origin',
  });

const createApolloClient = () => {
  const isServer = typeof window === 'undefined';

  return new ApolloClient({
    ssrMode: isServer,
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
        fetchPolicy: isServer ? 'no-cache' : 'cache-first',
      },
    },
  });
};

export default createApolloClient;
