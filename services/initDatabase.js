import { dbPromise } from './database';

export const initializeTables = async () => {
  const db = await dbPromise;


  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT,
      price INTEGER,
      category TEXT,
      is_available INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      total_amount INTEGER,
      status TEXT,
      is_synced INTEGER,
      created_at INTEGER,
      decline_reason TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      phone TEXT,
      points INTEGER,
      email TEXT,
      is_anonymous INTEGER,
      created_at INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT,
      menu_item_id TEXT,
      quantity INTEGER,
      unit_price INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS loyalty_redemptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id TEXT,
      points INTEGER,
      date INTEGER
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT,
      pin TEXT,
      role TEXT
    );
  `);

   const tables = await db.execAsync("SELECT name FROM sqlite_master WHERE type='table'");
  console.log('Existing tables:', tables.rows);
};




