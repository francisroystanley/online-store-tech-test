import React, { ReactNode } from 'react';
import { render, renderHook } from '@testing-library/react';
import { CartProvider, useCartContext } from '@/providers/cart.context';

describe('CartContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

  it('should provide initial empty cart state', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });

    expect(result.current.items).toEqual([]);
  });

  it('should throw error when useCartContext is used outside of CartProvider', () => {
    jest.spyOn(React, 'useContext').mockReturnValue(null);

    expect(() => {
      renderHook(() => useCartContext());
    }).toThrow('useCartContext must be used within a CartProvider');
  });

  it('should render children', () => {
    const { getByText } = render(
      <CartProvider>
        <div>Test Child</div>
      </CartProvider>,
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
