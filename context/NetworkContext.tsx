import { useNetInfo } from '@react-native-community/netinfo';
import React, { createContext, useContext } from 'react';

type NetworkContextType = {
  isConnected: boolean;
};

const NetworkContext = createContext<NetworkContextType>({ isConnected: true });

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected } = useNetInfo();
  return (
    <NetworkContext.Provider value={{ isConnected: !!isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
