'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { CartProduct } from '@/graphql/generated';
import { useCartContext } from '@/providers/cart.context';

type Props = {
  item: CartProduct;
};

const CartItem = ({ item }: Props) => {
  const { updateQuantity, removeItem } = useCartContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = Number.isNaN(Number(e.target.value)) ? 1 : Number(e.target.value);

    updateQuantity(item.id, value);
  };

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== item.quantity.toString()) {
      inputRef.current.value = item.quantity.toString();
    }
  }, [item]);

  return (
    <div className="flex items-start gap-4 border-b border-gray-200 py-5">
      <div className="relative flex flex-shrink-0 justify-center items-center border border-[#EFF0F3] rounded-[10px] w-[100px] h-[90px]">
        <Image
          className="object-scale-down p-2"
          src={item.image}
          alt={item.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-col gap-5 flex-1 py-1.5">
        <div className="flex justify-between items-start gap-2">
          <div className="text-sm font-medium leading-[17px] text-[#707784]">{item.title}</div>
          <Trash2 className="flex-shrink-0 w-5 h-5 cursor-pointer text-[#707784]" onClick={() => removeItem(item.id)} />
        </div>
        <div className="flex justify-between items-start gap-2">
          <div>{item.formattedPrice}</div>
          <input
            className="text-center font-medium border border-[#D1D5DB] rounded-[10px] h-[30px] w-[65px]"
            defaultValue={item.quantity}
            onBlur={handleBlur}
            ref={inputRef}
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
