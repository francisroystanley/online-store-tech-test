import { Resolvers } from '@apollo/client';

import cartResolvers from './cart';
import productResolvers from './products';

const resolvers: Resolvers = {
  ...cartResolvers,
  ...productResolvers,
};

export default resolvers;
