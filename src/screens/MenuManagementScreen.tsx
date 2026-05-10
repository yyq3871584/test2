import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MenuItem, Category } from '../types';
import {
  getAllCategories,
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../services/database';

export const MenuManagementScreen: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    unit: '',
    category_id: '',
  });

  const loadItems = async () => {
    const data = await getAllMenuItems();
    setItems(data);
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
    if (data.length > 0 && !form.category_id) {
      setForm((prev) => ({ ...prev, category_id: data[0].id }));
    }
  };

  useEffect(() => {
    loadCategories();
    loadItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadItems();
    }, [])
  );

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ name: '', price: '', unit: '', category_id: categories[0]?.id || '' });
    setModalVisible(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      price: String(item.price),
      unit: item.unit,
      category_id: item.category_id,
    });
    setModalVisible(true);
  };

  const handleDelete = (item: MenuItem) => {
    Alert.alert(
      '确认删除',
      `确定要删除「${item.name}」吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            await deleteMenuItem(item.id);
            loadItems();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.unit || !form.category_id) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('提示', '价格必须是正数');
      return;
    }

    if (editingItem) {
      await updateMenuItem({
        id: editingItem.id,
        name: form.name,
        price,
        unit: form.unit,
        category_id: form.category_id,
      });
    } else {
      await addMenuItem({
        name: form.name,
        price,
        unit: form.unit,
        category_id: form.category_id,
      });
    }

    setModalVisible(false);
    loadItems();
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? `${cat.icon} ${cat.name}` : categoryId;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍔 菜品管理</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ 添加菜品</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{getCategoryName(item.category_id)}</Text>
            </View>
            <View style={styles.itemPrice}>
              <Text style={styles.priceText}>¥{item.price}</Text>
              <Text style={styles.unitText}>{item.unit}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.actionBtnText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.actionBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.itemList}
      />

      {items.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>暂无菜品</Text>
          <Text style={styles.emptyHint}>点击右上角添加菜品</Text>
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? '编辑菜品' : '添加菜品'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="菜品名称"
              value={form.name}
              onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="价格"
              keyboardType="numeric"
              value={form.price}
              onChangeText={(text) => setForm((prev) => ({ ...prev, price: text }))}
            />

            <TextInput
              style={styles.input}
              placeholder="单位（如：个、份、瓶）"
              value={form.unit}
              onChangeText={(text) => setForm((prev) => ({ ...prev, unit: text }))}
            />

            <View style={styles.categoryPicker}>
              <Text style={styles.categoryLabel}>分类</Text>
              <FlatList
                horizontal
                data={categories}
                keyExtractor={(cat) => cat.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryBtn,
                      form.category_id === item.id && styles.categoryBtnActive,
                    ]}
                    onPress={() =>
                      setForm((prev) => ({ ...prev, category_id: item.id }))
                    }
                  >
                    <Text style={styles.categoryBtnText}>
                      {item.icon} {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={handleSave}
              >
                <Text style={styles.modalBtnText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#ff6b35',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemList: {
    flex: 1,
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemInfo: {
    flex: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 13,
    color: '#999',
  },
  itemPrice: {
    flex: 1,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  unitText: {
    fontSize: 12,
    color: '#999',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: '#4CAF50',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
  },
  actionBtnText: {
    fontSize: 18,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  categoryPicker: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  categoryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryBtnActive: {
    backgroundColor: '#ff6b35',
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#999',
  },
  confirmBtn: {
    backgroundColor: '#ff6b35',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
