import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLoyalty } from '@/context/LoyaltyContext';

interface CustomerFormProps {
  onContinue: (customer: any) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onContinue }) => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const { checkLoyaltyStatus } = useLoyalty();

  const handleSubmit = async () => {
    const customer = await checkLoyaltyStatus(phone, email);
    onContinue(customer);
  };

  return (
    <View style={styles.container}>
      <Text>Customer Info (Optional)</Text>
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Button title="Submit" onPress={handleSubmit} />
      <Button
        title="Skip → Anonymous"
        onPress={() => onContinue(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8,
    padding: 8,
    borderRadius: 4
  }
});

export default CustomerForm;
