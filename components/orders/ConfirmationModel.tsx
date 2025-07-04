// src/components/orders/ConfirmationModal.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationModel: React.FC<Props> = ({ visible, onConfirm, onCancel, message }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}>
            <Text style={{ color: '#fff' }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0005' },
  box: { backgroundColor: '#fff', padding: 24, borderRadius: 8, width: 300 },
  message: { fontSize: 16, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'flex-end' },
  button: { padding: 10, marginLeft: 10 },
  confirm: { backgroundColor: '#2a9d8f', borderRadius: 4 }
});

export default ConfirmationModel;
