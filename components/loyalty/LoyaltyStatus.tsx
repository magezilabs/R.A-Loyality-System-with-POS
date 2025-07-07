import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LoyaltyStatus } from '@/utils/types';

interface Props {
  status: LoyaltyStatus;
}

const LoyaltyStatusComponent: React.FC<Props> = ({ status }) => {
  if (!status) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Status: {status.status} | Points: {status.points}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 8 },
  text: { fontWeight: 'bold', color: '#2a9d8f' }
});

export default LoyaltyStatusComponent;
