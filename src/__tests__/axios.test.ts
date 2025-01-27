import MockAdapter from 'axios-mock-adapter';
import { apiClient, api } from '@/lib/api';
import { mockProduct, mockProducts } from '@/__mocks__/fixtures';

describe('API Client', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('products', () => {
    it('should fetch all products', async () => {
      mock.onGet('/products').reply(200, mockProducts);
      const result = await api.products.getAll();

      expect(result).toEqual(mockProducts);
    });

    it('should fetch product by id', async () => {
      mock.onGet('/products/1').reply(200, mockProduct);
      const result = await api.products.getById('1');

      expect(result).toEqual(mockProduct);
    });

    it('should handle errors', async () => {
      mock.onGet('/products').reply(500);

      await expect(api.products.getAll()).rejects.toThrow();
    });
  });
});
