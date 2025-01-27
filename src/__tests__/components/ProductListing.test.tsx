import { render, screen } from '@testing-library/react';
import ProductListing from '@/components/ProductListing';
import { CartProvider } from '@/providers/cart.context';
import createApolloClient from '@/lib/apollo';
import { mockProducts } from '@/__mocks__/fixtures';

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

jest.mock('@/lib/apollo');

type MockedApolloClient = ReturnType<typeof createApolloClient>;

const mockedCreateApolloClient = createApolloClient as jest.MockedFunction<typeof createApolloClient>;

describe('ProductListing', () => {
  const renderWithProvider = (component: React.ReactNode) => {
    return render(<CartProvider>{component}</CartProvider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders products successfully', async () => {
    mockedCreateApolloClient.mockReturnValue({
      query: jest.fn().mockResolvedValue({
        data: { products: mockProducts },
      }),
    } as unknown as MockedApolloClient);

    const { container } = renderWithProvider(await ProductListing());

    expect(screen.getByTestId('product-grid')).toBeInTheDocument();

    const productElements = container.querySelectorAll('[data-testid="product"]');

    expect(productElements.length).toBe(mockProducts.length);
  });

  it('renders error message when API call fails with Error instance', async () => {
    const errorMessage = 'Failed to fetch products';
    mockedCreateApolloClient.mockReturnValue({
      query: jest.fn().mockRejectedValue(new Error(errorMessage)),
    } as unknown as MockedApolloClient);

    renderWithProvider(await ProductListing());

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders generic error message when API call fails with non-Error', async () => {
    mockedCreateApolloClient.mockReturnValue({
      query: jest.fn().mockRejectedValue('Unknown error'),
    } as unknown as MockedApolloClient);

    renderWithProvider(await ProductListing());

    expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
  });
});
