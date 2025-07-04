import React from 'react';
import { FlatList, Text, View } from 'react-native';
import type { OrderItem } from '../../../utils/types';

interface Props {
  items: OrderItem[];
}

const OrderItems: React.FC<Props> = ({ items }) => (
  <View>
    <FlatList
      data={items}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Text>
          {item.name} x{item.quantity} @ {item.unit_price} UGX
        </Text>
      )}
    />
  </View>
);

export default OrderItems;
