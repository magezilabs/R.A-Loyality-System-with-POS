import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useOrder } from '../../context/OrderContext';
import { dbPromise } from '../../services/database'; // Async SQLite instance
import MenuItem from '../components/menu/MenuItem';
import OrderSummary from '../components/orders/OrderSummary';

const MenuScreen = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { addToOrder, currentOrder } = useOrder();

  const fetchMenuItems = async () => {
    // Ensure dbPromise is initialized before fetching
    if (!dbPromise) {
      console.error('Database not initialized');
      return;
    }
    
    
    try {
      const db = await dbPromise;

      //seed data
      await db.execAsync(`
        INSERT OR IGNORE INTO menu_items (id, name, price, category, is_available)
        VALUES ('1', 'Sample Burger', 12000, 'Burgers', 1)
      `);

      // Fetch only available menu items
      const result = await db.execAsync(
        `SELECT * FROM menu_items WHERE is_available = 1`
      );
      setMenuItems(result.rows);
    } catch (error) {
      console.error('Menu fetch error:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <View style={styles.container}>
      {menuItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No menu items available. Add new items from Admin Panel.
          </Text>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <MenuItem item={item} onPress={() => addToOrder(item)} />
          )}
          contentContainerStyle={styles.list}
        />
      )}
      <OrderSummary items={currentOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 20
  }
});

export default MenuScreen;
