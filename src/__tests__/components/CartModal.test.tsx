import { render, screen, fireEvent } from '@testing-library/react';
import CartModal from '@/components/CartModal';
import { CartProduct } from '@/graphql/generated';
import { useCartContext } from '@/providers/cart.context';
import { mockCartProduct } from '@/__mocks__/fixtures';

jest.mock('@/providers/cart.context');

jest.mock('@/components/CartItem', () => ({
  __esModule: true,
  default: ({ item }: { item: CartProduct }) => <div data-testid="cart-item">{item.title}</div>,
}));

jest.mock('@/components/common/Button', () => ({
  __esModule: true,
  default: ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button onClick={onClick} data-testid="modal-button">
      {label}
    </button>
  ),
}));

jest.mock('@/components/common/Modal', () => ({
  __esModule: true,
  default: ({
    children,
    footer,
    title,
    open,
  }: {
    children: React.ReactNode;
    footer: React.ReactNode;
    title: string;
    open: boolean;
  }) =>
    open ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        {children}
        <div data-testid="modal-footer">{footer}</div>
      </div>
    ) : null,
}));

describe('CartModal', () => {
  const mockOnCheckout = jest.fn();
  const mockSetOpen = jest.fn();
  const mockUseCartContext = useCartContext as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cart message when no items', () => {
    mockUseCartContext.mockReturnValue({ items: [] });

    render(<CartModal onCheckout={mockOnCheckout} open={true} setOpen={mockSetOpen} />);

    expect(screen.getByText('No items in cart')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('renders cart items when items exist', () => {
    const items = [mockCartProduct, { ...mockCartProduct, id: '2' }];
    mockUseCartContext.mockReturnValue({ items });

    render(<CartModal onCheckout={mockOnCheckout} open={true} setOpen={mockSetOpen} />);

    expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('calls setOpen when clicking Continue Shopping in empty cart', () => {
    mockUseCartContext.mockReturnValue({ items: [] });

    render(<CartModal onCheckout={mockOnCheckout} open={true} setOpen={mockSetOpen} />);

    fireEvent.click(screen.getByTestId('modal-button'));

    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(mockOnCheckout).not.toHaveBeenCalled();
  });

  it('calls onCheckout when clicking Checkout with items', () => {
    mockUseCartContext.mockReturnValue({ items: [mockCartProduct] });

    render(<CartModal onCheckout={mockOnCheckout} open={true} setOpen={mockSetOpen} />);

    fireEvent.click(screen.getByTestId('modal-button'));

    expect(mockOnCheckout).toHaveBeenCalled();
    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  it('does not render when open is false', () => {
    mockUseCartContext.mockReturnValue({ items: [] });

    render(<CartModal onCheckout={mockOnCheckout} open={false} setOpen={mockSetOpen} />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders with correct title', () => {
    mockUseCartContext.mockReturnValue({ items: [] });

    render(<CartModal onCheckout={mockOnCheckout} open={true} setOpen={mockSetOpen} />);

    expect(screen.getByTestId('modal-title')).toHaveTextContent('Cart');
  });
});
