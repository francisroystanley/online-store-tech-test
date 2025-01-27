import { FormEvent, ChangeEvent, RefObject } from 'react';

type FormData = {
  email: string;
  shippingName: string;
  address: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
};

type FormErrors = {
  [key: string]: string;
};

type Props = {
  errors: FormErrors;
  formData: FormData;
  formRef: RefObject<HTMLFormElement>;
  handleFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

const CheckoutForm = ({ errors, formData, formRef, handleFieldChange, onSubmit }: Props) => {
  const sectionClassName = 'space-y-5 pb-[30px] border-b border-[#E5E7EB]';
  const sectionTitleClassName = 'text-base font-medium leading-5';
  const fieldClassName = 'space-y-2';
  const labelClassName = 'color-[#374151] leading-[17px]';
  const inputClassName = 'w-full border border-[#D1D5DB] rounded-[10px] p-2 shadow-[0px_1px_2px_0px_#00000040]';
  const messageClassName = 'text-red-500 text-sm';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" role="form">
      <div className={sectionClassName}>
        <h2 className={sectionTitleClassName}>Shipping Information</h2>
        <div className={fieldClassName}>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFieldChange}
            className={inputClassName}
          />
          {errors.email && <p className={messageClassName}>{errors.email}</p>}
        </div>
        <div className={fieldClassName}>
          <label htmlFor="shippingName" className={labelClassName}>
            Name
          </label>
          <input
            id="shippingName"
            type="text"
            name="shippingName"
            value={formData.shippingName}
            onChange={handleFieldChange}
            className={inputClassName}
          />
          {errors.shippingName && <p className={messageClassName}>{errors.shippingName}</p>}
        </div>
        <div className={fieldClassName}>
          <label htmlFor="address" className={labelClassName}>
            Address
          </label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleFieldChange}
            className={inputClassName}
          />
          {errors.address && <p className={messageClassName}>{errors.address}</p>}
        </div>
      </div>

      <div className={sectionClassName}>
        <h2 className={sectionTitleClassName}>Payment</h2>
        <div className={fieldClassName}>
          <label htmlFor="cardNumber" className={labelClassName}>
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleFieldChange}
            className={inputClassName}
            placeholder="1234 5678 9012 3456"
          />
          {errors.cardNumber && <p className={messageClassName}>{errors.cardNumber}</p>}
        </div>
        <div className={fieldClassName}>
          <label htmlFor="cardName" className={labelClassName}>
            Name on Card
          </label>
          <input
            id="cardName"
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleFieldChange}
            className={inputClassName}
          />
          {errors.cardName && <p className={messageClassName}>{errors.cardName}</p>}
        </div>
        <div className="flex gap-5">
          <div className="flex-[4] space-y-2">
            <label htmlFor="expiry" className={labelClassName}>
              Expiry Date
            </label>
            <input
              id="expiry"
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleFieldChange}
              className={inputClassName}
              placeholder="MM/YY"
            />
            {errors.expiry && <p className={messageClassName}>{errors.expiry}</p>}
          </div>
          <div className="flex-1 space-y-2">
            <label htmlFor="cvc" className={labelClassName}>
              CVC
            </label>
            <input
              id="cvc"
              type="text"
              name="cvc"
              value={formData.cvc}
              onChange={handleFieldChange}
              className={inputClassName}
              placeholder="123"
            />
            {errors.cvc && <p className={messageClassName}>{errors.cvc}</p>}
          </div>
        </div>
      </div>
    </form>
  );
};

export type { FormData as CheckoutFormData, FormErrors as CheckoutFormErrors };

export default CheckoutForm;
