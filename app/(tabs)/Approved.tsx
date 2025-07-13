import OrderCard from '@/components/orders/OrderCard';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const ApprovedOrdersScreen = () => {
  const db = useSQLiteContext();
  const [orders, setOrders] = useState([]);

  const fetchApproved = async () => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    const since = midnight.getTime();

    const result = await db.getAllAsync(
      `SELECT * FROM orders WHERE status = ? AND created_at >= ? ORDER BY created_at DESC`,
      ['approved', since]
    );
    setOrders(result || []);
  };

  useEffect(() => {
    fetchApproved();
    const interval = setInterval(fetchApproved, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Approved Orders</Text>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} showStatus={false} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No approved orders today</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  empty: { textAlign: 'center', marginTop: 40, color: '#666' },
});

export default ApprovedOrdersScreen;
