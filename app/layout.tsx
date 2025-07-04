import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '../context/AuthContext';
import { LoyaltyProvider } from '../context/LoyaltyContext';
import { OrderProvider } from '../context/OrderContext';

import useMonthlyCSVExport from '../hooks/useMonthlyCSVExport';
import { initializeTables } from '../services/initDatabase';

export default function Layout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initializeTables().then(() => setDbReady(true));
  }, []);

  useMonthlyCSVExport(); // ✅ Run outside useEffect to avoid hydration mismatch

  if (!dbReady) {
    return null; // Or a loading spinner
  }

  return (
    <AuthProvider>
      <OrderProvider>
        <LoyaltyProvider>
          <Slot /> {/* Renders current active route */}
          <Toast />
        </LoyaltyProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
