import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useNetworkStatus from '../../../hooks/useNetworkStatus';

const SyncStatus = () => {
  const isConnected = useNetworkStatus();
  return (
    <View style={styles.container}>
      <Text style={{ color: isConnected ? 'green' : 'red' }}>
        {isConnected ? 'Online' : 'Offline'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 8, alignItems: 'center' }
});

export default SyncStatus;
