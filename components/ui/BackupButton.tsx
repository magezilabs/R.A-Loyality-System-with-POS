import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useMonthlyCSVExport from '@/hooks/useMonthlyCSVExport';

const MonthlyExportButton = () => {
  const [loading, setLoading] = useState(false);
  const exportCSV = useMonthlyCSVExport();

  const handleExport = async () => {
    setLoading(true);
    try {
      const path = await exportCSV();
      Alert.alert('Success', `Backup saved to:\n${path}`);
    } catch (error) {
      Alert.alert('Error', 'Could not generate backup.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleExport}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.text}>
          {loading ? 'Exporting...' : 'Export Monthly Backup'}
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  button: {
    backgroundColor: '#2a9d8f',
    padding: 12,
    borderRadius: 8
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default MonthlyExportButton;
