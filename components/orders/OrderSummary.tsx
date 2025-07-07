import { formatCurrency } from '@/utils/helper';
import type { OrderItem } from '@/utils/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  items: OrderItem[];
}

const OrderSummary: React.FC<Props> = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <View style={styles.summary}>
      <Text style={styles.text}>Total: {formatCurrency(total)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  summary: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default OrderSummary;
