import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { ReceiptPayload } from '@/utils/types';

const Reciept: React.FC<{ payload: ReceiptPayload }> = ({ payload }) => (
  <ScrollView style={styles.container}>
    <Text style={styles.header}>🧾 Order Receipt</Text>
    <Text>Order ID: {payload.id}</Text>
    <Text>Date: {new Date(payload.createdAt).toLocaleString()}</Text>
    <Text style={styles.section}>Items:</Text>
    {payload.items.map((item, idx) => (
      <Text key={item.name + idx}>
        - {item.name} x{item.quantity} @ {item.price} UGX
      </Text>
    ))}
    <Text style={styles.section}>Total: {payload.totalAmount} UGX</Text>
    <Text style={styles.footer}>Thank you!</Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  section: { marginTop: 12, fontWeight: 'bold' },
  footer: { marginTop: 20, textAlign: 'center', color: '#2a9d8f' }
});

export default Reciept;
