import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TodayStats } from '../types';
import { getTodayStats } from '../services/database';

export const StatsScreen: React.FC = () => {
  const [stats, setStats] = useState<TodayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const data = await getTodayStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>📊 今日统计</Text>
        <Text style={styles.date}>{formatDate(stats?.date || '')}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📝</Text>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{stats?.order_count || 0}</Text>
            <Text style={styles.statLabel}>订单数</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💰</Text>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>¥{(stats?.total_revenue || 0).toFixed(1)}</Text>
            <Text style={styles.statLabel}>营收</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>营业概览</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>平均客单价</Text>
          <Text style={styles.summaryValue}>
            ¥{stats && stats.order_count > 0
              ? (stats.total_revenue / stats.order_count).toFixed(1)
              : '0.0'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>总订单数</Text>
          <Text style={styles.summaryValue}>{stats?.order_count || 0} 笔</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>总收入</Text>
          <Text style={styles.summaryValue}>¥{(stats?.total_revenue || 0).toFixed(1)}</Text>
        </View>
      </View>
    </ScrollView>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
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
  statsCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#eee',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  tipsCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#fffaf8',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tipsContent: {
    fontSize: 13,
    color: '#666',
    lineHeight: 1.6,
  },
});
