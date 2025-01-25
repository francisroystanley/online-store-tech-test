import axios from 'axios';
import { render, screen } from '@testing-library/react';
import ProductListing from '@/components/ProductListing';
import { CartProvider } from '@/providers/cart.context';

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

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockProducts = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Description 1',
    price: 99.99,
    image: 'test1.jpg',
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Description 2',
    price: 149.99,
    image: 'test2.jpg',
  },
];

describe('ProductListing', () => {
  const renderWithProvider = (component: React.ReactNode) => {
    return render(<CartProvider>{component}</CartProvider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders products successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          products: mockProducts,
        },
      },
    });
    const { container } = renderWithProvider(await ProductListing());

    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`,
      expect.any(Object),
      expect.any(Object),
    );

    const productElements = container.querySelectorAll('[data-testid="product"]');

    expect(productElements.length).toBe(mockProducts.length);
  });

  it('renders error message when API call fails with Error instance', async () => {
    const errorMessage = 'Failed to fetch products';
    mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

    renderWithProvider(await ProductListing());

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders generic error message when API call fails with non-Error', async () => {
    mockedAxios.post.mockRejectedValueOnce('Unknown error');

    renderWithProvider(await ProductListing());

    expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
  });
});
