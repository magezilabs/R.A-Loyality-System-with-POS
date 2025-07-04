import React, { createContext, useContext, useState } from 'react';
import type { MenuItem, OrderItem } from '../utils/types';

type OrderContextType = {
  currentOrder: OrderItem[];
  activeCustomer: string | null;
  addToOrder: (menuItem: MenuItem) => void;
  removeFromOrder: (menuItemId: string) => void;
  clearOrder: () => void;
  setActiveCustomer: (customerId: string | null) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [activeCustomer, setActiveCustomer] = useState<string | null>(null);

  const addToOrder = (menuItem: MenuItem) => {
    setCurrentOrder(prev => {
      const existing = prev.find(item => item.menu_item_id === menuItem.id);
      if (existing) {
        return prev.map(item =>
          item.menu_item_id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `oi_${Date.now()}`,
          order_id: '',
          menu_item_id: menuItem.id,
          quantity: 1,
          unit_price: menuItem.price,
          name: menuItem.name
        }
      ];
    });
  };

  const removeFromOrder = (menuItemId: string) => {
    setCurrentOrder(prev => prev.filter(item => item.menu_item_id !== menuItemId));
  };

  const clearOrder = () => setCurrentOrder([]);

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        activeCustomer,
        addToOrder,
        removeFromOrder,
        clearOrder,
        setActiveCustomer
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
};
