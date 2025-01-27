'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { parse, ValiError } from 'valibot';
import { useSubmitOrderMutation } from '@/graphql/generated';
import { useCartContext } from '@/providers/cart.context';
import { checkoutSchema } from '@/schema';
import { formatPrice } from '@/utils';
import Button from './common/Button';
import Modal from './common/Modal';
import CartItem from './CartItem';
import CheckoutForm, { CheckoutFormData, CheckoutFormErrors } from './CheckoutForm';

type Props = {
  onConfirm: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const initialFormData = {
  email: '',
  shippingName: '',
  address: '',
  cardNumber: '',
  cardName: '',
  expiry: '',
  cvc: '',
};

const CheckoutModal = ({ onConfirm, open, setOpen }: Props) => {
  const { clearCart, items, totalAmount, totalItems } = useCartContext();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [submitOrder, { loading }] = useSubmitOrderMutation({
    variables: {
      input: {
        ...formData,
        orders: items.map((item) => ({ id: item.id, price: item.price, quantity: item.quantity, title: item.title })),
      },
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: '',
    }));
  };

  const handleConfirmClick = () => {
    formRef.current?.requestSubmit();
  };

  const handleSubmit = async () => {
    try {
      parse(checkoutSchema, formData);
      setErrors({});

      await submitOrder();
      setFormData(initialFormData);
      clearCart();
      onConfirm();
    } catch (error) {
      if (error instanceof ValiError) {
        const newErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const path = issue.path?.[0].key as string;
          newErrors[path] ||= issue.message;
        });

        setErrors(newErrors);
      }
    }
  };

  const footer = (
    <Button className="w-full" color="secondary" label="Confirm Order" onClick={handleConfirmClick} loading={loading} />
  );

  useEffect(() => {
    if (totalItems === 0) {
      setOpen(false);
    }
  }, [setOpen, totalItems]);

  return (
    <Modal footer={footer} open={open} setOpen={setOpen} title="Checkout">
      <div className="mt-5">
        <CheckoutForm
          errors={errors}
          formData={formData}
          formRef={formRef}
          handleFieldChange={handleChange}
          onSubmit={handleSubmit}
        />
        <div className="flex flex-col">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="text-center pt-5 font-medium text-lg leading-[22px]">
          Order Summary: {formatPrice(totalAmount)}
        </div>
      </div>
    </Modal>
  );
};

export type { Props as CheckoutModalProps };

export default CheckoutModal;
