'use client';

import { useCartContext } from '@/providers/cart.context';
import Button from './common/Button';
import Modal from './common/Modal';
import CartItem from './CartItem';

type Props = {
  onCheckout: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartModal = ({ onCheckout, open, setOpen }: Props) => {
  const { items } = useCartContext();
  const isEmptyCart = items.length === 0;

  const footer = (
    <Button
      className="w-full"
      color="secondary"
      label={isEmptyCart ? 'Continue Shopping' : 'Checkout'}
      onClick={isEmptyCart ? () => setOpen(false) : onCheckout}
    />
  );

  return (
    <Modal footer={footer} open={open} setOpen={setOpen} title="Cart">
      <div className="flex flex-col mt-3">
        {isEmptyCart ? <p>No items in cart</p> : items.map((item) => <CartItem key={item.id} item={item} />)}
      </div>
    </Modal>
  );
};

export default CartModal;
