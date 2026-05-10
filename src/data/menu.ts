import { Category, MenuItem } from '../types';

export const categories: Category[] = [
  { id: '1', name: '卤味', icon: '🍖' },
  { id: '2', name: '炸物', icon: '🍟' },
  { id: '3', name: '饮品', icon: '🥤' },
  { id: '4', name: '主食', icon: '🍜' },
];

export const menuItems: MenuItem[] = [
  { id: '101', category_id: '1', name: '卤鸡腿05', price: 12, unit: '个' },
  { id: '102', category_id: '1', name: '卤鸡翅', price: 8, unit: '个' },
  { id: '103', category_id: '1', name: '卤鸭脖', price: 6, unit: '根' },
  { id: '104', category_id: '1', name: '卤豆干', price: 3, unit: '块' },
  { id: '105', category_id: '1', name: '卤藕片', price: 4, unit: '份' },
  { id: '201', category_id: '2', name: '薯条', price: 8, unit: '份' },
  { id: '202', category_id: '2', name: '炸鸡排', price: 10, unit: '块' },
  { id: '203', category_id: '2', name: '炸鸡柳', price: 9, unit: '份' },
  { id: '204', category_id: '2', name: '炸春卷', price: 6, unit: '份' },
  { id: '301', category_id: '3', name: '可乐', price: 5, unit: '瓶' },
  { id: '302', category_id: '3', name: '雪碧', price: 5, unit: '瓶' },
  { id: '303', category_id: '3', name: '冰红茶', price: 5, unit: '瓶' },
  { id: '304', category_id: '3', name: '矿泉水', price: 3, unit: '瓶' },
  { id: '401', category_id: '4', name: '炒饭', price: 15, unit: '份' },
  { id: '402', category_id: '4', name: '炒面', price: 15, unit: '份' },
  { id: '403', category_id: '4', name: '水饺', price: 12, unit: '份' },
  { id: '404', category_id: '4', name: '姚氏火腿', price: 999, unit: '份' },
];
