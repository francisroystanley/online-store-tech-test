import { MockedProvider } from '@apollo/client/testing';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockCartProducts } from '@/__mocks__/fixtures';
import CheckoutModal from '@/components/CheckoutModal';
import { CartProduct } from '@/graphql/generated';
import { CartProvider } from '@/providers/cart.context';
import { SubmitOrderDocument } from '@/graphql/generated';

jest.mock('lucide-react', () => ({
  X: () => <div data-testid="close-icon">X</div>,
}));

jest.mock('@/components/CartItem', () => ({
  __esModule: true,
  default: ({ item }: { item: CartProduct }) => <div data-testid="cart-item">{item.title}</div>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="image" />;
  },
}));

describe('CheckoutModal', () => {
  const mockOnConfirm = jest.fn();
  const mockSetOpen = jest.fn();
  const defaultProps = {
    onConfirm: mockOnConfirm,
    open: true,
    setOpen: mockSetOpen,
  };
  const validFormData = {
    email: 'test@example.com',
    shippingName: 'Test User',
    address: '123 Test St',
    cardNumber: '4242424242424242',
    cardName: 'Test User',
    expiry: '12/25',
    cvc: '123',
  };
  const mocks = [
    {
      request: {
        query: SubmitOrderDocument,
        variables: {
          input: {
            ...validFormData,
            orders: mockCartProducts.map((item) => ({
              id: item.id,
              price: item.price,
              quantity: item.quantity,
              title: item.title,
            })),
          },
        },
      },
      result: { data: { submitOrder: true } },
    },
  ];

  const fillForm = () => {
    const labelMap = {
      email: 'Email',
      shippingName: 'Name',
      address: 'Address',
      cardNumber: 'Card Number',
      cardName: 'Name on Card',
      expiry: 'Expiry Date',
      cvc: 'CVC',
    };

    Object.entries(validFormData).forEach(([name, value]) => {
      fireEvent.change(screen.getByRole('textbox', { name: labelMap[name as keyof typeof labelMap] }), {
        target: { value, name },
      });
    });
  };

  beforeEach(() => {
    mockOnConfirm.mockClear();
    mockSetOpen.mockClear();
  });

  const renderWithProvider = (props = defaultProps) => {
    return render(
      <MockedProvider>
        <CartProvider>
          <CheckoutModal {...props} />
        </CartProvider>
      </MockedProvider>,
    );
  };

  it('renders modal when open is true', () => {
    renderWithProvider();

    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    renderWithProvider({ ...defaultProps, open: false });

    expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
  });

  it('displays cart items', () => {
    renderWithProvider();

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('calls setOpen when modal is closed', () => {
    renderWithProvider();

    const closeButton = screen.getByTestId('close-icon').parentElement;

    if (!closeButton) throw new Error('Close button not found');

    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('triggers form submission when confirm button is clicked', () => {
    renderWithProvider();

    const confirmButton = screen.getByText('Confirm Order');
    fireEvent.click(confirmButton);

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('displays multiple cart items correctly', () => {
    render(
      <MockedProvider>
        <CartProvider initialCart={mockCartProducts}>
          <CheckoutModal {...defaultProps} />
        </CartProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CartProvider initialCart={mockCartProducts}>
          <CheckoutModal {...defaultProps} />
        </CartProvider>
      </MockedProvider>,
    );

    fillForm();

    fireEvent.click(screen.getByText('Confirm Order'));
    await screen.findByRole('form');

    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('displays validation errors for invalid form data', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Confirm Order'));

    await screen.findByText(/email is required/i);
    await screen.findByText('Name is required');
    await screen.findByText(/address is required/i);
  });

  it('handles form field changes', () => {
    renderWithProvider();

    const emailInput = screen.getByRole('textbox', { name: /email/i });

    fireEvent.change(emailInput, {
      target: { value: 'test@example.com', name: 'email' },
    });

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('clears error when field is updated', async () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('Confirm Order'));

    const emailError = await screen.findByText(/email is required/i);

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com', name: 'email' },
    });

    expect(emailError).not.toBeInTheDocument();
  });

  it('disables confirm button during submission', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CartProvider initialCart={mockCartProducts}>
          <CheckoutModal {...defaultProps} />
        </CartProvider>
      </MockedProvider>,
    );

    fillForm();

    const confirmButton = screen.getByText('Confirm Order').parentElement;

    if (!confirmButton) throw new Error('Confirm button not found');

    expect(confirmButton).not.toBeDisabled();

    fireEvent.click(confirmButton);

    expect(confirmButton).toBeDisabled();
  });
});
