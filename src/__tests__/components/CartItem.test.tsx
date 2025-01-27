import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '@/components/CartItem';
import { useCartContext } from '@/providers/cart.context';
import { mockCartProduct } from '@/__mocks__/fixtures';

jest.mock('@/providers/cart.context');

jest.mock('lucide-react', () => ({
  Trash2: ({ onClick, className }: { onClick?: () => void; className?: string }) => (
    <button onClick={onClick} className={className} data-testid="trash-icon">
      Trash
    </button>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="image" />;
  },
}));

describe('CartItem', () => {
  const mockUpdateQuantity = jest.fn();
  const mockRemoveItem = jest.fn();

  beforeEach(() => {
    (useCartContext as jest.Mock).mockReturnValue({
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders cart item correctly', () => {
    render(<CartItem item={mockCartProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('2');
  });

  it('updates quantity when input loses focus', () => {
    render(<CartItem item={mockCartProduct} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 5);
  });

  it('sets quantity to 1 when invalid input is provided', () => {
    render(<CartItem item={mockCartProduct} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('removes item when trash icon is clicked', () => {
    render(<CartItem item={mockCartProduct} />);

    const trashIcon = screen.getByTestId('trash-icon');
    fireEvent.click(trashIcon);

    expect(mockRemoveItem).toHaveBeenCalledWith('1');
  });

  it('updates input value when item quantity changes', () => {
    const { rerender } = render(<CartItem item={mockCartProduct} />);
    const updatedProduct = { ...mockCartProduct, quantity: 3 };

    rerender(<CartItem item={updatedProduct} />);

    expect(screen.getByRole('textbox')).toHaveValue('3');
  });
});
