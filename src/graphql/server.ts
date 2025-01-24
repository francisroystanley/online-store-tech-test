import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { readFileSync } from 'fs';
import { join } from 'path';
import resolvers from './resolvers';

const typeDefs = readFileSync(join(process.cwd(), 'src/graphql/schema.graphql'), 'utf8');
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const handler = startServerAndCreateNextHandler(server);

export { server, handler };
