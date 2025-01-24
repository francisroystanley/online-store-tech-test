import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';
import { CartProvider } from '@/providers/cart.context';

jest.mock('next/font/local', () => ({
  __esModule: true,
  default: () => ({
    variable: 'mocked-font-variable',
  }),
}));

jest.mock('@/providers', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="providers">{children}</div>,
}));

describe('RootLayout', () => {
  it('renders children within Providers', () => {
    const { getByTestId } = render(
      <CartProvider>
        <RootLayout>
          <div data-testid="child">Test Content</div>
        </RootLayout>
      </CartProvider>,
    );

    expect(getByTestId('providers')).toBeInTheDocument();
    expect(getByTestId('child')).toBeInTheDocument();
    expect(getByTestId('child')).toHaveTextContent('Test Content');
  });

  it('applies font classes and antialiased to body', () => {
    const { container } = render(
      <CartProvider>
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      </CartProvider>,
    );
    const body = container.querySelector('body');

    expect(body).toHaveClass('mocked-font-variable', 'mocked-font-variable', 'antialiased');
  });

  it('sets correct lang attribute on html element', () => {
    const { container } = render(
      <CartProvider>
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>
      </CartProvider>,
    );
    const html = container.querySelector('html');

    expect(html).toHaveAttribute('lang', 'en');
  });
});
