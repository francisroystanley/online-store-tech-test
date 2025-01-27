'use server';

import { GetProductsDocument, Product as TProduct } from '@/graphql/generated';
import createApolloClient from '@/lib/apollo';
import Product from './Product';

const ProductListing = async () => {
  try {
    const client = createApolloClient();
    const {
      data: { products },
    } = await client.query({ query: GetProductsDocument });

    return (
      <div data-testid="product-grid">
        {products.map((product: TProduct) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    );
  } catch (error: unknown) {
    return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
  }
};

export default ProductListing;
