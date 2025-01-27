import { describe, expect, it } from '@jest/globals';
import { Product } from '@/graphql/generated';
import productResolvers from '@/graphql/resolvers/products';
import { api } from '@/lib/api';
import { mockProduct, mockProducts } from '@/__mocks__/fixtures';

jest.mock('@/lib/api');

describe('Product Resolvers', () => {
  it('should fetch all products', async () => {
    (api.products.getAll as jest.Mock).mockResolvedValue(mockProducts);
    const result = await productResolvers.Query.products();

    expect(result).toHaveLength(3);

    result.forEach((product: Product) => {
      expect(product.rating).toBeGreaterThanOrEqual(0.5);
      expect(product.rating).toBeLessThanOrEqual(5);
      expect(product.reviews).toBeGreaterThanOrEqual(1);
      expect(Number.isInteger(product.reviews)).toBe(true);
    });
  });

  it('should fetch a single product', async () => {
    (api.products.getById as jest.Mock).mockResolvedValue(mockProduct);
    const result = await productResolvers.Query.product(null, { id: '1' });

    expect(result.rating).toBeGreaterThanOrEqual(0.5);
    expect(result.rating).toBeLessThanOrEqual(5);
    expect(result.reviews).toBeGreaterThanOrEqual(1);
    expect(Number.isInteger(result.reviews)).toBe(true);
  });
});
