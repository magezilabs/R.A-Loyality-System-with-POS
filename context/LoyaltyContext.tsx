import React, { createContext, ReactNode, useContext, useState } from 'react';
import { dbPromise } from '../services/database';
import { POINTS_CONFIG } from '../utils/constants';
import type { LoyaltyStatus } from '../utils/types';

type LoyaltyContextType = {
  loyaltyStatus: LoyaltyStatus;
  checkLoyaltyStatus: (phone: string, email?: string | null) => Promise<any>;
  pointsRate: number;
};

const LoyaltyContext = createContext<LoyaltyContextType>({
  loyaltyStatus: null,
  checkLoyaltyStatus: async () => {},
  pointsRate: 1 / POINTS_CONFIG.pointsPerShilling,
});

export const LoyaltyProvider = ({ children }: { children: ReactNode }) => {
  const [loyaltyStatus, setLoyaltyStatus] = useState<LoyaltyStatus>(null);

  const checkLoyaltyStatus = async (phone: string, email: string | null = null) => {
    const db = await dbPromise;
    const result = await db.execAsync(
      'SELECT * FROM customers WHERE phone = ?',
      [phone]
    );
    if (result.rows.length > 0) {
      const customer = result.rows[0];
      setLoyaltyStatus({
        status: 'verified',
        points: customer.points,
        redeemed: [],
      });
      return customer;
    } else {
      const isAnonymous = !phone;
      const points = phone ? POINTS_CONFIG.signupBonus : 0;
      const timestamp = Date.now();
      await db.execAsync(
        `INSERT INTO customers (id, phone, email, is_anonymous, points, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [`cust_${timestamp}`, phone, email, isAnonymous ? 1 : 0, points, timestamp]
      );
      setLoyaltyStatus({
        status: isAnonymous ? 'anonymous' : 'new_client',
        points,
        redeemed: []
      });
      return {
        id: `cust_${timestamp}`,
        phone,
        email,
        isAnonymous,
        points
      };
    }
  };

  return (
    <LoyaltyContext.Provider value={{
      loyaltyStatus,
      checkLoyaltyStatus,
      pointsRate: 1 / POINTS_CONFIG.pointsPerShilling
    }}>
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => useContext(LoyaltyContext);
