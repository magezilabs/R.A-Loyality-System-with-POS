import { formatCurrency } from '@/utils/helper';
import { MenuItem } from '@/utils/types';
import React from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  items: MenuItem[];
  total: number;
  phone: string;
  netPayable: number;
  pointsApplied: number;
}

const ConfirmationModal = ({
  visible,
  onConfirm,
  onCancel,
  items,
  total,
  phone,
  netPayable,
  pointsApplied,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Confirm Order</Text>
          {items.map(item => (
            <Text key={item.id}>
              {item.name} × {item.quantity}
            </Text>
          ))}
          <Text style={styles.amount}>Subtotal: {formatCurrency(total)}</Text>

          {phone && !phone.startsWith('anon_') && (
            <Text style={styles.points}>
              Using {pointsApplied} pts → You Pay: {formatCurrency(netPayable)}
            </Text>
          )}

          <Text style={styles.customer}>
            Customer: {phone ? phone : 'Anonymous'}
          </Text>

          <View style={styles.buttons}>
            <Button title="Submit Order" onPress={onConfirm} />
            <Button title="Cancel" onPress={onCancel} color="#999" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    elevation: 6,
  },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  amount: { marginTop: 10, fontSize: 16, fontWeight: '600' },
  points: { marginTop: 8, color: '#2a9d8f', fontStyle: 'italic' },
  customer: { marginTop: 8, fontStyle: 'italic', color: '#555' },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ConfirmationModal;
