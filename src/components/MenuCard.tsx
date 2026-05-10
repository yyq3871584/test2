import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, quantity, onAdd }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onAdd}>
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>¥{item.price}</Text>
        <Text style={styles.unit}>/{item.unit}</Text>
      </View>
      {quantity > 0 && (
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  unit: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  quantityBadge: {
    backgroundColor: '#ff6b35',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
