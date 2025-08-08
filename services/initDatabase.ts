//just re export migrateDBifNeeded
import { migrateDbIfNeeded } from './database';
import { seedDatabase } from './seed';

export async function setupDatabase(db) {
  await migrateDbIfNeeded(db);

  // Optional: only seed in dev mode
  if (__DEV__) {
    await seedDatabase(db);
  }

}
