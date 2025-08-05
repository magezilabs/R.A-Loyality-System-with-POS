import { OrderProvider } from '@/context/OrderContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { AuthProvider } from '@/context/AuthContext';
import LoginScreen from '../LoginScreen';

export default function TabLayout() {
  return (
    <AuthProvider>
    <LoginScreen>
    <OrderProvider>
   {/*  <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          const icons: Record<string, string> = {
            Order: 'restaurant',
            Review: 'list-alt',
            Approved: 'check-circle',
            Loyalty: 'card-giftcard',
            Admin: 'admin-panel-settings',
          };
          return <MaterialIcons name={icons[route.name as keyof typeof icons] as keyof typeof MaterialIcons.glyphMap} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2a9d8f',
        tabBarInactiveTintColor: '#264653',
      })}
    />
    */}

    <Tabs 
    screenOptions={
      {
      tabBarActiveTintColor: '#2a9d8f',
      tabBarInactiveTintColor: '#264653',
      headerBackButtonDisplayMode: 'generic',
      headerTitle:'R.A Restaurant', 
      headerTitleStyle:{color:'#225008ff', fontWeight:'600'}
    } 
      }>
        <Tabs.Screen name='Order' options= { {tabBarIcon:({ color, size }) => (<MaterialIcons name='restaurant' color={color} size={size}/>)}} />
        <Tabs.Screen name='Review' options= { {tabBarIcon:({ color, size }) => (<MaterialIcons name='list-alt' color={color}/>)}} />
         <Tabs.Screen name='Loyalty' options= { {tabBarIcon:({ color, size }) => (<MaterialIcons name='card-giftcard' color={color}/>)}} />
        <Tabs.Screen name='Approved' options= { {tabBarIcon:({ color, size }) => (<MaterialIcons name='check-circle' color={color}/>)}} />
        <Tabs.Screen name='Admin' options= { {tabBarIcon:({ color, size }) => (<MaterialIcons name='settings' color={color}/>)}} />
    </Tabs>

    </OrderProvider>
    </LoginScreen>
    </AuthProvider>
  );
}
