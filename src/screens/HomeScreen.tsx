import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MenuCard } from '../components/MenuCard';
import { useCartStore } from '../store/CartContext';
import { getAllCategories, getAllMenuItems } from '../services/database';
import { Category, MenuItem } from '../types';

export const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const { addItem, getItemQuantity } = useCartStore();

  const loadData = async () => {
    const cats = await getAllCategories();
    const items = await getAllMenuItems();
    setCategories(cats);
    setMenuItems(items);
    if (cats.length > 0) {
      setSelectedCategory(cats[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const filteredItems = menuItems.filter((item) => item.category_id === selectedCategory);

  const formatDate = () => {
    const now = new Date();
    return `${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🍖 小吃店点餐系统 {formatDate()}</Text>
        </View>
      </View>

      <View style={styles.authorInfo}>
        <Text style={styles.authorName}>作者：希望的种子；联系电话：13511254537</Text>
      </View>

      <View style={styles.categories}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(cat) => cat.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                selectedCategory === item.id && styles.categoryBtnActive,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item.id && styles.categoryBtnActiveText,
              ]}>
                {item.icon} {item.name}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.content}>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuCard
              item={item}
              quantity={getItemQuantity(item.id)}
              onAdd={() => addItem(item)}
            />
          )}
          style={styles.menuList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ff6b35',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  authorInfo: {
    backgroundColor: '#fffaf8',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffe0d4',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  authorPhone: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '500',
  },
  categories: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryBtnActive: {
    backgroundColor: '#ff6b35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  categoryBtnActiveText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuList: {
    flex: 1,
  },
});
