import axios from 'axios';
import { print } from 'graphql';
import { GetProductsDocument, Product as TProduct } from '@/graphql/generated';
import Product from './Product';

const ProductListing = async () => {
  try {
    const {
      data: {
        data: { products },
      },
    } = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`,
      { query: print(GetProductsDocument) },
      { headers: { 'Content-Type': 'application/json' } },
    );

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
