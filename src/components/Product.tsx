'use client';

import Image from 'next/image';
import { Product as TProduct } from '@/graphql/generated';
import Button from './Button';
import Rating from './Rating';

type Props = {
  product: TProduct;
};

const Product = ({ product }: Props) => {
  const onAddToCart = () => {
    console.log('Add to cart');
  };

  return (
    <div className="p-5 gap-5 flex flex-col" data-testid="product">
      <div className="flex justify-center items-center py-2.5 w-full border border-[#E5E7EB] rounded-[10px]">
        <Image src={product.image} alt={product.title} width={215} height={285} />
      </div>
      <div className="font-medium text-sm leading-[17px] text-[#707784]">{product.title}</div>
      <div className="flex justify-between items-center gap-2">
        <div className="font-medium text-lg leading-[22px]">{product.formattedPrice}</div>
        <Rating rating={product.rating} reviews={product.reviews} />
      </div>
      <Button onClick={onAddToCart} label="Add to Cart" />
    </div>
  );
};

export default Product;
