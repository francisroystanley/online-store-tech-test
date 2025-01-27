import React, { ReactNode } from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { CartProvider, useCartContext } from '@/providers/cart.context';
import { mockCartProduct } from '@/__mocks__/fixtures';

describe('CartContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

  it('should provide initial empty cart state', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalAmount).toBe(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('should throw error when useCartContext is used outside of CartProvider', () => {
    expect(() => renderHook(() => useCartContext())).toThrow('useCartContext must be used within a CartProvider');
  });

  it('should render children', () => {
    const { getByText } = render(
      <CartProvider>
        <div>Test Child</div>
      </CartProvider>,
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should add new item to cart', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });

    act(() => {
      result.current.addItem(mockCartProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockCartProduct);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalAmount).toBe(mockCartProduct.price * mockCartProduct.quantity);
  });

  it('should increment quantity when adding existing item', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });

    act(() => {
      result.current.addItem(mockCartProduct);
      result.current.addItem(mockCartProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(4);
    expect(result.current.totalItems).toBe(4);
  });

  it('should update item quantity within bounds (1-50)', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });

    act(() => {
      result.current.addItem(mockCartProduct);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.updateQuantity(mockCartProduct.id, 100);
    });

    expect(result.current.items[0].quantity).toBe(50);

    act(() => {
      result.current.updateQuantity(mockCartProduct.id, 0);
    });

    expect(result.current.items[0].quantity).toBe(1);

    act(() => {
      result.current.updateQuantity(mockCartProduct.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });

    act(() => {
      result.current.addItem(mockCartProduct);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem(mockCartProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('should calculate totals correctly with multiple items', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });
    const secondItem = { ...mockCartProduct, id: '2', quantity: 3 };

    act(() => {
      result.current.addItem(mockCartProduct);
      result.current.addItem(secondItem);
    });

    expect(result.current.totalItems).toBe(5);
    expect(result.current.totalAmount).toBe(
      mockCartProduct.price * mockCartProduct.quantity + secondItem.price * secondItem.quantity,
    );
  });

  it('should maintain item order when updating quantities', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });
    const secondItem = { ...mockCartProduct, id: '2' };
    const thirdItem = { ...mockCartProduct, id: '3' };

    act(() => {
      result.current.addItem(mockCartProduct);
      result.current.addItem(secondItem);
      result.current.addItem(thirdItem);
    });
    act(() => {
      result.current.updateQuantity(secondItem.id, 5);
    });

    expect(result.current.items[0].id).toBe(mockCartProduct.id);
    expect(result.current.items[1].id).toBe(secondItem.id);
    expect(result.current.items[1].quantity).toBe(5);
    expect(result.current.items[2].id).toBe(thirdItem.id);
  });

  it('should handle updating quantity of non-existent item', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });

    act(() => {
      result.current.addItem(mockCartProduct);
      result.current.updateQuantity('non-existent-id', 5);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(mockCartProduct.quantity);
  });

  it('should handle removing non-existent item', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });

    act(() => {
      result.current.addItem(mockCartProduct);
      result.current.removeItem('non-existent-id');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(mockCartProduct.id);
  });

  it('should preserve cart state between re-renders', () => {
    const { result, rerender } = renderHook(() => useCartContext(), { wrapper });

    act(() => {
      result.current.addItem(mockCartProduct);
    });

    rerender();

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockCartProduct);
  });

  it('should clear all items from cart', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });
    const secondItem = { ...mockCartProduct, id: '2' };

    act(() => {
      result.current.addItem(mockCartProduct);
      result.current.addItem(secondItem);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it('should throw validation error for invalid cart item', () => {
    const { result } = renderHook(() => useCartContext(), { wrapper });
    const invalidItem = { ...mockCartProduct, price: -100 };

    expect(() =>
      act(() => {
        result.current.addItem(invalidItem);
      }),
    ).toThrow();

    expect(result.current.items).toHaveLength(0);
  });

  it('should initialize with provided initial cart', () => {
    const initialCart = [mockCartProduct];
    const customWrapper = ({ children }: { children: ReactNode }) => (
      <CartProvider initialCart={initialCart}>{children}</CartProvider>
    );

    const { result } = renderHook(() => useCartContext(), { wrapper: customWrapper });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockCartProduct);
    expect(result.current.totalItems).toBe(mockCartProduct.quantity);
    expect(result.current.totalAmount).toBe(mockCartProduct.price * mockCartProduct.quantity);
  });
});
