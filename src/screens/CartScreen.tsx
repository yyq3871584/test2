import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useCartStore } from '../store/CartContext';
import { createOrder, payOrder } from '../services/database';
import { ReceiptModal } from '../components/ReceiptModal';
import { OrderItem } from '../types';

export const CartScreen: React.FC = () => {
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    items: OrderItem[];
    total: number;
    orderNo: string;
    paidAt: string;
  } | null>(null);

  const {
    cart,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCartStore();

  const handleCheckout = async () => {
    const orderItems: OrderItem[] = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const orderResult = await createOrder(orderItems, totalPrice());
      const payResult = await payOrder(orderResult.id);

      setReceiptData({
        items: orderItems,
        total: totalPrice(),
        orderNo: payResult.orderNo,
        paidAt: payResult.paidAt,
      });
      setReceiptVisible(true);
      clearCart();
    } catch (error) {
      console.error('Order failed:', error);
    }
  };

  const renderContent = () => {
    if (cart.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>购物车为空</Text>
          <Text style={styles.emptyHint}>去点餐页面添加商品吧</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}>🛒 购物车</Text>
          <Text style={styles.count}>{cart.length} 种商品</Text>
        </View>

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
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemTotal}>¥{(item.price * item.quantity).toFixed(1)}</Text>
            </View>
          )}
          style={styles.cartList}
        />

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>合计</Text>
            <Text style={styles.totalPrice}>¥{totalPrice().toFixed(1)}</Text>
          </View>
          <TouchableOpacity style={styles.payBtn} onPress={handleCheckout}>
            <Text style={styles.payBtnText}>下单支付</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <ReceiptModal
        visible={receiptVisible}
        items={receiptData?.items || []}
        total={receiptData?.total || 0}
        orderNo={receiptData?.orderNo || ''}
        paidAt={receiptData?.paidAt || ''}
        onClose={() => setReceiptVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
  header: {
    backgroundColor: '#ff6b35',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  count: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  cartList: {
    flex: 1,
    padding: 16,
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#ff6b35',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
    minWidth: 60,
    textAlign: 'right',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#ff6b35',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
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
