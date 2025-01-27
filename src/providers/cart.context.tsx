'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CartProduct } from '@/graphql/generated';
import { cartSchema } from '@/schema';
import { parse, ValiError } from 'valibot';

type CartContext = {
  items: CartProduct[];
  totalAmount: number;
  totalItems: number;
  addItem: (item: CartProduct) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
};

type Props = {
  children: React.ReactNode;
  initialCart?: CartProduct[];
};

const CartContext = createContext<CartContext | null>(null);

const CartProvider = ({ children, initialCart = [] }: Props) => {
  const [cart, setCart] = useState<CartProduct[]>(initialCart);
  const totalAmount = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const validateItem = (item: CartProduct) => {
    try {
      parse(cartSchema, item);
    } catch (error) {
      if (error instanceof ValiError) {
        const newErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const path = issue.path?.[0].key as string;
          newErrors[path] ||= issue.message;
        });

        throw new Error(JSON.stringify(newErrors));
      }
    }
  };

  const addItem = useCallback((item: CartProduct) => {
    validateItem(item);

    setCart((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      const existingItem = newState.find((cartItem: CartProduct) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;

        return newState;
      }

      return [...newState, item];
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const newQuantity = Math.max(Math.min(quantity, 50), 1);

    setCart((prevState) => prevState.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prevState) => prevState.filter((item) => item.id !== id));
  }, []);

  const memoizedCart = useMemo(
    () => ({ items: cart, addItem, clearCart, updateQuantity, removeItem, totalAmount, totalItems }),
    [addItem, cart, clearCart, removeItem, totalAmount, totalItems, updateQuantity],
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
export { CartProvider, useCartContext };
