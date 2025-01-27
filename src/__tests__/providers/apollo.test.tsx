import { ApolloProvider, InMemoryCache } from '@apollo/client';
import { render } from '@testing-library/react';
import { Provider } from '@/providers/apollo';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  ApolloProvider: jest.fn(({ children }) => <div data-testid="apollo-provider">{children}</div>),
  ApolloClient: jest.fn(() => ({
    link: {
      uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
      credentials: 'same-origin',
    },
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
      },
    },
  })),
  HttpLink: jest.fn(({ uri, credentials }) => ({ uri, credentials })),
}));

describe('Apollo Provider', () => {
  it('should render children within ApolloProvider', () => {
    const { getByTestId, getByText } = render(
      <Provider>
        <div>Test Child</div>
      </Provider>,
    );

    expect(getByTestId('apollo-provider')).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should configure ApolloProvider with correct client settings', () => {
    render(
      <Provider>
        <div>Test Child</div>
      </Provider>,
    );

    expect(ApolloProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        client: expect.objectContaining({
          link: expect.objectContaining({
            uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
            credentials: 'same-origin',
          }),
          cache: expect.any(Object),
          defaultOptions: {
            query: {
              errorPolicy: 'all',
              fetchPolicy: 'cache-first',
            },
          },
        }),
      }),
      expect.any(Object),
    );
  });
});
