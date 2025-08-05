import { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

const CREATE_TABLES = [
  `CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT,
    price INTEGER,
    category TEXT,
    is_available INTEGER
  );`,
  `CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    total_amount INTEGER,
    status TEXT,
    is_synced INTEGER,
    created_at INTEGER,
    decline_reason TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    phone TEXT,
    points INTEGER,
    email TEXT,
    is_anonymous INTEGER,
    created_at INTEGER
  );`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    menu_item_id TEXT,
    quantity INTEGER,
    unit_price INTEGER
  );`,
  `CREATE TABLE IF NOT EXISTS loyalty_redemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id TEXT,
    points INTEGER,
    date INTEGER
  );`,
  `CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT,
    pin TEXT,
    role TEXT
  );`,
];

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  try {
    const result = await db.getFirstAsync('PRAGMA user_version');
    const version = result?.user_version ?? 0;

    if (version >= DATABASE_VERSION) return;

    for (const sql of CREATE_TABLES) {
      await db.execAsync(sql);
    }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    //const { rows } = await db.execAsync("SELECT name FROM sqlite_master WHERE type='table'");
    //console.log('✅ Tables initialized:', rows.map((r: any) => r.name));
  } catch (err) {
    console.error('❌ Migration failed:', err);
    throw err;
  }
}
