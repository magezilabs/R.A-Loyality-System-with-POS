import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface Props {
  phone: string;
  setPhone: (val: string) => void;
}

const CustomerForm = ({ phone, setPhone }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customer Phone (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
});

export default CustomerForm;
