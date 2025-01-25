'use client';

import Button from './common/Button';
import { useCartContext } from '@/providers/cart.context';
import { Product } from '@/graphql/generated';

type Props = {
  product: Product;
};

const AddToCartButton = ({ product }: Props) => {
  const { addItem } = useCartContext();

  const onAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      formattedPrice: product.formattedPrice,
      image: product.image,
      quantity: 1,
    });
  };

  return <Button onClick={onAddToCart} label="Add to Cart" />;
};

export default AddToCartButton;
