import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

jest.mock(
  '@/components/ProductListing',
  () =>
    function MockProductListing() {
      return <div data-testid="product-listing">Product Listing Mock</div>;
    },
);

describe('Home Page', () => {
  it('renders the page title', () => {
    render(<Home />);

    expect(screen.getByText('Fake Products')).toBeInTheDocument();
  });

  it('renders the ProductListing component', () => {
    render(<Home />);

    expect(screen.getByTestId('product-listing')).toBeInTheDocument();
  });

  it('has the correct layout classes', () => {
    render(<Home />);
    const mainContainer = screen.getByRole('heading').parentElement;

    expect(mainContainer).toHaveClass('max-w-3xl', 'mx-auto', 'py-5');
  });
});
