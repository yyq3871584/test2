export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  price: number;
  unit: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  order_no: string;
  items: OrderItem[];
  total_price: number;
  status: 'pending' | 'paid';
  created_at: string;
  paid_at?: string;
}

export interface TodayStats {
  date: string;
  order_count: number;
  total_revenue: number;
}
