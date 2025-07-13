import React, { createContext, useContext, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { MenuItem, OrderItem } from '@/utils/types';

type OrderContextType = {
  currentOrder: OrderItem[];
  activeCustomer: string | null;
  addToOrder: (menuItem: MenuItem) => void;
  removeFromOrder: (menuItemId: string) => void;
  clearOrder: () => void;
  setActiveCustomer: (customerId: string | null) => void;
  submitOrder: (customerId: string) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useSQLiteContext();
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
          order_id: '', // will be assigned on submission
          menu_item_id: menuItem.id,
          quantity: 1,
          unit_price: menuItem.price,
          name: menuItem.name,
        },
      ];
    });
  };

  const removeFromOrder = (menuItemId: string) => {
    setCurrentOrder(prev =>
      prev.filter(item => item.menu_item_id !== menuItemId)
    );
  };

  const clearOrder = () => {
    setCurrentOrder([]);
    setActiveCustomer(null);
  };

  const submitOrder = async (customerId: string) => {
    const orderId = `ord_${Date.now()}`;
    const createdAt = Date.now();
    const totalAmount = currentOrder.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Insert order
    await db.runAsync(
      `INSERT INTO orders (id, customer_id, total_amount, status, is_synced, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, customerId, totalAmount, 'pending', 0, createdAt]
    );

    // Insert items
    const itemInserts = currentOrder.map(item =>
      db.runAsync(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.menu_item_id, item.quantity, item.unit_price]
      )
    );
    await Promise.all(itemInserts);

    // Loyalty logic
    if (!customerId.startsWith('anon_')) {
      await db.runAsync(
        `INSERT OR IGNORE INTO customers (id, phone, points) VALUES (?, ?, 0)`,
        [customerId, customerId]
      );
      await db.runAsync(
        `UPDATE customers SET points = points + ? WHERE id = ?`,
        [Math.floor(totalAmount / 1000), customerId]
      );
    }

    clearOrder();
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        activeCustomer,
        addToOrder,
        removeFromOrder,
        clearOrder,
        setActiveCustomer,
        submitOrder,
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
