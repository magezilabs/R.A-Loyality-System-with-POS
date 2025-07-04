import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { dbPromise } from './database';

export const syncLoyaltyData = async () => {
  const firestore = getFirestore();
  const db = dbPromise;

  const result = await db.execAsync(
    `SELECT c.id, c.phone, c.points FROM customers c
     JOIN orders o ON o.customer_id = c.id
     WHERE o.status = 'approved' AND o.is_synced = 0 AND c.id NOT LIKE 'anon_%'`
  );

  for (const customer of result.rows) {
    await setDoc(doc(firestore, 'loyalty', customer.id), {
      phone: customer.phone,
      points: customer.points,
      syncedAt: Date.now()
    });
  }

  // Optional: mark those orders as synced
  await db.execAsync(
    `UPDATE orders SET is_synced = 1 WHERE status = 'approved' AND is_synced = 0 AND customer_id NOT LIKE 'anon_%'`
  );
};
