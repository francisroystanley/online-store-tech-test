import { render, screen, fireEvent } from '@testing-library/react';
import OrderConfirmationModal from '@/components/OrderConfirmationModal';
import { CartProvider } from '@/providers/cart.context';

jest.mock('lucide-react', () => ({
  X: () => <div data-testid="close-icon">X</div>,
}));

describe('OrderConfirmationModal', () => {
  const mockOnConfirm = jest.fn();
  const mockSetOpen = jest.fn();

  const defaultProps = {
    open: true,
    setOpen: mockSetOpen,
  };

  beforeEach(() => {
    mockOnConfirm.mockClear();
    mockSetOpen.mockClear();
  });

  const renderWithProvider = (props = defaultProps) => {
    return render(
      <CartProvider>
        <OrderConfirmationModal {...props} />
      </CartProvider>,
    );
  };

  it('renders modal when open is true', () => {
    renderWithProvider();

    expect(screen.getByText('Thank you for your order!')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    renderWithProvider({ ...defaultProps, open: false });

    expect(screen.queryByText('Checkout')).not.toBeInTheDocument();
  });

  it('calls setOpen when modal is closed', () => {
    renderWithProvider();

    const closeButton = screen.getByTestId('close-icon').parentElement;

    if (!closeButton) throw new Error('Close button not found');

    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('renders footer with close button that triggers setOpen', () => {
    renderWithProvider();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });
});
