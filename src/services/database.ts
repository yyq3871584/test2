import * as SQLite from 'expo-sqlite';
import { Order, OrderItem, TodayStats, MenuItem, Category } from '../types';

const db = SQLite.openDatabase('snack_shop.db');

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            icon TEXT NOT NULL
          )`,
          []
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS menu_items (
            id TEXT PRIMARY KEY,
            category_id TEXT NOT NULL,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            unit TEXT NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id)
          )`,
          []
        );
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_no TEXT NOT NULL UNIQUE,
            items TEXT NOT NULL,
            total_price REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TEXT NOT NULL,
            paid_at TEXT
          )`,
          [],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const insertInitialCategories = async (categories: Category[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        categories.forEach((cat) => {
          tx.executeSql(
            `INSERT OR IGNORE INTO categories (id, name, icon) VALUES (?, ?, ?)`,
            [cat.id, cat.name, cat.icon]
          );
        });
      },
      (error) => reject(error),
      () => resolve()
    );
  });
};

export const insertInitialMenuItems = async (items: MenuItem[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        items.forEach((item) => {
          tx.executeSql(
            `INSERT OR IGNORE INTO menu_items (id, category_id, name, price, unit) VALUES (?, ?, ?, ?, ?)`,
            [item.id, item.category_id, item.name, item.price, item.unit]
          );
        });
      },
      (error) => reject(error),
      () => resolve()
    );
  });
};

export const getAllCategories = (): Promise<Category[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT id, name, icon FROM categories ORDER BY id`,
          [],
          (_, result) => {
            const categories: Category[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              categories.push(result.rows.item(i));
            }
            resolve(categories);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const getAllMenuItems = (): Promise<MenuItem[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT id, category_id, name, price, unit FROM menu_items ORDER BY category_id, id`,
          [],
          (_, result) => {
            const items: MenuItem[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              items.push(result.rows.item(i));
            }
            resolve(items);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const addMenuItem = (item: Omit<MenuItem, 'id'>): Promise<string> => {
  return new Promise((resolve, reject) => {
    const id = `${item.category_id}${Date.now().toString().slice(-3)}`;
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO menu_items (id, category_id, name, price, unit) VALUES (?, ?, ?, ?, ?)`,
          [id, item.category_id, item.name, item.price, item.unit],
          () => resolve(id),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const updateMenuItem = (item: MenuItem): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `UPDATE menu_items SET name = ?, price = ?, unit = ?, category_id = ? WHERE id = ?`,
          [item.name, item.price, item.unit, item.category_id, item.id],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const deleteMenuItem = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `DELETE FROM menu_items WHERE id = ?`,
          [id],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const createOrder = (
  items: OrderItem[],
  totalPrice: number
): Promise<{ id: number; orderNo: string }> => {
  return new Promise((resolve, reject) => {
    const orderNo = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);
    const createdAt = new Date().toISOString();
    const itemsJson = JSON.stringify(items);

    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO orders (order_no, items, total_price, status, created_at)
           VALUES (?, ?, ?, 'pending', ?)`,
          [orderNo, itemsJson, totalPrice, createdAt],
          (_, result) => {
            const id = result.insertId ?? 0;
            resolve({ id, orderNo });
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const payOrder = (orderId: number): Promise<{ orderNo: string; paidAt: string }> => {
  return new Promise((resolve, reject) => {
    const paidAt = new Date().toISOString();

    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT order_no FROM orders WHERE id = ?`,
          [orderId],
          (_, result) => {
            if (result.rows.length === 0) {
              reject(new Error('订单不存在'));
              return;
            }
            const orderNo = result.rows.item(0).order_no;

            tx.executeSql(
              `UPDATE orders SET status = 'paid', paid_at = ? WHERE id = ?`,
              [paidAt, orderId],
              () => {
                resolve({ orderNo, paidAt });
              },
              (_, error) => {
                reject(error);
                return false;
              }
            );
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const getTodayStats = (): Promise<TodayStats> => {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];

    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT COUNT(*) as order_count, SUM(total_price) as total_revenue
           FROM orders
           WHERE DATE(created_at) = ? AND status = 'paid'`,
          [today],
          (_, result) => {
            const row = result.rows.item(0);
            resolve({
              date: today,
              order_count: row.order_count || 0,
              total_revenue: row.total_revenue || 0,
            });
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};

export const getTodayOrders = (): Promise<Order[]> => {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];

    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT id, order_no, items, total_price, paid_at
           FROM orders
           WHERE DATE(created_at) = ? AND status = 'paid'
           ORDER BY paid_at DESC`,
          [today],
          (_, result) => {
            const orders: Order[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              const row = result.rows.item(i);
              orders.push({
                id: row.id,
                order_no: row.order_no,
                items: JSON.parse(row.items),
                total_price: row.total_price,
                status: 'paid',
                created_at: '',
                paid_at: row.paid_at,
              });
            }
            resolve(orders);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      (error) => reject(error)
    );
  });
};
