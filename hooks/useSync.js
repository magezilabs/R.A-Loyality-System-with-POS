import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { syncLoyaltyData } from '../services/sync';

const useSync = () => {
  const { isConnected } = useNetInfo();

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      syncLoyaltyData();
    }, 5 * 60 * 1000);

    syncLoyaltyData();

    return () => clearInterval(interval);
  }, [isConnected]);
};

export default useSync;
