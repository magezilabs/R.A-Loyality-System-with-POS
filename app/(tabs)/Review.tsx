import OrderItem from '@/components/orders/OrderItems';
import { MaterialIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { printReceipt } from '../../services/printer';
import { formatCurrency } from '../../utils/helper';

const OrderReviewScreen = () => {
  const db = useSQLiteContext();
  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchOrders = async () => {
    const result = await db.execAsync(
      `SELECT * FROM orders WHERE status = ? ORDER BY created_at ASC`,
      ['submitted']
    );
    setPendingOrders(result.rows);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000); // Polling every 3s
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, status, reason = null) => {
    await db.execAsync(
      `UPDATE orders SET status = ?, decline_reason = ? WHERE id = ?`,
      [status, reason, orderId]
    );
    fetchOrders();
  };

  const handleApproval = async (order) => {
    await updateOrderStatus(order.id, 'approved');
    printReceipt(order); // Assuming receipt service handles its own logic
  };

  const handleDecline = async (order) => {
    await updateOrderStatus(order.id, 'declined', 'Changed mind');
  };

  const showApprovalDialog = (order) => {
    Alert.alert(
      'Confirm Order',
      `Approve order #${order.id.slice(0, 6)} for ${formatCurrency(order.total_amount)}?`,
      [
        {
          text: 'Decline',
          onPress: () => handleDecline(order),
          style: 'destructive'
        },
        {
          text: 'Approve',
          onPress: () => handleApproval(order),
          style: 'default'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Pending Approval ({pendingOrders.length})
      </Text>

      <FlatList
        data={pendingOrders}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <OrderHeader order={item} />
            <OrderItemsList orderId={item.id} />
            <OrderFooter order={item} onApprove={() => showApprovalDialog(item)} />
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders pending approval</Text>
        }
      />
    </View>
  );
};

const OrderItemsList = ({ orderId }) => {
  const db = useSQLiteContext();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const result = await db.execAsync(
        `SELECT oi.*, mi.name FROM order_items oi 
         JOIN menu_items mi ON mi.id = oi.menu_item_id 
         WHERE oi.order_id = ?`,
        [orderId]
      );
      setItems(result.rows);
    };
    fetchItems();
  }, [db, orderId]);

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <OrderItem
          item={{
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.unit_price
          }}
        />
      )}
      keyExtractor={item => item.id}
    />
  );
};

const OrderHeader = ({ order }) => (
  <View style={styles.orderHeader}>
    <Text style={styles.orderId}>#{order.id.slice(0, 6)}</Text>
    <Text style={styles.orderTime}>
      {new Date(order.created_at).toLocaleTimeString()}
    </Text>
    {order.customer_id && !order.customer_id.startsWith('anon_') && (
      <MaterialIcons name="loyalty" size={20} color="#2a9d8f" />
    )}
  </View>
);

const OrderFooter = ({ order, onApprove }) => (
  <View style={styles.orderFooter}>
    <Text style={styles.orderTotal}>
      Total: {formatCurrency(order.total_amount)}
    </Text>
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.button, styles.declineButton]}
        onPress={() => onApprove(order, false)}
      >
        <Text style={styles.buttonText}>Decline</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.approveButton]}
        onPress={() => onApprove(order, true)}
      >
        <Text style={styles.buttonText}>Approve</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#264653'
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4
  },
  approveButton: {
    backgroundColor: '#2a9d8f'
  },
  declineButton: {
    backgroundColor: '#e76f51'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666'
  }
});

export default OrderReviewScreen;
