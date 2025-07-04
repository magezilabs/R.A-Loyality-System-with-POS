import { useCallback } from 'react';
import { printReceipt } from '../services/printer';

const usePrint = () => {
  return useCallback((payload) => {
    printReceipt(payload);
  }, []);
};

export default usePrint;
