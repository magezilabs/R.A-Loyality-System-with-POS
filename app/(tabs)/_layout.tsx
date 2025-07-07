import { OrderProvider } from '@/context/OrderContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="posa.db" databaseOptions={{ version: 1 }}>
    <OrderProvider>
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const icons: Record<string, string> = {
            Order: 'restaurant',
            Review: 'list-alt',
            Approved: 'check-circle',
            Admin: 'admin-panel-settings',
            Loyalty: 'card-giftcard',
          };
          return <MaterialIcons name={icons[route.name as keyof typeof icons] as keyof typeof MaterialIcons.glyphMap} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2a9d8f',
        tabBarInactiveTintColor: '#264653',
      })}
    />
    </OrderProvider>
    </SQLiteProvider>
  );
}
