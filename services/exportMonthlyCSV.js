import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';

export function FetchDb(){
    const db = useSQLiteContext();

 useEffect(()=>{
    FetchDb()
  }, [])

    return db
}


export const exportMonthlyCSV = async () => {
  const db = FetchDb();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const dir = FileSystem.documentDirectory + 'backups/';
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  // Orders CSV
  const filePath = `${dir}monthly_backup_${year}_${month}.csv`;
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

  // Login Logs CSV
  const loginLogPath = `${dir}login_logs_${year}_${month}.csv`;
  try {
    const loginResult = await db.execAsync(
      `SELECT id, staff_name, login_time, success FROM login_logs WHERE strftime('%m', datetime(login_time / 1000, 'unixepoch')) = ? AND strftime('%Y', datetime(login_time / 1000, 'unixepoch')) = ?`,
      [month, year]
    );
    const loginHeader = 'Log ID,Staff Name,Login Time,Success\n';
    const loginRows = loginResult.rows.map(row =>
      `${row.id},${row.staff_name},${new Date(row.login_time).toISOString()},${row.success ? 'Yes' : 'No'}`
    );
    const loginContent = loginHeader + loginRows.join('\n');
    await FileSystem.writeAsStringAsync(loginLogPath, loginContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });
  } catch (e) {
    // If login_logs table does not exist, skip
    console.warn('Login logs export skipped:', e.message);
  }

  return { orders: filePath, loginLogs: loginLogPath };
};
