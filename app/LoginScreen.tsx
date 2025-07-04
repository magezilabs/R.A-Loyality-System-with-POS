import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [pin, setPin] = useState('');
  const { login } = useAuth(); // ✅ Assuming AuthContext exposes login(pin)

  const handleLogin = () => {
    const success = login(pin);
    if (success) {
      router.replace('./Orders'); // Redirect to tab layout
    } else {
      Alert.alert('Access Denied', 'Invalid PIN. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit PIN"
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={pin}
        onChangeText={setPin}
      />
      <Button
        title="Login"
        onPress={handleLogin}
        disabled={pin.length !== 4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlign: 'center'
  }
});

export default Login;
