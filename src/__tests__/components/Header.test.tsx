import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';
import { useCartContext } from '@/providers/cart.context';

jest.mock('@/providers/cart.context');

jest.mock('@/components/CartModal', () => ({
  __esModule: true,
  default: ({ open, onCheckout }: any) =>
    open ? (
      <div data-testid="cart-modal" onClick={onCheckout}>
        Cart Modal
      </div>
    ) : null,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="image" />;
  },
}));

describe('Header', () => {
  const mockTotalItems = 3;

  beforeEach(() => {
    (useCartContext as jest.Mock).mockReturnValue({ totalItems: mockTotalItems });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders header elements correctly', () => {
    render(<Header />);

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByAltText('Cart')).toBeInTheDocument();
    expect(screen.getByText(`x ${mockTotalItems}`)).toBeInTheDocument();
  });

  it('opens cart modal when cart button is clicked', () => {
    render(<Header />);

    expect(screen.queryByTestId('cart-modal')).not.toBeInTheDocument();

    const cartButton = screen.getByText(`x ${mockTotalItems}`).parentElement;

    if (!cartButton) throw new Error('Cart button not found');

    fireEvent.click(cartButton);

    expect(screen.getByTestId('cart-modal')).toBeInTheDocument();
  });

  it('applies correct styling to header container', () => {
    const { container } = render(<Header />);
    const headerDiv = container.firstChild as HTMLElement;

    expect(headerDiv).toHaveClass(
      'flex',
      'justify-between',
      'items-center',
      'p-5',
      'h-[65px]',
      'bg-white',
      'shadow-[0_1px_2px_0_rgba(0,0,0,0.25)]',
    );
  });

  it('applies correct styling to cart button', () => {
    render(<Header />);

    const cartButton = screen.getByText(`x ${mockTotalItems}`).parentElement;

    expect(cartButton).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('renders cart count with correct styling', () => {
    render(<Header />);

    const cartCount = screen.getByText(`x ${mockTotalItems}`);

    expect(cartCount).toHaveClass('text-sm', 'font-medium', 'text-[#707784]');
  });
});
