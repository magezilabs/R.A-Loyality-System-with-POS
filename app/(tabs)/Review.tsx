import OrderCard from '@/components/orders/OrderCard';
import OrderItem from '@/components/orders/OrderItems';
import { printReceipt } from '@/services/printer';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const OrderReviewScreen = () => {
  const db = useSQLiteContext();
  const [orders, setOrders] = useState<any[]>([]);

  // 🔄 Poll pending orders every 3s
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const res = await db.getAllAsync(
      `SELECT * FROM orders WHERE status = ? ORDER BY created_at ASC`,
      ['pending']
    );
    setOrders(res ?? []);
  };

  // 🧠 Apply discount automatically if user has ≥ 2000 points
  const handleApproval = async (order: any) => {
    let discount = 0;

    // Ignore anonymous customers
    if (order.customer_id && !order.customer_id.startsWith('anon_')) {
      const result = await db.getAllAsync(
        `SELECT points FROM customers WHERE id = ?`,
        [order.customer_id]
      );
      const points = result?.[0]?.points ?? 0;

      if (points >= 2000) {
        discount = 2000;

        // 📝 Log redemption
        await db.runAsync(
          `INSERT INTO loyalty_redemptions (customer_id, points, date)
           VALUES (?, ?, ?)`,
          [order.customer_id, discount, Date.now()]
        );

        // 💳 Deduct points
        await db.runAsync(
          `UPDATE customers SET points = points - ? WHERE id = ?`,
          [discount, order.customer_id]
        );

        // 💰 Update total in DB
        await db.runAsync(
          `UPDATE orders SET total_amount = total_amount - ? WHERE id = ?`,
          [discount, order.id]
        );

        order.total_amount -= discount; // Keep local copy synced
      }
    }

    // ✅ Finalize status & trigger receipt
    await db.runAsync(
      `UPDATE orders SET status = ? WHERE id = ?`,
      ['approved', order.id]
    );

    printReceipt(order);
    fetchOrders();
  };

  const handleDecline = async (order: any) => {
    await db.runAsync(
      `UPDATE orders SET status = ?, decline_reason = ? WHERE id = ?`,
      ['declined', 'Changed mind', order.id]
    );
    fetchOrders();
  };

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <OrderCard order={item} showStatus />
      <OrderItemsList orderId={item.id} />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.declineBtn} onPress={() => handleDecline(item)}>
          <Text style={styles.btnText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.approveBtn} onPress={() => handleApproval(item)}>
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pending Orders: {orders.length}</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No pending orders</Text>}
      />
    </View>
  );
};

// 📦 List items under each order
const OrderItemsList = ({ orderId }: { orderId: string }) => {
  const db = useSQLiteContext();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await db.getAllAsync(
        `SELECT oi.*, mi.name FROM order_items oi
         JOIN menu_items mi ON mi.id = oi.menu_item_id
         WHERE oi.order_id = ?`,
        [orderId]
      );
      setItems(res ?? []);
    };
    fetchItems();
  }, [orderId]);

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <OrderItem
          item={{
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.unit_price,
          }}
        />
      )}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 12, marginBottom: 12, borderRadius: 8, elevation: 2 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  declineBtn: { backgroundColor: '#e76f51', padding: 8, borderRadius: 5 },
  approveBtn: { backgroundColor: '#2a9d8f', padding: 8, borderRadius: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40 },
});

export default OrderReviewScreen;
