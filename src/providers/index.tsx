import { Provider as ApolloProvider } from './apollo';
import { CartProvider } from './cart.context';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => (
  <ApolloProvider>
    <CartProvider>{children}</CartProvider>
  </ApolloProvider>
);

export default Providers;
