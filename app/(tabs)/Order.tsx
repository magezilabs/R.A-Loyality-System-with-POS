import CategoryTabs from '@/components/menu/CategoryTabs';
import MenuItem from '@/components/menu/MenuItem';
import OrderSummary from '@/components/orders/OrderSummary';
import { useOrder } from '@/context/OrderContext';
import { MenuItem as MenuItemType } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function OrdersTab() {
  const db = useSQLiteContext();
  const [allItems, setAllItems] = useState<MenuItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>([]);
  const { currentOrder, addToOrder } = useOrder();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await db.getAllAsync(
          'SELECT * FROM menu_items WHERE is_available = 1'
        );
        console.log(result)
        setAllItems((result || []) as MenuItemType[]);
        setFilteredItems((result || []) as MenuItemType[]);
        console.log(result);
        
      } catch (error) {
        console.error('Menu fetch error:', error);
      }
    };
    fetchItems();
    const interval = setInterval(fetchItems, 30000);
    return () => clearInterval(interval);
  }, [db]);

  const handleSelectCategory = (category: string | null) => {
    if (!category) return setFilteredItems(allItems);
    const filtered = allItems.filter(item => item.category === category);
    setFilteredItems(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start a New Order</Text>
      <CategoryTabs onSelectCategory={handleSelectCategory} />
   
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MenuItem item={item} />
        )}
        ListFooterComponent ={ (<Text>😊 Tasty, 💪 Healthy & 🔥 Fresh</Text>) }
        ListFooterComponentStyle ={{alignItems:"center", justifyContent:'center', marginVertical:5}}
        ListEmptyComponent={
          <Text style={styles.empty}>No items in this category</Text>
        }
      />
      {currentOrder.length > 0 && <OrderSummary />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f8f9fa'},
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14, color: '#888' },
});
