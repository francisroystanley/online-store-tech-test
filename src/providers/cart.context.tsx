'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { array, InferOutput, number, object, string } from 'valibot';

const CartSchema = object({
  items: array(
    object({
      id: string(),
      title: string(),
      price: number(),
      category: string(),
      description: string(),
      image: string(),
    }),
  ),
});

type Cart = InferOutput<typeof CartSchema>;

const CartContext = createContext<Cart | null>(null);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const memoizedCart = useMemo(() => ({ ...cart, setCart }), [cart]);

  return <CartContext.Provider value={memoizedCart}>{children}</CartContext.Provider>;
};

const useCartContext = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error('useCartContext must be used within a CartProvider');
  }

  return ctx;
};
export { CartProvider, CartSchema, useCartContext };
