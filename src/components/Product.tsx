import Image from 'next/image';
import { Product as TProduct } from '@/graphql/generated';
import AddToCartButton from './AddToCartButton';
import Rating from './Rating';

type Props = {
  product: TProduct;
};

const Product = ({ product }: Props) => (
  <div className="p-5 gap-5 flex flex-col" data-testid="product">
    <div className="relative flex justify-center items-center w-full border border-[#E5E7EB] rounded-[10px] h-[285px]">
      <Image
        className="object-scale-down p-2.5"
        src={product.image}
        alt={product.title}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
    <div className="font-medium text-sm leading-[17px] text-[#707784]">{product.title}</div>
    <div className="flex justify-between items-center gap-2">
      <div className="font-medium text-lg leading-[22px]">{product.formattedPrice}</div>
      <Rating rating={product.rating} reviews={product.reviews} />
    </div>
    <AddToCartButton product={product} />
  </div>
);

export default Product;
