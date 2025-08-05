import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
export function FetchDb(){
    const db = useSQLiteContext();

 useEffect(()=>{
    FetchDb()
  }, [])

    return db
}


export const getRewardOptions = () => [
  { points: 50, reward: 'Free Drink' },
  { points: 100, reward: '10% Discount' },
  { points: 200, reward: 'Free Meal' },
];

export const redeemPoints = async (customerId, pointsToRedeem) => {
  const db = FetchDb();
  const result = await db.execAsync(
    `SELECT points FROM customers WHERE id = ?`,
    [customerId]
  );
  const available = result.rows.length ? result.rows[0].points : 0;
  if (available < pointsToRedeem) {
    throw new Error('Not enough points');
  }

  await db.execAsync(
    `UPDATE customers SET points = points - ? WHERE id = ?`,
    [pointsToRedeem, customerId]
  );

  await db.execAsync(
    `INSERT INTO loyalty_redemptions (customer_id, points, date) VALUES (?, ?, ?)`,
    [customerId, pointsToRedeem, Date.now()]
  );

  return available - pointsToRedeem;
};
