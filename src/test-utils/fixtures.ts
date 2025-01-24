import { Product } from '@/graphql/generated';

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  description: 'Test Description',
  category: 'test-category',
  image: 'test-image.jpg',
};

const mockProducts: Product[] = [mockProduct, mockProduct, mockProduct].map((product, index) => ({
  ...product,
  id: `${index + 1}`,
  title: `${product.title} ${index + 1}`,
  price: product.price + index,
}));

export { mockProduct, mockProducts };
