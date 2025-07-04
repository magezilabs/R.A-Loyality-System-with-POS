import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const categories = ['All', 'Food', 'Drinks', 'Desserts'];

type CategoryTabsProps = {
  onSelectCategory: (category: string | null) => void;
};

const CategoryTabs = ({ onSelectCategory }: CategoryTabsProps) => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.tab,
            activeCategory === category && styles.activeTab
          ]}
          onPress={() => {
            setActiveCategory(category);
            onSelectCategory(category === 'All' ? null : category);
          }}
        >
          <Text style={styles.tabText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 5,
    borderRadius: 15,
    backgroundColor: '#f0f0f0'
  },
  activeTab: {
    backgroundColor: '#2a9d8f'
  },
  tabText: {
    color: '#333'
  }
});

export default CategoryTabs;
