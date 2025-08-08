import { useOrder } from '@/context/OrderContext';
import { formatCurrency } from '@/utils/helper';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfirmationModal from './ConfirmationModal';
import CustomerForm from './CustomerForm';
import OrderItems from './OrderItems';

const OrderSummary = () => {
  const db = useSQLiteContext();
  const { currentOrder, submitOrder, clearOrder } = useOrder();
  const [phone, setPhone] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pointsAvailable, setPointsAvailable] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);

  const totalAmount = currentOrder.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const netPayable = Math.max(totalAmount - pointsToUse, 0);

  useEffect(() => {
    const fetchPoints = async () => {
      if (phone && !phone.startsWith('anon_')) {
        const result = await db.getAllAsync(
          `SELECT points FROM customers WHERE id = ?`,
          [phone]
        );
        const available = result?.[0]?.points ?? 0;
        setPointsAvailable(available);
        setPointsToUse(Math.min(available, totalAmount));
      } else {
        setPointsAvailable(0);
        setPointsToUse(0);
      }
    };
    fetchPoints();
  }, [phone, totalAmount]);

  const handleSubmit = () => {
    setModalVisible(true);
  };

  const confirmSubmission = async () => {
    const customerId = phone.trim() || `anon_${Date.now()}`;

    if (pointsToUse > 0 && !customerId.startsWith('anon_')) {
      await db.runAsync(
        `INSERT INTO loyalty_redemptions (customer_id, points, date)
         VALUES (?, ?, ?)`,
        [customerId, pointsToUse, Date.now()]
      );
      await db.runAsync(
        `UPDATE customers SET points = points - ? WHERE id = ?`,
        [pointsToUse, customerId]
      );
    }

    await submitOrder(customerId);
    setModalVisible(false);
    clearOrder();
  };

  if (!currentOrder.length) return null;

  return (
     <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === 'android' ? 'padding' : undefined}
              keyboardVerticalOffset={60}
            >
      <Text style={styles.title}>Order Summary</Text>
      {currentOrder.map(item => (
        <OrderItems key={item.menu_item_id} item={item} />
      ))}
      <Text style={styles.total}>
        Subtotal: {formatCurrency(totalAmount)}
      </Text>

      {/*phone && !phone.startsWith('anon_') && */(
        <View>
            <Text style={styles.label}>Loyalty Points Available: {pointsAvailable}</Text>
        <Text style={styles.loyalty}>
          Applying {pointsToUse} points → You pay {formatCurrency(netPayable)}
        </Text>
        </View>
      )}

      <CustomerForm phone={phone} setPhone={setPhone} />

      <Button title="Confirm Order" onPress={handleSubmit} />
    
      <TouchableOpacity style={styles.button} onPress={clearOrder}>
                <Text style={styles.buttonText}>Clear Order</Text>
              </TouchableOpacity>

      <ConfirmationModal
        visible={modalVisible}
        onConfirm={confirmSubmission}
        onCancel={() => setModalVisible(false)}
        items={currentOrder}
        total={totalAmount}
        phone={phone}
        netPayable={netPayable}
        pointsApplied={pointsToUse}
      />


      {/*phone && !phone.startsWith('anon_') && (
  
  <View>
    <Text style={styles.label}>Enter Loyalty Points to Reedem (Available: {pointsAvailable})</Text>
    <TextInput
      style={styles.input}
      keyboardType='numeric'
      value={pointsToUse.toString()}
      onChangeText={val => {
        const num = Math.min(parseInt(val || '0', 10), pointsAvailable, totalAmount);
        setPointsToUse(isNaN(num) ? 0 : num);
      }}
    />
    <Text style={styles.loyalty}>
      You pay: {formatCurrency(Math.max(totalAmount - pointsToUse, 0))}
    </Text>
  </View>
)*/}
<Text style ={{textAlign: 'center', justifyContent:'center', fontSize: 9, fontWeight: 'bold', padding: 10}}>
  We value you privacy and nothing of your personal information is shared directly to our employees or anybody, everything is autonomous.
  </Text>
    </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 16, paddingBottom: 8, borderTopWidth: 1, borderTopColor: '#ddd'},
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 12 },
  total: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: '#264653' },
  loyalty: { fontStyle: 'italic', marginTop: 6, color: '#2a9d8f' },
  button: {
    backgroundColor: '#ff4b03ff', padding: 12, borderRadius: 6,
    marginTop: 10, width: '60%', alignSelf: 'center'
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default OrderSummary;
