import { ApolloServer } from '@apollo/server';
import { server, handler } from '@/graphql/server';

describe('GraphQL Server', () => {
  describe('server', () => {
    it('should be an instance of ApolloServer', () => {
      expect(server).toBeInstanceOf(ApolloServer);
    });
  });

  describe('handler', () => {
    it('should be a function', () => {
      expect(typeof handler).toBe('function');
    });
  });
});
