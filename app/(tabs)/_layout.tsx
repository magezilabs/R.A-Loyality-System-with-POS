import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { OrderProvider } from '@/context/OrderContext';

export default function TabLayout() {
  return (
    <OrderProvider>
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const icons: Record<string, string> = {
            Orders: 'restaurant',
            Review: 'list-alt',
            Approved: 'check-circle',
            Admin: 'admin-panel-settings'
          };
          return <MaterialIcons name={icons[route.name as keyof typeof icons] as keyof typeof MaterialIcons.glyphMap} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2a9d8f',
        tabBarInactiveTintColor: '#264653',
      })}
    />
    </OrderProvider>
  );
}
