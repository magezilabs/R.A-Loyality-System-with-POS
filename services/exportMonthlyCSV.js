import * as FileSystem from 'expo-file-system';
import { dbPromise } from './database'; // Make sure database.js exports dbPromise

export const exportMonthlyCSV = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const dir = FileSystem.documentDirectory + 'backups/';
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  const filePath = `${dir}monthly_backup_${year}_${month}.csv`;

  const db = dbPromise;
  const result = await db.execAsync(
    `SELECT o.id as order_id, o.total_amount, o.created_at, c.phone as customer_phone, c.points 
     FROM orders o 
     LEFT JOIN customers c ON o.customer_id = c.id 
     WHERE o.status = 'approved' AND strftime('%m', datetime(o.created_at / 1000, 'unixepoch')) = ? 
     AND strftime('%Y', datetime(o.created_at / 1000, 'unixepoch')) = ?`,
    [month, year]
  );

  const header = 'Order ID,Total Amount,Created At,Customer Phone,Loyalty Points\n';
  const csvRows = result.rows.map(row =>
    `${row.order_id},${row.total_amount},${new Date(row.created_at).toISOString()},${row.customer_phone || 'anonymous'},${row.points || 0}`
  );
  const fileContent = header + csvRows.join('\n');

  await FileSystem.writeAsStringAsync(filePath, fileContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return filePath;
};
