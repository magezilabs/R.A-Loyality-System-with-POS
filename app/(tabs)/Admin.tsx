import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { exportMonthlyCSV } from '../../services/exportMonthlyCSV';

const ADMIN_PIN = '2025';

const AdminPanel = () => {
  const db = useSQLiteContext(); // <-- call hook at top level
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('autoBackupEnabled').then(value => {
      if (value !== null) setAutoBackupEnabled(value === 'true');
    });
  }, []);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setPin('');
    } else {
      Toast.show({ type: 'error', text1: 'Access Denied', text2: 'Incorrect PIN' });
    }
  };

  const toggleAutoBackup = async (value: boolean) => {
    setAutoBackupEnabled(value);
    await AsyncStorage.setItem('autoBackupEnabled', String(value));
    Toast.show({
      type: 'success',
      text1: value ? 'Auto Backup Enabled' : 'Auto Backup Disabled'
    });
  };

  const handleManualExport = async () => {
    try {
      const path = await exportMonthlyCSV();
      Toast.show({ type: 'success', text1: 'Backup Created', text2: `Saved to:\n${path}` });
    } catch {
      Toast.show({ type: 'error', text1: 'Export Failed', text2: 'Try again later.' });
    }
  };

  const handleAddMenuItem = async () => {
    if (!menuName || !menuPrice || isNaN(Number(menuPrice))) {
      Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Check name and price.' });
      return;
    }

    try {
      await db.runAsync(
        `INSERT INTO menu_items (id, name, price) VALUES (?, ?, ?)`,
        [`m_${Date.now()}`, menuName.trim(), parseInt(menuPrice)]
      );
      Toast.show({ type: 'success', text1: 'Item Added', text2: `${menuName} saved.` });
      setMenuName('');
      setMenuPrice('');
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Insert Failed' });
    }
  };

  if (!authenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Admin Access</Text>
        <TextInput
          style={styles.input}
          value={pin}
          onChangeText={setPin}
          placeholder="Enter PIN"
          secureTextEntry keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Unlock Panel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      <View style={styles.row}>
        <Text>Auto Monthly Backup</Text>
        <Switch value={autoBackupEnabled} onValueChange={toggleAutoBackup} />
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={handleManualExport}>
        <Text style={styles.buttonText}>Export Monthly Backup</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.subtitle}>Add New Menu Item</Text>
        <TextInput
          style={styles.input}
          value={menuName}
          onChangeText={setMenuName}
          placeholder="Item Name"
        />
        <TextInput
          style={styles.input}
          value={menuPrice}
          onChangeText={setMenuPrice}
          placeholder="Item Price"
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddMenuItem}>
          <Text style={styles.buttonText}>Save Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 10, borderRadius: 6, marginVertical: 6
  },
  button: {
    backgroundColor: '#2a9d8f', padding: 12, borderRadius: 6,
    marginTop: 10
  },
  exportButton: {
    backgroundColor: '#264653', padding: 12, borderRadius: 6,
    marginTop: 20
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginVertical: 10
  },
  form: { marginTop: 10 }
});

export default AdminPanel;
