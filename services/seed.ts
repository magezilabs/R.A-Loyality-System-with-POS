import { SQLiteDatabase } from 'expo-sqlite';

export async function seedDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    DELETE FROM menu_items;
    DELETE FROM orders;
    DELETE FROM customers;
    DELETE FROM order_items;
    DELETE FROM loyalty_redemptions;
    DELETE FROM staff;
  `);

  await db.execAsync(`
    INSERT INTO menu_items (id, name, price, category, is_available) VALUES
      ('m1', '🍔 Burger', 5000, 'Fast Food', 1),
      ('m2', '🍕 Pizza', 8000, 'Fast Food', 1),
      ('m3', '☕ Coffee', 3000, 'Drinks', 1),
      ('m4', '🍧 Ice Cream', 4000, 'Dessert', 1),
      ('m5', '🍟 Fries', 2500, 'Fast Food', 1);
  `);

  await db.execAsync(`
    INSERT INTO customers (id, phone, points, email, is_anonymous, created_at) VALUES
      ('c1', '0701000001', 50, 'a@example.com', 0, ${Date.now()}),
      ('c2', '0701000002', 20, 'b@example.com', 0, ${Date.now()}),
      ('c3', '0701000003', 0, '', 1, ${Date.now()}),
      ('c4', '0701000004', 15, 'd@example.com', 0, ${Date.now()}),
      ('c5', '0701000005', 80, 'e@example.com', 0, ${Date.now()});
  `);

  await db.execAsync(`
    INSERT INTO orders (id, customer_id, total_amount, status, is_synced, created_at, decline_reason) VALUES
      ('o1', 'c1', 10500, 'approved', 0, ${Date.now()}, NULL),
      ('o2', 'c2', 3000, 'pending', 0, ${Date.now()}, NULL),
      ('o3', 'c3', 4000, 'declined', 0, ${Date.now()}, 'Payment failed'),
      ('o4', 'c4', 8000, 'approved', 1, ${Date.now()}, NULL),
      ('o5', 'c5', 5000, 'approved', 1, ${Date.now()}, NULL);
  `);

  await db.execAsync(`
    INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price) VALUES
      ('oi1', 'o1', 'm1', 1, 5000),
      ('oi2', 'o1', 'm5', 2, 2500),
      ('oi3', 'o2', 'm3', 1, 3000),
      ('oi4', 'o4', 'm2', 1, 8000),
      ('oi5', 'o5', 'm3', 2, 3000);
  `);

  await db.execAsync(`
    INSERT INTO loyalty_redemptions (customer_id, points, date) VALUES
      ('c1', 10, ${Date.now()}),
      ('c2', 5, ${Date.now()}),
      ('c3', 15, ${Date.now()}),
      ('c4', 20, ${Date.now()}),
      ('c5', 25, ${Date.now()});
  `);

  await db.execAsync(`
    INSERT INTO staff (id, name, pin, role) VALUES
      ('s1', 'James', '1234', 'admin'),
      ('s2', 'Linda', '4321', 'cashier'),
      ('s3', 'Michael', '5678', 'manager'),
      ('s4', 'Rose', '8765', 'cashier'),
      ('s5', 'Alex', '9999', 'support');
  `);

  await db.execAsync(`
    INSERT INTO staff (id, name, pin, role) VALUES
      ('s1', 'James', '1234', 'admin'),
      ('s2', 'Linda', '4321', 'cashier'),
      ('s3', 'Michael', '5678', 'manager'),
      ('s4', 'Rose', '8765', 'cashier'),
      ('s5', 'Alex', '9999', 'support');
  `);

  console.log('🌱 Seed data inserted.');
}
