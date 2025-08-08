import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { exportMonthlyCSV } from '../../services/exportMonthlyCSV';
import type { Staff } from '../../utils/types';
// Remove hardcoded admin pin; will fetch from DB

const AdminPanel = () => {
  const db = useSQLiteContext(); // <-- call hook at top level
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  // adminPin is not used, so remove it for cleanliness
  const [newAdminPin, setNewAdminPin] = useState('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [staffName, setStaffName] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [staffRole, setStaffRole] = useState<'staff' | 'manager' | string>('staff');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [newStaffPin, setNewStaffPin] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [category, setCategory] = useState('');


  useEffect(() => {
    AsyncStorage.getItem('autoBackupEnabled').then(value => {
      if (value !== null) setAutoBackupEnabled(value === 'true');
    });
    // Fetch staff list
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  const fetchStaff = async () => {
    const staff = await db.getAllAsync("SELECT id, name, role FROM staff WHERE role != 'admin'") as Staff[];
    setStaffList(staff);
  };

  const handleLogin = async () => {
    const admin = await db.getFirstAsync("SELECT pin FROM staff WHERE role = 'admin' LIMIT 1") as { pin?: string } | undefined;
    if (pin === (admin?.pin || '')) {
      setAuthenticated(true);
      setPin('');
    } else {
      Toast.show({ type: 'error', text1: 'Access Denied', text2: 'Incorrect PIN', position:'top' });
    }
  };

  const handleAdminPinChange = async () => {
    if (newAdminPin.length !== 4) {
      Toast.show({ type: 'error', text1: 'PIN must be 4 digits' });
      return;
    }
    await db.runAsync("UPDATE staff SET pin = ? WHERE role = 'admin'", [newAdminPin]);
    setNewAdminPin('');
    Toast.show({ type: 'success', text1: 'Admin PIN updated' });
  };

  const handleAddStaff = async () => {
    if (!staffName || staffPin.length !== 4) {
      Toast.show({ type: 'error', text1: 'Enter name and 4-digit PIN' });
      return;
    }
    await db.runAsync(
      'INSERT INTO staff (id, name, pin, role) VALUES (?, ?, ?, ?)',
      [`staff_${Date.now()}`, staffName, staffPin, staffRole]
    );
    setStaffName('');
    setStaffPin('');
    setStaffRole('staff');
    fetchStaff();
    Toast.show({ type: 'success', text1: 'Staff added' });
  };

  const handleStaffPinChange = async () => {
    if (!selectedStaff || newStaffPin.length !== 4) {
      Toast.show({ type: 'error', text1: 'Select staff and enter 4-digit PIN' });
      return;
    }
    await db.runAsync('UPDATE staff SET pin = ? WHERE id = ?', [newStaffPin, selectedStaff.id]);
    setSelectedStaff(null);
    setNewStaffPin('');
    fetchStaff();
    Toast.show({ type: 'success', text1: 'Staff PIN updated' });
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

  //item additon function
  const handleAddMenuItem = async () => {
    if (!menuName || !menuPrice || isNaN(Number(menuPrice))) {
      Toast.show({ type: 'error', text1: 'Invalid Input', text2: 'Check name and price and category.' });
      return;
    }
    try {
      await db.runAsync(
        `INSERT INTO menu_items (id, name, price, category, is_available) VALUES (?, ?, ?, ?, ?)`,
        [`m_${Date.now()}`, menuName.trim(), parseInt(menuPrice), category.trim(), 1]
      );
      Toast.show({ type: 'success', text1: 'Item Added', text2: `${menuName} saved.`, position:'top'});
      setMenuName('');
      setMenuPrice('');
      setCategory('');
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Insert Failed', position:'top'});
    }
  };

  //item removal function

  if (!authenticated) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}
        keyboardVerticalOffset={60}
      >
        <Text style={styles.title}>Admin Access</Text>
        <TextInput
          style={styles.input}
          value={pin}
          onChangeText={setPin}
          placeholder="Enter PIN"
          secureTextEntry keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText} disabled={pin.length !==4}>Unlock Panel</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'android' ? 'padding' : undefined}
        keyboardVerticalOffset={60}
      >
      <Text style={styles.title}>Admin Panel</Text>

      <View style={styles.row}>
        <Text>Auto Monthly Backup</Text>
        <Switch value={autoBackupEnabled} onValueChange={toggleAutoBackup} />
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={handleManualExport}>
        <Text style={styles.buttonText}>Export Monthly Backup</Text>
      </TouchableOpacity>



      {/* Staff List and PIN Change */}
      <View style={styles.form}>
        <Text style={styles.subtitle}>Staff List</Text>
        {staffList.map(staff => (
          <TouchableOpacity
            key={staff.id}
            style={{ padding: 8, backgroundColor: selectedStaff?.id === staff.id ? '#e0e0e0' : '#fafafa', marginVertical: 2, borderRadius: 4 }}
            onPress={() => setSelectedStaff(staff)}
          >
            <Text>{staff.name} ({staff.role})</Text>
          </TouchableOpacity>
        ))}
        <TextInput
          style={styles.input}
          value={newStaffPin}
          onChangeText={setNewStaffPin}
          placeholder="New 4-digit Staff PIN"
          keyboardType="number-pad"
          maxLength={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleStaffPinChange}>
          <Text style={styles.buttonText}>Change Staff PIN</Text>
        </TouchableOpacity>
      </View>

        {/* Staff Management */}
      <View style={styles.form}>
        <Text style={styles.subtitle}>Add Staff</Text>
        <TextInput
          style={styles.input}
          value={staffName}
          onChangeText={setStaffName}
          placeholder="Staff Name"
        />
        <TextInput
          style={styles.input}
          value={staffPin}
          onChangeText={setStaffPin}
          placeholder="4-digit PIN"
          keyboardType="number-pad"
          maxLength={4}
        />
        <TextInput
          style={styles.input}
          value={staffRole}
          onChangeText={setStaffRole}
          placeholder="Role (staff)"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddStaff}>
          <Text style={styles.buttonText}>Add Staff</Text>
        </TouchableOpacity>
      </View>

            {/* Admin PIN Change */}
      <View style={styles.form}>
        <Text style={styles.subtitle}>Change Admin PIN</Text>
        <TextInput
          style={styles.input}
          value={newAdminPin}
          onChangeText={setNewAdminPin}
          placeholder="New 4-digit Admin PIN"
          keyboardType="number-pad"
          maxLength={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleAdminPinChange}>
          <Text style={styles.buttonText}>Set Admin PIN</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Item Add */}
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
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Category"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddMenuItem}>
          <Text style={styles.buttonText}>Save Item</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </ScrollView>
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
