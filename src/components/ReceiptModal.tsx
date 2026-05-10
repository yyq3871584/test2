import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { OrderItem } from '../types';

interface ReceiptModalProps {
  visible: boolean;
  items: OrderItem[];
  total: number;
  orderNo: string;
  paidAt: string;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  visible,
  items,
  total,
  orderNo,
  paidAt,
  onClose,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>✅ 支付成功</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.orderNoSection}>
              <Text style={styles.orderNoLabel}>订单号</Text>
              <Text style={styles.orderNo}>{orderNo}</Text>
            </View>
            <View style={styles.itemsSection}>
              {items.map((item) => (
                <View key={item.id} style={styles.receiptItem}>
                  <Text style={styles.itemName}>{item.name} x{item.quantity}</Text>
                  <Text style={styles.itemAmount}>¥{(item.price * item.quantity).toFixed(1)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>合计</Text>
              <Text style={styles.totalAmount}>¥{total.toFixed(1)}</Text>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>支付时间：{formatDate(paidAt)}</Text>
              <Text style={styles.footerText}>谢谢惠顾，欢迎下次光临！</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>完成</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#ff6b35',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  orderNoSection: {
    textAlign: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderNoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  orderNo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsSection: {
    marginBottom: 16,
  },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemAmount: {
    fontSize: 14,
    color: '#666',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  closeBtn: {
    backgroundColor: '#ff6b35',
    padding: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
