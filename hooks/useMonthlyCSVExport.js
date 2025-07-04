import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useCallback, useEffect } from 'react';
import { exportMonthlyCSV } from '../services/exportMonthlyCSV';

const useMonthlyCSVExport = () => {
  const { isConnected } = useNetInfo();

  useEffect(() => {
    const now = new Date();
    if (now.getDate() !== 1 || !isConnected) return;

    AsyncStorage.getItem('autoBackupEnabled').then((value) => {
      if (value === 'true') {
        exportMonthlyCSV().then(path => {
          console.log('CSV exported:', path);
        });
      }
    });
  }, [isConnected]);

  return useCallback(() => {
    return exportMonthlyCSV();
  }, []);
};

export default useMonthlyCSVExport;
