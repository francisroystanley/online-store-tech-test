'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { number, object, string } from 'valibot';
import { CartProduct } from '@/graphql/generated';

const CartSchema = object({
  id: string(),
  title: string(),
  price: number(),
  formattedPrice: string(),
  image: string(),
  quantity: number(),
});

type CartContext = {
  items: CartProduct[];
  totalAmount: number;
  totalItems: number;
  addItem: (item: CartProduct) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartContext | null>(null);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const totalAmount = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const addItem = (item: CartProduct) => {
    if (item.quantity < 1) {
      return;
    }

    setCart((prevState) => {
      const existingItem = prevState.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevState.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );
      }

      return [...prevState, item];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    const newQuantity = Math.max(Math.min(quantity, 50), 1);

    setCart((prevState) => prevState.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const removeItem = (id: string) => {
    setCart((prevState) => prevState.filter((item) => item.id !== id));
  };

  const memoizedCart = useMemo(
    () => ({ items: cart, addItem, updateQuantity, removeItem, totalAmount, totalItems }),
    [cart, totalAmount, totalItems],
  );

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
