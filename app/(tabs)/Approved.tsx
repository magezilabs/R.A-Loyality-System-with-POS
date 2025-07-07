import OrderCard from '@/components/orders/OrderCard';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { Order } from '../../utils/types';

const ApprovedOrdersScreen = () => {
  const db = useSQLiteContext();
  const [approvedOrders, setApprovedOrders] = useState<Order[]>([]);

  const fetchApprovedOrders = async () => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const todayTimestamp = todayMidnight.getTime();

    try {
      const result = await db.getAllAsync<Order>(
        `SELECT * FROM orders 
         WHERE status = ? AND created_at >= ? 
         ORDER BY created_at DESC`,
        ['approved', todayTimestamp]
      );
      //console.log('📦 Menu result:', result);
      console.log('✅ Approved Orders result:', result);
      console.log('📦 Extracted rows:', result?.rows ?? []);

setApprovedOrders(result?.rows ?? []);
    } catch (error) {
      console.error('Error fetching approved orders:', error);
      setApprovedOrders([]);
    }
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
