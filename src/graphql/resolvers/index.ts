import { Resolvers } from '@apollo/client';

import productResolvers from './products';

const resolvers: Resolvers = {
  ...productResolvers,
};

export default resolvers;
