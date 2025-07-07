import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Redemption {
  id?: string | number;
  date?: number;
  points: number;
}

const LoyaltyScreen = () => {
  const db = useSQLiteContext();
  const [loyaltyInfo, setLoyaltyInfo] = useState<{ points: number; redeemed: Redemption[] }>({
    points: 0,
    redeemed: []
  });

  const customerId = '256XXXXXXXXX'; // Ideally passed via context

  const fetchLoyaltyData = async () => {
    // Get points
    const pointsResult = await db.execAsync(
      `SELECT points FROM customers WHERE id = ?`,
      [customerId]
    );
    const points =
      pointsResult.rows && pointsResult.rows.length
        ? pointsResult.rows[0].points
        : 0;

    // Get redemptions
    const redemptionResult = await db.execAsync(
      `SELECT * FROM loyalty_redemptions WHERE customer_id = ? ORDER BY date DESC`,
      [customerId]
    );

    setLoyaltyInfo({
      points,
      redeemed: redemptionResult.rows || []
    });
  };

  useEffect(() => {
    fetchLoyaltyData();
    const interval = setInterval(fetchLoyaltyData, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Points: {loyaltyInfo.points}</Text>
      <FlatList
        data={loyaltyInfo.redeemed}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <Text style={styles.redemption}>
            {item.date
              ? new Date(item.date).toLocaleDateString()
              : 'Unknown date'}
            : {item.points} points redeemed
          </Text>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No redemptions found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    flex: 1
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  redemption: {
    fontSize: 16,
    paddingVertical: 6
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    color: '#999'
  }
});

export default LoyaltyScreen;
