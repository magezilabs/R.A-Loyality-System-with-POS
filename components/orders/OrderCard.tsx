import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCurrency, getOrderStatusColor } from '../../../utils/helper';
import type { Order } from '../../../utils/types';

interface Props {
  order: Order;
  showStatus?: boolean;
  showLoyalty?: boolean;
  onPress?: () => void;
}

const OrderCard: React.FC<Props> = ({ order, showStatus = true, showLoyalty = false, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    disabled={!onPress}
    accessibilityLabel={`Order card for ${order.id?.slice(0, 6) ?? '######'}`}
    testID={`order-card-${order.id?.slice(0, 6) ?? '######'}`}
  >
    <View style={styles.row}>
      <Text style={styles.id}>#{order.id.slice(0, 6)}</Text>
      <Text style={[styles.status, { color: getOrderStatusColor(order.status) }]}>
        {showStatus ? order.status : ''}
      </Text>
      {showLoyalty && order.customer_id && !order.customer_id.startsWith('anon_') && (
        <MaterialIcons name="loyalty" size={18} color="#2a9d8f" />
      )}
    </View>
    <Text style={styles.amount}>{formatCurrency(order.total_amount)}</Text>
    <Text style={styles.time}>{new Date(order.created_at).toLocaleTimeString()}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  id: { fontWeight: 'bold' },
  status: { fontWeight: 'bold' },
  amount: { fontSize: 16, marginTop: 4 },
  time: { color: '#888', fontSize: 12 },
});

export default OrderCard;
