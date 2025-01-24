import { Resolvers } from '@apollo/client';
import { api } from '@/lib/api';

const resolvers: Resolvers = {
  Query: {
    products: async () => {
      const products = await api.products.getAll();

      return products;
    },
    product: async (_, { id }) => {
      const product = await api.products.getById(id);

      return product;
    },
  },
};

export default resolvers;
