import { describe, expect, it } from '@jest/globals';
import productResolvers from '@/graphql/resolvers/products';
import { api } from '@/lib/api';
import { mockProduct, mockProducts } from '@/test-utils/fixtures';

jest.mock('@/lib/api');

describe('Product Resolvers', () => {
  it('should fetch all products', async () => {
    (api.products.getAll as jest.Mock).mockResolvedValue(mockProducts);
    const result = await productResolvers.Query.products();

    expect(result).toEqual(mockProducts);
  });

  it('should fetch a single product', async () => {
    (api.products.getById as jest.Mock).mockResolvedValue(mockProduct);
    const result = await productResolvers.Query.product(null, { id: '1' });

    expect(result).toEqual(mockProduct);
  });
});
