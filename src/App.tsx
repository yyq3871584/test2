import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppNavigator } from './navigation/AppNavigator';
import { initDatabase, insertInitialCategories, insertInitialMenuItems } from './services/database';
import { CartProvider } from './store/CartContext';
import { categories, menuItems } from './data/menu';

export default function App(): React.ReactElement {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        await insertInitialCategories(categories);
        await insertInitialMenuItems(menuItems);
      } catch (error) {
        console.error('Database initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={styles.loadingText}>正在初始化...</Text>
      </View>
    );
  }

  return (
    <CartProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});
