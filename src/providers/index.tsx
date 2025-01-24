import { Provider as ApolloProvider } from './apollo';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return <ApolloProvider>{children}</ApolloProvider>;
};

export default Providers;
