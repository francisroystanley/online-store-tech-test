import { CartProduct, Product } from '@/graphql/generated';
import { formatPrice } from '@/graphql/resolvers/products';

const mockCartProduct: CartProduct = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  formattedPrice: '$99.99',
  image: 'test-image.jpg',
  quantity: 2,
};

const mockCartProducts: CartProduct[] = [mockCartProduct, mockCartProduct, mockCartProduct].map((product, index) => ({
  ...product,
  id: `${index + 1}`,
  title: `${product.title} ${index + 1}`,
  price: product.price + index,
  formattedPrice: formatPrice(product.price + index),
}));

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

export { mockCartProduct, mockCartProducts, mockProduct, mockProducts };
