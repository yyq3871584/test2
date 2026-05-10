import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Order } from '../types';
import { getTodayOrders } from '../services/database';

export const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await getTodayOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const grandTotal = orders.reduce((sum, order) => sum + order.total_price, 0);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>今日暂无订单</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 今日订单明细</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(order) => String(order.id)}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNo}>订单号: {item.order_no}</Text>
              <Text style={styles.orderTime}>{formatDate(item.paid_at || '')}</Text>
            </View>
            <View style={styles.orderItems}>
              {item.items.map((orderItem) => (
                <View key={orderItem.id} style={styles.orderItem}>
                  <Text style={styles.itemName}>{orderItem.name}</Text>
                  <Text style={styles.itemQty}>x{orderItem.quantity}</Text>
                  <Text style={styles.itemPrice}>¥{orderItem.price}</Text>
                  <Text style={styles.itemAmount}>¥{(orderItem.price * orderItem.quantity).toFixed(1)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.orderTotal}>
              <Text style={styles.totalLabel}>小计</Text>
              <Text style={styles.totalAmount}>¥{item.total_price.toFixed(1)}</Text>
            </View>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.orderList}
      />

      <View style={styles.footer}>
        <View style={styles.grandTotal}>
          <Text style={styles.grandTotalLabel}>汇总合计</Text>
          <Text style={styles.grandTotalAmount}>¥{grandTotal.toFixed(1)}</Text>
        </View>
        <Text style={styles.orderCount}>共 {orders.length} 笔订单</Text>
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
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  orderList: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderNo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  orderTime: {
    fontSize: 13,
    color: '#999',
  },
  orderItems: {
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemName: {
    flex: 2,
    fontSize: 14,
    color: '#333',
  },
  itemQty: {
    fontSize: 13,
    color: '#666',
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 13,
    color: '#666',
    marginRight: 12,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff6b35',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  orderCount: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
