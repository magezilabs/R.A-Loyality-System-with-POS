import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';


const Login : React.FC<{ children: React.ReactNode }> =  ( {children} ) => {
  const [pin, setPin] = useState('');
  const [user, setUser] = useState('');
  const { isAuthenticated, checkPassword } = useAuth(); 

  const handleLogin = () => {
    const success = checkPassword(user, pin);
    if (!success){
      Alert.alert('Access Denied', 'Invalid . Please try again.');
    }
  }

  setPin('');
  setUser('');


    if (!isAuthenticated) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Staff Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your name"
            keyboardType='default'
            maxLength={30}
            value={user}
            onChangeText={setUser}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter 4-digit "
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
  }
  return children;
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
