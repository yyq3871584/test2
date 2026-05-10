from flask import Flask, jsonify, request, send_from_directory
import os
import sqlite3
import json
from datetime import datetime, date

app = Flask(__name__)
DATABASE = 'snack_shop.db'

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_no TEXT NOT NULL UNIQUE,
            items TEXT NOT NULL,
            total_price REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TEXT NOT NULL,
            paid_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/menu', methods=['GET'])
def get_menu():
    with open('menu.json', 'r', encoding='utf-8') as f:
        menu = json.load(f)
    return jsonify(menu)

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    items = data.get('items', [])
    total_price = data.get('total_price', 0)

    if not items:
        return jsonify({'error': '订单不能为空'}), 400

    order_no = datetime.now().strftime('%Y%m%d%H%M%S')
    created_at = datetime.now().isoformat()
    items_json = json.dumps(items, ensure_ascii=False)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO orders (order_no, items, total_price, status, created_at)
        VALUES (?, ?, ?, 'pending', ?)
    ''', (order_no, items_json, total_price, created_at))
    order_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        'id': order_id,
        'order_no': order_no,
        'message': '订单创建成功'
    }), 201

@app.route('/api/orders/<int:order_id>/pay', methods=['POST'])
def pay_order(order_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM orders WHERE id = ?', (order_id,))
    order = cursor.fetchone()

    if not order:
        conn.close()
        return jsonify({'error': '订单不存在'}), 404

    if order['status'] == 'paid':
        conn.close()
        return jsonify({'error': '订单已支付'}), 400

    paid_at = datetime.now().isoformat()
    cursor.execute('''
        UPDATE orders SET status = 'paid', paid_at = ? WHERE id = ?
    ''', (paid_at, order_id))
    conn.commit()
    conn.close()

    return jsonify({
        'message': '支付成功',
        'order_no': order['order_no'],
        'paid_at': paid_at
    })

@app.route('/api/stats/today', methods=['GET'])
def get_today_stats():
    today = date.today().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT COUNT(*) as order_count, SUM(total_price) as total_revenue
        FROM orders
        WHERE DATE(created_at) = ? AND status = 'paid'
    ''', (today,))
    row = cursor.fetchone()
    conn.close()

    return jsonify({
        'date': today,
        'order_count': row['order_count'] or 0,
        'total_revenue': row['total_revenue'] or 0
    })

@app.route('/api/orders/today', methods=['GET'])
def get_today_orders():
    today = date.today().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT order_no, items, total_price, paid_at
        FROM orders
        WHERE DATE(created_at) = ? AND status = 'paid'
        ORDER BY paid_at
    ''', (today,))
    orders = cursor.fetchall()
    conn.close()

    order_list = []
    for order in orders:
        items = json.loads(order['items'])
        order_list.append({
            'order_no': order['order_no'],
            'items': items,
            'total_price': order['total_price'],
            'paid_at': order['paid_at']
        })

    return jsonify({
        'date': today,
        'orders': order_list
    })

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
