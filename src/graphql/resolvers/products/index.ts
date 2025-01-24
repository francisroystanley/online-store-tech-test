import { Resolvers } from '@apollo/client';
import { api } from '@/lib/api';
import { Product } from '@/graphql/generated';

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const generateRating = () => Math.floor(Math.random() * 10) * 0.5 + 0.5;

const generateReviews = () => Math.floor(Math.random() * 100) + 1;

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
