import axios from 'axios';
import validateEnv from '@/env.mjs';
import { OriginalProduct } from '@/graphql/generated';

const env = validateEnv();
const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  },
);

const api = {
  products: {
    getAll: (): Promise<OriginalProduct[]> => apiClient.get('/products'),
    getById: (id: string): Promise<OriginalProduct> => apiClient.get(`/products/${id}`),
  },
};

export { api, apiClient };
