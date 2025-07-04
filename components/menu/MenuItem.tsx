import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useOrder } from '../../../context/OrderContext';

type MenuItemProps = {
  item: {
    name: string;
    price: number;
    // add other properties if needed
  };
};

type OrderContextType = {
  addToOrder: (item: MenuItemProps['item']) => void;
};

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addToOrder } = useOrder() as OrderContextType;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => addToOrder(item)}
    >
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
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 16
  },
  price: {
    fontWeight: 'bold',
    color: '#e76f51'
  }
});

export default MenuItem;
