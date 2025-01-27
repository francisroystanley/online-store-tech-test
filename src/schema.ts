import { creditCard, digits, email, minLength, minValue, number, object, pipe, regex, string } from 'valibot';

const cartSchema = object({
  id: string(),
  title: string(),
  price: pipe(number(), minValue(0, 'Price must be greater than 0')),
  formattedPrice: string(),
  image: string(),
  quantity: pipe(number(), minValue(1, 'Quantity must be greater than 0')),
});

const checkoutSchema = object({
  email: pipe(string(), minLength(1, 'Email is required'), email('Please enter a valid email')),
  shippingName: pipe(string(), minLength(1, 'Name is required'), minLength(2, 'Name must be at least 2 characters')),
  address: pipe(string(), minLength(1, 'Address is required'), minLength(5, 'Please enter a complete address')),
  cardNumber: pipe(string(), minLength(1, 'Card number is required'), creditCard('Invalid card number')),
  cardName: pipe(
    string(),
    minLength(1, 'Card holder name is required'),
    minLength(2, 'Name must be at least 2 characters'),
  ),
  expiry: pipe(
    string(),
    minLength(1, 'Expiry date is required'),
    minLength(5, 'Please enter a valid expiry date (MM/YY)'),
    regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, 'Invalid expiry date format'),
  ),
  cvc: pipe(
    string(),
    minLength(1, 'CVC is required'),
    minLength(3, 'CVC must be 3 digits'),
    digits('CVC must contain only numbers'),
  ),
});

export { cartSchema, checkoutSchema };
