import type { OrderItem } from '@/utils/types';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

interface Props {
  items: OrderItem[];
}

const OrderItems: React.FC<Props> = ({ items }) => (
  <View>
    <FlatList
      data={items}
      keyExtractor={item => item.id || `${item.menu_item_id}_${item.order_id}_${item.quantity}_${item.unit_price}`}
      renderItem={({ item }) => (
        <Text>
          {item.name} x{item.quantity} @ {item.unit_price} UGX
        </Text>
      )}
    />
  </View>
);

export default OrderItems;
