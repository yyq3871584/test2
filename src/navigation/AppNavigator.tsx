import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { CartScreen } from '../screens/CartScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { MenuManagementScreen } from '../screens/MenuManagementScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#ff6b35',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarStyle: {
            paddingBottom: 10,
            paddingTop: 10,
            height: 65,
          },
        }}
      >
        <Tab.Screen
          name="点餐"
          component={HomeScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🍽️</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="购物车"
          component={CartScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🛒</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="订单"
          component={OrdersScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>📋</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="统计"
          component={StatsScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>📊</Text>,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="菜品管理"
          component={MenuManagementScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🍔</Text>,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
