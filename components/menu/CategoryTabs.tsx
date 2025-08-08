import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const categories = ['All', 'Food', 'Drinks', 'Desserts'];

type Props = {
  onSelectCategory: (category: string | null) => void;
};

const CategoryTabs = ({ onSelectCategory }: Props) => {
  const [active, setActive] = useState('All');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat}
          style={[styles.tab, active === cat && styles.activeTab]}
          onPress={() => {
            setActive(cat);
            onSelectCategory(cat === 'All' ? null : cat);
          }}
        >
          <Text style={styles.tabText}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 5, padding: 8 },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 5,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    height: 40,
  },
  activeTab: { backgroundColor: '#2a9d8f' },
  tabText: { color: '#333' },
});

export default CategoryTabs;
