import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LoyaltyScreen = () => {
  const db = useSQLiteContext();
  const [points, setPoints] = useState(0);
  const customerId = '0701000001'; // Replace with real ID or pass via props/context

  // 🧠 Options displayed to user
  const redemptionOptions = [
    { id: 'coffee', label: 'Free Coffee ☕ (3000 pts)', cost: 3000 },
    { id: 'fries', label: 'Free Fries 🍟 (2500 pts)', cost: 2500 },
    { id: 'voucher', label: 'Premium Reward (2000 pts)', cost: 2000 },
  ];

  useEffect(() => {
    const fetchPoints = async () => {
      const res = await db.getAllAsync(
        `SELECT points FROM customers WHERE id = ?`,
        [customerId]
      );
      setPoints(res?.[0]?.points ?? 0);
    };
    fetchPoints();
  }, []);

  const handleRedeem = async (item: any) => {
    if (points < item.cost) return;

    await db.runAsync(
      `INSERT INTO loyalty_redemptions (customer_id, points, date)
       VALUES (?, ?, ?)`,
      [customerId, item.cost, Date.now()]
    );

    await db.runAsync(
      `UPDATE customers SET points = points - ? WHERE id = ?`,
      [item.cost, customerId]
    );

    setPoints(p => p - item.cost);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Points Available: {points}</Text>
      <FlatList
        data={redemptionOptions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              points >= item.cost ? styles.active : styles.disabled
            ]}
            onPress={() => points >= item.cost && handleRedeem(item)}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.cost}>{item.cost} pts</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#f8f9fa' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  option: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  active: { backgroundColor: '#2a9d8f' },
  disabled: { backgroundColor: '#ccc' },
  label: { color: '#fff', fontSize: 16 },
  cost: { color: '#fff', fontWeight: 'bold' }
});

export default LoyaltyScreen;
