import { render, screen, fireEvent } from '@testing-library/react';
import Product from '@/components/Product';
import { mockProduct } from '@/test-utils/fixtures';

jest.mock('lucide-react', () => ({
  Star: () => <div data-testid="star-gray">Star</div>,
  StarHalf: () => <div data-testid="star-half">StarHalf</div>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

describe('Product', () => {
  it('renders product information correctly', () => {
    render(<Product product={mockProduct} />);
    const stars = screen.getAllByTestId('star-gray');

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.formattedPrice)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.title)).toBeInTheDocument();
    expect(stars).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
  });

  it('calls onAddToCart when Add to Cart button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<Product product={mockProduct} />);

    const addToCartButton = screen.getByRole('button', { name: 'Add to Cart' });
    fireEvent.click(addToCartButton);

    expect(consoleSpy).toHaveBeenCalledWith('Add to cart');
    consoleSpy.mockRestore();
  });
});
