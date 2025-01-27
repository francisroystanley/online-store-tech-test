'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCartContext } from '@/providers/cart.context';
import CartModal from './CartModal';
import CheckoutModal from './CheckoutModal';
import OrderConfirmationModal from './OrderConfirmationModal';

const Header = () => {
  const { totalItems } = useCartContext();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleCheckout = () => {
    setCheckoutOpen(true);
    setCartOpen(false);
  };

  const handleConfirmOrder = () => {
    setConfirmationOpen(true);
    setCheckoutOpen(false);
  };

  return (
    <div className="flex justify-between items-center p-5 h-[65px] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.25)] sticky top-0 z-10">
      <Image src="/logo.svg" alt="Logo" width={20} height={25} />
      <div className="flex items-center gap-2">
        <button onClick={() => setCartOpen(true)} className="flex items-center gap-2">
          <Image src="/bag.svg" alt="Cart" width={16} height={18} />
          <span className="text-sm font-medium text-[#707784]"> x {totalItems}</span>
        </button>
      </div>
      <CartModal open={cartOpen} setOpen={setCartOpen} onCheckout={handleCheckout} />
      <CheckoutModal open={checkoutOpen} setOpen={setCheckoutOpen} onConfirm={handleConfirmOrder} />
      <OrderConfirmationModal open={confirmationOpen} setOpen={setConfirmationOpen} />
    </div>
  );
};

export default Header;
