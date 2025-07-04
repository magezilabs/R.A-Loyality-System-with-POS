import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { calculatePoints } from '../../../utils/helper';

interface PointsCalculatorProps {
  amountSpent: number;
}

const PointsCalculator = ({ amountSpent }: PointsCalculatorProps) => {
  const points = calculatePoints(amountSpent);

  return (
    <View style={styles.container}>
      <Text>You shall earn: <Text style={styles.points}>{points} points</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  points: { fontWeight: 'bold', color: 'green' }
});

export default PointsCalculator;
