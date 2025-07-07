import { useOrder } from '@/context/OrderContext';
import { MenuItem as MenuItemType } from '@/utils/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  item: MenuItemType;
};

const MenuItem = ({ item }: Props) => {
  const { addToOrder } = useOrder();

  return (
    <TouchableOpacity style={styles.container} onPress={() => addToOrder(item)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>UGX {item.price.toLocaleString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: { fontSize: 16 },
  price: { fontWeight: 'bold', color: '#e76f51' },
});

export default MenuItem;
