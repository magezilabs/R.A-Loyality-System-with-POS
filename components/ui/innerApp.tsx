import { AuthProvider } from '../../context/AuthContext';
import { OrderProvider } from '../../context/OrderContext';
import { LoyaltyProvider } from '../../context/LoyaltyContext';
import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import LoadingScreen from './LoadingScreen';
import { Suspense } from 'react';

export default function InnerApp() {

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthProvider>
        <OrderProvider>
          <LoyaltyProvider>
            <Slot />
            <Toast />
          </LoyaltyProvider>
        </OrderProvider>
      </AuthProvider>
    </Suspense>
  );
}
