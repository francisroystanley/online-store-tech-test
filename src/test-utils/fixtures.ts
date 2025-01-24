import { Product } from '@/graphql/generated';
import { formatPrice } from '@/graphql/resolvers/products';

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  formattedPrice: '$99.99',
  image: 'test-image.jpg',
  rating: 3.5,
  reviews: 64,
};

const mockProducts: Product[] = [mockProduct, mockProduct, mockProduct].map((product, index) => ({
  ...product,
  id: `${index + 1}`,
  title: `${product.title} ${index + 1}`,
  price: product.price + index,
  formattedPrice: formatPrice(product.price + index),
}));

export { mockProduct, mockProducts };
