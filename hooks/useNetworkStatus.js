import { useNetInfo } from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const { isConnected } = useNetInfo();
  return !!isConnected;
};

export default useNetworkStatus;
