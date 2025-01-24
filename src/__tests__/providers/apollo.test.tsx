import { ApolloProvider, InMemoryCache } from '@apollo/client';
import { render } from '@testing-library/react';
import { Provider } from '@/providers/apollo';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  ApolloProvider: jest.fn(({ children }) => <div data-testid="apollo-provider">{children}</div>),
  ApolloClient: jest.fn(() => ({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
  })),
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
          uri: '/api/graphql',
          cache: expect.any(Object),
        }),
      }),
      expect.any(Object),
    );
  });
});
