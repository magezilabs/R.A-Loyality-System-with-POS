import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { dbPromise } from '../../services/database';
import type { Order } from '../../utils/types';
import OrderCard from '../components/orders/OrderCard';

const ApprovedOrdersScreen = () => {
  const [approvedOrders, setApprovedOrders] = useState<Order[]>([]);

  const fetchApprovedOrders = async () => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const todayTimestamp = todayMidnight.getTime();

    const db = await dbPromise;
    // Use getAllAsync for parameterized queries
    const result = await db.getAllAsync<Order>(
      `SELECT * FROM orders 
       WHERE status = ? AND created_at >= ? 
       ORDER BY created_at DESC`,
      ['approved', todayTimestamp]
    );
    setApprovedOrders(result || []);
  };

  useEffect(() => {
    fetchApprovedOrders();
    const interval = setInterval(fetchApprovedOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approved Orders</Text>
      <FlatList
        data={approvedOrders}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            showStatus={false}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No approved orders today</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666'
  }
});

export default ApprovedOrdersScreen;
