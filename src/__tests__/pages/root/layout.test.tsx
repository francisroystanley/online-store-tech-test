import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';
import { CartProvider } from '@/providers/cart.context';
import { MockedProvider } from '@apollo/client/testing';

jest.mock('lucide-react', () => ({
  Trash2: () => <div data-testid="trash">Trash</div>,
}));

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
      <MockedProvider>
        <CartProvider>
          <RootLayout>
            <div data-testid="child">Test Content</div>
          </RootLayout>
        </CartProvider>
      </MockedProvider>,
    );

    expect(getByTestId('providers')).toBeInTheDocument();
    expect(getByTestId('child')).toBeInTheDocument();
    expect(getByTestId('child')).toHaveTextContent('Test Content');
  });

  it('applies font classes and antialiased to body', () => {
    const { container } = render(
      <MockedProvider>
        <CartProvider>
          <RootLayout>
            <div>Test Content</div>
          </RootLayout>
        </CartProvider>
      </MockedProvider>,
    );
    const body = container.querySelector('body');

    expect(body).toHaveClass('mocked-font-variable', 'mocked-font-variable', 'antialiased');
  });

  it('sets correct lang attribute on html element', () => {
    const { container } = render(
      <MockedProvider>
        <CartProvider>
          <RootLayout>
            <div>Test Content</div>
          </RootLayout>
        </CartProvider>
      </MockedProvider>,
    );
    const html = container.querySelector('html');

    expect(html).toHaveAttribute('lang', 'en');
  });
});
