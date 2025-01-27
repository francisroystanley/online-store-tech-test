'use client';

import Button from './common/Button';
import Modal from './common/Modal';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const OrderConfirmationModal = ({ open, setOpen }: Props) => {
  const footer = <Button className="w-full" color="dark" label="Close" onClick={() => setOpen(false)} />;

  return (
    <Modal footer={footer} open={open} setOpen={setOpen} title="Order Confirmation">
      <div className="mt-3">
        <h1>Thank you for your order!</h1>
      </div>
    </Modal>
  );
};

export type { Props as OrderConfirmationModalProps };

export default OrderConfirmationModal;
