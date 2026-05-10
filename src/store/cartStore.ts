import { useState, useCallback } from 'react';
import { CartItem, MenuItem } from '../types';

export const useCartStore = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItem = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, quantity } : c))
    );
  }, [removeItem]);

  const getItemQuantity = useCallback(
    (itemId: string) => {
      const item = cart.find((c) => c.id === itemId);
      return item?.quantity || 0;
    },
    [cart]
  );

  const totalItems = useCallback(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useCallback(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    getItemQuantity,
    totalItems,
    totalPrice,
    clearCart,
  };
};
