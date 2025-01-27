import { Resolvers } from '@apollo/client';
import { api } from '@/lib/api';
import { Product } from '@/graphql/generated';
import { formatPrice, generateRating, generateReviews } from '@/utils';

const resolvers: Resolvers = {
  Query: {
    products: async () => {
      const products = await api.products.getAll();

      return products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        formattedPrice: formatPrice(product.price),
        image: product.image,
        rating: generateRating(),
        reviews: generateReviews(),
      }));
    },
    product: async (_, { id }): Promise<Product> => {
      const product = await api.products.getById(id);

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        formattedPrice: formatPrice(product.price),
        image: product.image,
        rating: generateRating(),
        reviews: generateReviews(),
      };
    },
  },
};

export { formatPrice };

export default resolvers;
