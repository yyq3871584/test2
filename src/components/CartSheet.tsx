import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { CartItem } from '../types';

interface CartSheetProps {
  cart: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckout: () => void;
}

export const CartSheet: React.FC<CartSheetProps> = ({
  cart,
  totalPrice,
  onUpdateQuantity,
  onCheckout,
}) => {
  if (cart.length === 0) {
    return (
      <View style={styles.emptyCart}>
        <Text style={styles.emptyText}>购物车为空</Text>
        <Text style={styles.emptyHint}>点击菜品添加</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>¥{item.price}</Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.cartList}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>合计</Text>
          <Text style={styles.totalPrice}>¥{totalPrice.toFixed(1)}</Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={onCheckout}>
          <Text style={styles.payBtnText}>下单支付</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyCart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#ccc',
  },
  cartList: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#ff6b35',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#ff6b35',
    backgroundColor: '#fffaf8',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  payBtn: {
    backgroundColor: '#ff6b35',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
